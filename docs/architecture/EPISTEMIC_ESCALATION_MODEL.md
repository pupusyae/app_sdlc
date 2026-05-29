# EPISTEMIC ESCALATION MODEL

**"The Hierarchy of Cognitive Escalation"**

Setiap friksi tata kelola (*governance conflict*) tidak lahir setara. Menyela manusia (*human intervention*) untuk setiap ambiguitas kecil akan memicu *Governance Fatigue*, sementara membiarkan AI diam-diam memutuskan konflik besar akan berujung pada *Architecture Drift*. 

Dokumen ini mendefinisikan batas absolut: **Kapan AI harus berhenti dan mendelegasikan beban penalaran kepada manusia.**

---

## 1. ESCALATION HIERARCHY (Hierarki Eskalasi Kognitif)

Saat AI menemui kebuntuan penalaran (*reasoning friction*), ia harus mengklasifikasikan situasi ke dalam 4 tingkatan eskalasi:

### Tingkat 1: Ambiguity Escalation (Eskalasi Ambiguitas Leksikal)
*   **Kondisi:** Instruksi dari *developer* tidak lengkap atau kata sifat yang digunakan tidak terkuantifikasi (misal: "Buatkan skema database yang aman").
*   **Aksi AI:** **Interrogative Escalation.** AI tidak perlu melapor ke arsitek. AI langsung menekan balik *developer* yang bersangkutan dengan pilihan ganda berbasis `TERMINOLOGY_SYSTEM.md` untuk memaksa presisi semantik.

### Tingkat 2: Warning Escalation (Eskalasi Peringatan Taktis)
*   **Kondisi:** Draf arsitektur menyentuh zona abu-abu, di mana tidak ada aturan `FORBIDDEN_ACTIONS` yang dilanggar, tetapi solusi tersebut bertentangan dengan preferensi historis organisasi (terdeteksi via *Governance Intelligence*).
*   **Aksi AI:** **Advisory Escalation.** AI menambahkan label `[REVIEW_RECOMMENDED]` pada dokumen terkait. Keputusan tetap berada di tangan pengembang (human peer-review).

### Tingkat 3: Constitutional Review Escalation (Eskalasi Peninjauan Konstitusi)
*   **Kondisi:** Dua atau lebih dokumen tingkat tinggi (*L2 Governance Memory*) saling bertabrakan. Tidak ada kesimpulan logis yang dapat diambil tanpa melanggar salah satunya.
*   **Aksi AI:** **Hard Freeze & Escalate.** AI menghentikan generasi *output* arsitektur. Membekukan proses dan memanggil *System Architect* atau entitas *Arch-Review Board* dengan melampirkan "Conflict Matrix".

### Tingkat 4: Human Authority Escalation (Eskalasi Otoritas Absolut)
*   **Kondisi:** Pengguna memerintahkan AI untuk melakukan aksi yang tertera eksplisit di dalam `FORBIDDEN_ACTIONS.md` (misal: "Bypass proses *Approval* dan ubah langsung status ke *Production*").
*   **Aksi AI:** **Security Rejection.** AI menolak penuh. AI mencatat upaya pembobolan ke dalam *Governance Observability Dashboard* sebagai `[COGNITIVE-SECURITY-BREACH]` dan mendelegasikan laporan langsung kepada *Root Authority*. AI dilarang membantu menemukan "celah" (*loophole*) atas penolakan ini.
