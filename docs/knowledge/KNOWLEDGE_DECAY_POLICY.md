# KNOWLEDGE DECAY POLICY

**"Managing the Obsolescence of Truth"**

Dalam peradaban *software engineering*, pengetahuan yang benar hari ini dapat berubah menjadi toksik esok hari. Menggunakan konteks yang sudah "basi" (*stale context*) untuk menyuplai penalaran AI adalah resep menuju halusinasi kognitif massal.

Dokumen ini mengatur "hukum kepikunan terprogram" (*programmed obsolescence*) pada memori institusi, memastikan tata kelola tidak membeku menjadi fosil birokrasi.

---

## 1. CONTEXT OBSOLESCENCE (Kebasi-an Konteks)

Pengetahuan teknis (e.g. ADR infrastruktur, standar *library*) memiliki batas waktu kelayakan yang harus di-ukur.

*   **Peringatan Tanda Penuaan (Aging Alert):** Jika sebuah ADR telah berusia lebih dari 18 bulan tanpa ada *Pull Request* atau audit ulang yang menyentuh domainnya, AI otomatis memberikan stempel `[AGING_CONTEXT]`.
*   **Perlakuan AI:** Saat ditugaskan membangun fitur baru di modul tersebut, AI tidak diizinkan menelan ADR tersebut bulat-bulat. AI harus memicu konfirmasi: *"Landasan arsitektur modul ini (ADR-X) sudah melewati masa penuaan teknis. Apakah asumsi performa dan keamanan di dokumen ini masih berlaku?"*

## 2. GOVERNANCE EXPIRATION (Kedaluwarsa Aturan)

Beberapa kebijakan dibuat khusus untuk mengatasi insiden spesifik, dan tidak selamanya berlaku. 

*   **Time-To-Live (TTL) pada Aturan Sementara:** Kebijakan *Hotfix* atau pengamanan darurat harus memiliki *timestamp* kedaluwarsa eksplisit. (Misal: *"Fitur X dinonaktifkan sementara hingga batas [Tanggal] untuk mitigasi load server"*).
*   **Auto-Pruning:** AI akan secara proaktif menyodorkan aturan-aturan yang telah melewati masa TTL kepada Arsitek untuk dimusnahkan secara resmi (*Deprecated*).

## 3. SEMANTIC REVALIDATION (Revalidasi Semantik)

Seiring pergantian generasi tim (atau pergantian vendor LLM), makna sebuah *term* bisa mengalami mutasi.

*   Sistem secara periodik memindai istilah-istilah di `TERMINOLOGY_SYSTEM.md`. Jika AI mendeteksi bahwa kata "Supervisor" mulai jarang dipakai di *pull requests*, melainkan *developer* lebih sering memakai "Approver", maka AI akan mengajukan proposal **Revalidasi Semantik** untuk membersihkan glosarium dari entitas-entitas hantu (*ghost terms*).

---

Tanpa *Knowledge Decay Policy*, sebuah AI tidak sedang berpikir; ia hanya akan mendaur ulang aturan mati yang perlahan mencekik kelincahan (*agility*) institusinya sendiri.
