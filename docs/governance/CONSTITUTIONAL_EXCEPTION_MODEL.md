# CONSTITUTIONAL EXCEPTION MODEL

**"The Legality of Breaking the Law"**

Tata kelola yang tidak mengizinkan adanya pengecualian darurat akan berakhir menjadi penjara yang mematikan inisiatif. Dalam kondisi perang operasional (e.g., *Server Down*, *Zero-Day Exploit*, Krisis Transaksi), birokrasi arsitektural tidak boleh memperlambat pemulihan.

Namun, pelanggaran terhadap aturan harus tetap menjadi bagian dari aturan itu sendiri (*Constitutional Exception*). Dokumen ini melegalkan prosedur mem-*bypass* AI dan sistem tata kelola, namun memastikannya tetap terlacak dan dapat diaudit.

---

## 1. KATEGORI PENGECUALIAN DARURAT (Exception Categories)

Pengecualian tidak boleh digunakan untuk sekadar menutupi keterlambatan *deadline* proyek. Pengecualian hanya sah pada kategori berikut:

### A. Emergency Override (Pemulihan Insiden)
*   **Kondisi:** Penambalan (*hotfix*) langsung ke lingkungan produksi untuk menghentikan kerugian finansial atau kebocoran data.
*   **Legalisasi:** Manusia diizinkan menggabungkan kode (*merge code*) tanpa melalui validasi `REASONING_QUALITY_MODEL` dari AI.
*   **Jejak Audit:** Perintah wajib disematkan tag `[EMERGENCY-OVERRIDE]`. AI otomatis beralih ke *Tracing Mode*—mencatat semua mutasi sistem tanpa memblokir.

### B. Temporary Governance Suspension (Penangguhan Tata Kelola Sementara)
*   **Kondisi:** Pelaksanaan proyek eksperimental (*Proof of Concept* / PoC) yang memerlukan kebebasan eksplorasi tanpa batas.
*   **Legalisasi:** Modul spesifik dilindungi dari *Governance Reasoning Engine*.
*   **Jejak Audit:** Harus menggunakan tag `[EXPERIMENTAL-SUSPENSION]`. AI tidak akan memvalidasi *Semantic Drift* di radius modul ini. Modul ini dilarang keras memasuki status *Production* sebelum tata kelola ditegakkan kembali.

### C. Crisis Architecture Decision (Keputusan Arsitektur Krisis)
*   **Kondisi:** Modifikasi mendasar pada komponen L2 (*Long-Term Memory*) di bawah tekanan waktu, mengabaikan *Knowledge Evolution Policy*.
*   **Legalisasi:** Diizinkan hanya jika dideklarasikan langsung oleh *System Architect*.

---

## 2. POST-EXCEPTION RECOVERY (Pemulihan Pasca-Pengecualian)

Hukum mutlak dari sistem pengecualian ini adalah **Reconciliation Debt** (Utang Rekonsiliasi).

*   Begitu krisis (misal: 2x24 jam setelah `[EMERGENCY-OVERRIDE]`) mereda, sistem akan langsung menagih pertanggungjawaban.
*   **AI Audit Trigger:** AI secara otomatis menghasilkan draf laporan: *"Mendeteksi 4 pelanggaran batas modul selama Emergency Override. Apakah pelanggaran ini akan dijadikan arsitektur permanen (Membutuhkan revisi ADR), atau akan dilakukan refactoring untuk mengembalikan sistem ke konstitusi semula?"*
*   Jika utang rekonsiliasi ini tidak diselesaikan, tingkat *EPISTEMIC TRUST* keseluruhan proyek akan diturunkan.
