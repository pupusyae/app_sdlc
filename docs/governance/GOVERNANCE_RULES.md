# GOVERNANCE RULES & LIFECYCLE

**"The Rule of Law in Cognitive Engineering"**

Dokumen ini mendefinisikan siklus hidup tata kelola (*Governance Lifecycle*), mekanisme penegakan aturan (*Enforcement Model*), dan hukum tak tertulis yang menjaga agar infrastruktur tidak menjadi fosil birokrasi, namun tetap beradaptasi tanpa mengorbankan keamanan institusional.

---

## 1. GOVERNANCE ENFORCEMENT MODEL (Model Penegakan Tata Kelola)

Semua peringatan dari AI atau sistem terkait pelanggaran tata kelola diklasifikasikan ke dalam 3 level penegakan:

### A. Blocking Governance (Kritis - Wajib Berhenti)
Kondisi di mana sistem **harus menghentikan proses (*block*)** dan menolak *merge* atau eksekusi.
*   **Contoh:** Pelanggaran *Module Boundary*, konflik langsung dengan ADR yang masih aktif, atau penghapusan tabel database tanpa mitigasi audit.
*   **Aksi AI:** AI wajib membatalkan (*refuse*) instruksi dan meminta intervensi / eskalasi otoritas.

### B. Warning Governance (Peringatan Tinggi - Wajib Evaluasi)
Kondisi yang diizinkan untuk dilanjutkan, tetapi memicu bendera merah (*red flag*) yang wajib direview.
*   **Contoh:** Penambahan dependensi paket pihak ketiga, perubahan *timeout* servis, atau penambahan atribut pada entitas kritikal.
*   **Aksi AI:** AI dapat memproses *draft*, namun mewajibkan pelabelan *REVIEW_REQUIRED* pada berkas PR atau dokumen terkait.

### C. Advisory Governance (Rekomendasi - Opsional)
Kondisi rekomendasi praktik terbaik.
*   **Contoh:** Refactoring nama fungsi internal, peningkatan *code readability*, atau pengubahan sintaks agar lebih ringkas.
*   **Aksi AI:** AI memberikan saran di kolom komentar tanpa mengubah alur logika utama.

---

## 2. GOVERNANCE LIFECYCLE (Siklus Hidup Konstitusi)

Aturan tidak abadi. Mereka lahir, berevolusi, membusuk, dan akhirnya diarsipkan. Siklus hidup ini memastikan sistem kebal terhadap *Governance Fatigue* (kelelahan birokrasi).

1. **Inisiasi (Proposal):** Setiap perubahan ADR atau aturan tata kelola harus melewati fase usulan. AI bertugas menyimulasikan dampak perubahan ini terhadap *Domain Boundary* dan *Workflow* yang ada.
2. **Pengesahan (Approval):** Hanya entitas manusia dengan kewenangan spesifik (Arch-Review Board) yang dapat mengunci usulan menjadi Hukum Aktif.
3. **Observasi & Kelelahan (Friction/Fatigue Tracking):** Sistem mendeteksi seberapa sering manusia mencoba mem-*bypass* aturan ini, atau seberapa sering AI harus memblokir eksekusi akibat aturan ini.
4. **Penyederhanaan (Simplification Trigger):** Jika gesekan (*friction*) melebihi ambang batas, aturan wajib dimasukkan ke dalam antrean penyederhanaan. Aturan yang usang dilarang dipertahankan hanya demi kepatuhan buta.
5. **Depresiasi (Deprecation):** ADR atau Aturan Bisnis yang sudah digantikan akan dikunci secara imutabel sebagai *Historical Reference* di `GOVERNANCE_MEMORY_MODEL`, bukan dihapus.

---

## 3. GOVERNANCE CONFLICT RESOLUTION (Resolusi Konflik Tata Kelola)

Ketika AI mendeteksi bahwa dua dokumen saling bertentangan (Misalnya: ADR-001 mengizinkan caching global, tetapi *Security Standard* terbaru melarang caching memori tak terenripsi), maka:

1. **AI dilarang mengambil keputusan di antara keduanya.**
2. AI wajib **melaporkan persimpangan tersebut (*Escalate*)** beserta dampaknya jika A atau B dipilih.
3. Manusia wajib mengeluarkan **Constitutional Exception** atau merevisi salah satu dari dokumen tersebut sebelum AI dapat melanjutkan penalaran arsitekturalnya.

---

## 4. EMERGENCY OVERRIDE PROCEDURE (Prosedur Pengambilalihan Darurat)

Dalam kondisi insiden produksi (*Production Incident*) atau kebuntuan arsitektur yang mengancam nyawa sistem (*System Critical Block*):

*   Manusia **diizinkan mem-bypass seluruh tata kelola kognitif (Governance Bypass).**
*   Namun, *bypass* ini harus menggunakan *flag* khusus (`[EMERGENCY-OVERRIDE]`) yang seketika mencatatkan utang teknis kognitif pada *Post-Incident Review*.
*   Sistem AI tidak boleh menghalangi *Emergency Override* manusia, melainkan berubah mode menjadi *Tracing Mode*—sekadar mencatat setiap perubahan liar yang dilakukan manusia untuk dikonstitusikan kembali di esok hari.
