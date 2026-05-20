import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

async function upsertUser(email: string, password: string, adSoyad: string, rol: string): Promise<void> {
  let userRecord: admin.auth.UserRecord;

  try {
    userRecord = await admin.auth().getUserByEmail(email);
  } catch {
    userRecord = await admin.auth().createUser({ email, password, displayName: adSoyad });
  }

  await db.collection("users").doc(userRecord.uid).set({
    adSoyad,
    email,
    rol,
    aktif: true,
  }, { merge: true });
}

async function run(): Promise<void> {
  await upsertUser("talep@example.com", "Test1234!", "Talep Acan Kullanici", "TalepAcan");
  await upsertUser("yonetici@example.com", "Test1234!", "Yonetici Kullanici", "Yonetici");
  await upsertUser("saha@example.com", "Test1234!", "Saha Personeli Kullanici", "SahaPersoneli");
  console.log("Seed tamamlandi.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
