# TERMINOLOGY SYSTEM

**"The Semantic Foundation of Epistemology"**

Sebagian besar runtuhnya arsitektur bermula dari erosi makna. Ketika "Hapus" (*Delete*) bagi tim A berarti pemusnahan data fisik, namun bagi tim B berarti penandaan lunak (*Soft-Delete*), maka kecerdasan buatan (AI) yang memproses instruksi tersebut akan menghasilkan bencana asimetris.

Dokumen ini bukanlah sebuah glosarium kamus statis. Ini adalah **Semantic Governance Layer**—mesin yang memastikan bahasa yang digunakan untuk memerintah sistem, terstandardisasi, tunggal, dan tidak terdistorsi.

---

## 1. SEMANTIC RELATIONSHIP MAPPING (Pemetaan Relasi Makna)

AI dilarang menggunakan atau menyimpulkan kosakata sinonim secara acak. Setiap operasi kritikal memiliki *Semantic Map* ketat:

**Contoh Entitas Makna: `APPROVE`**
*   **Definisi Absolut:** Tindakan memberikan otoritas final untuk melanjutkan sebuah proses transaksional atau arsitektural.
*   **Related Concept:** `VERIFY` (Tindakan memeriksa kebenaran, namun belum memberikan otorisasi kelanjutan).
*   **Forbidden Synonym (Dilarang Mutlak):** `PUBLISH`, `CONFIRM`, `OKAY`.
*   **Authority Required:** Wajib dimiliki oleh peran *Manager* atau *Architect*.
*   **Audit Required:** Yes (Wajib dicatat di Immutable Log).

---

## 2. CONSTITUTIONAL LANGUAGE POLICY (Kebijakan Bahasa Konstitusional)

Untuk menjaga *Reasoning Quality* dari AI, sistem memberlakukan standar komunikasi:

### A. Forbidden Ambiguous Language (Larangan Bahasa Ambiguitas)
Dilarang menggunakan kata sifat dan keterangan ukur yang tidak terkuantifikasi dalam mendefinisikan *Business Rule* atau instruksi AI.
*   **Salah:** "Pastikan sistem *berjalan cepat* dan *aman*."
*   **Konstitusional:** "Pastikan respons API berada di bawah *200ms (p99)* dan terautentikasi melalui *HMAC-SHA256*."

### B. Semantic Precision Rules (Aturan Presisi Makna)
AI secara aktif akan mendeteksi pembusukan leksikal. Jika pengguna meminta *"Tolong hapus pengguna ini dari database"*, AI harus mendeteksi ambiguitas semantik dan membalas:
*"Perintah ditolak karena ketidaktepatan semantik. Apakah Anda bermaksud melakukan `Hard-Delete` (Pemusnahan permanen) atau `Soft-Delete` (Pencabutan akses)? Rujuk TERMINOLOGY_SYSTEM."*

### C. Cognitive Compression Standard (Standar Kompresi Kognitif)
Agar tidak membebani memori, istilah tidak boleh berlebihan. Jika konsep `Deactivate` dan `Suspend` merujuk pada hasil akhir komputasi yang identik secara logika *database*, salah satunya harus dimusnahkan (*Deprecated*) dari glosarium.

---

## 3. SEMANTIC DRIFT VALIDATION (Validasi Pembusukan Makna)

AI bertugas melakukan *background scanning* terhadap PR (*Pull Requests*) dan ADR (*Architecture Decision Records*).
*   **Deteksi Mutasi:** Jika AI mendeteksi bahwa *developer* mulai menggunakan kata "Archive" untuk merujuk ke data cadangan (*backup*) padahal glosarium menetapkannya sebagai data historis statis, AI wajib mengibarkan bendera `[SEMANTIC-CONFLICT]`.
*   **Koreksi Paksa:** Manusia harus memilih: menyesuaikan kode agar kembali ke glosarium lama, atau meresmikan makna baru ini melalui *Knowledge Evolution Policy*.
