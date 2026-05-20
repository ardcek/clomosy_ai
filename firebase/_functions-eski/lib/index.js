"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const dotenv = __importStar(require("dotenv"));
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const https_1 = require("firebase-functions/v2/https");
dotenv.config();
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
const statusTransitions = {
    Acik: ["Atandi"],
    Atandi: ["Yolda"],
    Yolda: ["Islemde"],
    Islemde: ["Beklemede", "Tamamlandi"],
    Beklemede: ["Islemde", "Tamamlandi"],
    Tamamlandi: [],
};
function getSlaHours(oncelik) {
    switch (oncelik) {
        case "Kritik":
            return 2;
        case "Yuksek":
            return 4;
        case "Orta":
            return 8;
        default:
            return 24;
    }
}
function toIsoFromNow(hours) {
    const date = new Date(Date.now() + hours * 60 * 60 * 1000);
    return date.toISOString();
}
function parseBearerToken(authHeader) {
    if (!authHeader) {
        return null;
    }
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return null;
    }
    return parts[1];
}
async function requireAuth(req, res) {
    const token = parseBearerToken(req.headers.authorization);
    if (!token) {
        res.status(401).json({ error: "Token zorunlu." });
        return null;
    }
    const decoded = await admin.auth().verifyIdToken(token).catch(() => null);
    if (!decoded) {
        res.status(401).json({ error: "Gecersiz token." });
        return null;
    }
    const userDoc = await db.collection("users").doc(decoded.uid).get();
    if (!userDoc.exists) {
        res.status(403).json({ error: "Kullanici profili bulunamadi." });
        return null;
    }
    const role = userDoc.get("rol");
    if (!role) {
        res.status(403).json({ error: "Rol bilgisi eksik." });
        return null;
    }
    return { uid: decoded.uid, role };
}
function mustRole(ctx, allowed, res) {
    if (!allowed.includes(ctx.role)) {
        res.status(403).json({ error: "Bu islem icin yetkiniz yok." });
        return false;
    }
    return true;
}
app.post("/login", async (req, res) => {
    try {
        const email = String(req.body?.email || "");
        const password = String(req.body?.password || "");
        if (!email || !password) {
            res.status(400).json({ error: "Email ve password zorunlu." });
            return;
        }
        const apiKey = process.env.FIREBASE_API_KEY;
        if (!apiKey) {
            res.status(500).json({ error: "FIREBASE_API_KEY tanimli degil." });
            return;
        }
        const authResp = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true,
            }),
        });
        if (!authResp.ok) {
            res.status(401).json({ error: "Giris basarisiz." });
            return;
        }
        const authBody = await authResp.json();
        const userDoc = await db.collection("users").doc(authBody.localId).get();
        if (!userDoc.exists) {
            res.status(403).json({ error: "Kullanici profili bulunamadi." });
            return;
        }
        res.json({
            token: authBody.idToken,
            user: {
                id: userDoc.id,
                adSoyad: userDoc.get("adSoyad"),
                email: userDoc.get("email"),
                rol: userDoc.get("rol"),
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: `Beklenmeyen hata: ${String(error)}` });
    }
});
app.post("/tickets", async (req, res) => {
    const ctx = await requireAuth(req, res);
    if (!ctx || !mustRole(ctx, ["TalepAcan"], res)) {
        return;
    }
    const baslik = String(req.body?.baslik || "").trim();
    const aciklama = String(req.body?.aciklama || "").trim();
    const konum = String(req.body?.konum || "").trim();
    const oncelik = String(req.body?.oncelik || "Orta").trim();
    if (!baslik || !konum) {
        res.status(400).json({ error: "Baslik ve konum zorunlu." });
        return;
    }
    const now = new Date().toISOString();
    const docRef = db.collection("tickets").doc();
    const ticketNo = `ARZ-${Date.now()}`;
    await docRef.set({
        ticketNo,
        baslik,
        aciklama,
        konum,
        oncelik,
        durum: "Acik",
        talepAcanId: ctx.uid,
        atananPersonelId: "",
        createdAt: now,
        updatedAt: now,
        slaDeadline: toIsoFromNow(getSlaHours(oncelik)),
    });
    await docRef.collection("events").add({
        fromStatus: "",
        toStatus: "Acik",
        changedBy: ctx.uid,
        changedAt: now,
        note: "Talep olusturuldu",
    });
    res.status(201).json({ id: docRef.id, ticketNo, status: "Acik" });
});
app.get("/tickets", async (req, res) => {
    const ctx = await requireAuth(req, res);
    if (!ctx) {
        return;
    }
    const durum = String(req.query.durum || "");
    const scope = String(req.query.scope || "");
    let query = db.collection("tickets");
    if (ctx.role === "TalepAcan") {
        query = query.where("talepAcanId", "==", ctx.uid);
    }
    else if (ctx.role === "SahaPersoneli" || scope === "mine") {
        query = query.where("atananPersonelId", "==", ctx.uid);
    }
    if (durum) {
        query = query.where("durum", "==", durum);
    }
    const snapshot = await query.orderBy("createdAt", "desc").limit(100).get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ items });
});
app.post("/tickets/:ticketId/assign", async (req, res) => {
    const ctx = await requireAuth(req, res);
    if (!ctx || !mustRole(ctx, ["Yonetici"], res)) {
        return;
    }
    const ticketId = String(req.params.ticketId || "");
    const personelId = String(req.body?.personelId || "").trim();
    if (!ticketId || !personelId) {
        res.status(400).json({ error: "ticketId ve personelId zorunlu." });
        return;
    }
    const ticketRef = db.collection("tickets").doc(ticketId);
    const ticketDoc = await ticketRef.get();
    if (!ticketDoc.exists) {
        res.status(404).json({ error: "Talep bulunamadi." });
        return;
    }
    const activeTicketSnap = await db.collection("tickets")
        .where("atananPersonelId", "==", personelId)
        .where("durum", "in", ["Atandi", "Yolda", "Islemde", "Beklemede"])
        .get();
    if (activeTicketSnap.size >= 5) {
        res.status(409).json({ error: "Personel aktif is limitine ulasti." });
        return;
    }
    const now = new Date().toISOString();
    await ticketRef.update({
        atananPersonelId: personelId,
        durum: "Atandi",
        updatedAt: now,
    });
    await ticketRef.collection("events").add({
        fromStatus: ticketDoc.get("durum"),
        toStatus: "Atandi",
        changedBy: ctx.uid,
        changedAt: now,
        note: `Personel atamasi: ${personelId}`,
    });
    res.json({ id: ticketId, status: "Atandi" });
});
app.post("/tickets/:ticketId/status", async (req, res) => {
    const ctx = await requireAuth(req, res);
    if (!ctx || !mustRole(ctx, ["SahaPersoneli"], res)) {
        return;
    }
    const ticketId = String(req.params.ticketId || "");
    const newStatus = String(req.body?.newStatus || "").trim();
    const note = String(req.body?.note || "").trim();
    if (!ticketId || !newStatus) {
        res.status(400).json({ error: "ticketId ve newStatus zorunlu." });
        return;
    }
    const ticketRef = db.collection("tickets").doc(ticketId);
    const ticketDoc = await ticketRef.get();
    if (!ticketDoc.exists) {
        res.status(404).json({ error: "Talep bulunamadi." });
        return;
    }
    if (ticketDoc.get("atananPersonelId") !== ctx.uid) {
        res.status(403).json({ error: "Bu talep size atanmamis." });
        return;
    }
    const currentStatus = ticketDoc.get("durum");
    const allowed = statusTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
        res.status(409).json({
            error: "Gecersiz durum gecisi.",
            currentStatus,
            requestedStatus: newStatus,
            allowedTransitions: allowed,
        });
        return;
    }
    const now = new Date().toISOString();
    await ticketRef.update({
        durum: newStatus,
        updatedAt: now,
    });
    await ticketRef.collection("events").add({
        fromStatus: currentStatus,
        toStatus: newStatus,
        changedBy: ctx.uid,
        changedAt: now,
        note,
    });
    res.json({ id: ticketId, status: newStatus });
});
exports.api = (0, https_1.onRequest)({ region: "europe-west1" }, app);
