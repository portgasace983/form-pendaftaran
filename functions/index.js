const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// 🔥 SUBMIT PENDAFTARAN
exports.submitPendaftaran = onCall(async (request) => {
  const {
    nama,
    domisili,
    tiktok,
    usia,
    english,
    pengalaman,
    mengetik,
    wa
  } = request.data;

  logger.info("Data masuk:", request.data);

  // ❌ VALIDASI
  if (!nama || !domisili || !wa) {
    throw new HttpsError("invalid-argument", "Field wajib belum lengkap");
  }

  // 🔥 CEK DUPLIKAT WA
  const check = await db
    .collection("datapendaftaran")
    .where("wa", "==", wa)
    .get();

  if (!check.empty) {
    throw new HttpsError("already-exists", "Nomor WA sudah terdaftar");
  }

  // 🔥 SIMPAN DATA
  const doc = await db.collection("datapendaftaran").add({
    nama,
    domisili,
    tiktok,
    usia,
    english,
    pengalaman,
    mengetik,
    wa,
    noRegistrasi: `R-${Date.now()}`,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  return {
    success: true,
    id: doc.id
  };
});