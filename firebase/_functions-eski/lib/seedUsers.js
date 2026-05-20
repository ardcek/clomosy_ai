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
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
async function upsertUser(email, password, adSoyad, rol) {
    let userRecord;
    try {
        userRecord = await admin.auth().getUserByEmail(email);
    }
    catch {
        userRecord = await admin.auth().createUser({ email, password, displayName: adSoyad });
    }
    await db.collection("users").doc(userRecord.uid).set({
        adSoyad,
        email,
        rol,
        aktif: true,
    }, { merge: true });
}
async function run() {
    await upsertUser("talep@example.com", "Test1234!", "Talep Acan Kullanici", "TalepAcan");
    await upsertUser("yonetici@example.com", "Test1234!", "Yonetici Kullanici", "Yonetici");
    await upsertUser("saha@example.com", "Test1234!", "Saha Personeli Kullanici", "SahaPersoneli");
    console.log("Seed tamamlandi.");
}
run().catch((err) => {
    console.error(err);
    process.exit(1);
});
