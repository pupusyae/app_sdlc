# REASONING QUALITY MODEL

**"Evaluating the Quality of Thinking"**

Karena framework ini bukanlah alat pencetak fitur, melainkan pengawal kualitas penalaran, maka kualitas *reasoning*—baik yang dihasilkan oleh AI maupun yang disetujui oleh manusia—harus dapat diukur, diaudit, dan diperbaiki secara sistematis.

Dokumen ini mendefinisikan matriks evaluasi dari *AI Governance Evaluation Model*.

---

## 1. REASONING QUALITY METRICS (Matriks Evaluasi Kognitif)

Setiap proposal arsitektur yang diajukan oleh AI dinilai berdasarkan 5 pilar kualitas penalaran:

### A. Reasoning Completeness (Kelengkapan Penalaran)
*   **Pemeriksaan:** Apakah usulan ini mempertimbangkan seluruh *lifecycle*? (Misal: tidak hanya membahas bagaimana membuat data, tetapi juga memikirkan *retention policy*, *audit log*, dan keamanan hapus).
*   **Target:** 0% usulan (*proposal*) yang mengabaikan jalur pengecualian (*unhappy paths/edge cases*).

### B. Governance Awareness (Kesadaran Tata Kelola)
*   **Pemeriksaan:** Apakah AI mendeteksi risiko pelanggaran otorisasi? Apakah ia mengingatkan tentang *Forbidden Actions*?
*   **Target:** Setiap usulan harus mengutip minimal 1 dokumen *governance* yang relevan sebagai landasan argumentasinya.

### C. Context Adherence (Kepatuhan Konteks)
*   **Pemeriksaan:** Seberapa patuh AI terhadap hierarki konteks? Apakah AI malah menggunakan pengetahuannya sendiri (halusinasi eksternal) alih-alih merujuk pada `TERMINOLOGY_SYSTEM.md` internal?
*   **Target:** 100% *Traceability* ke sumber konteks internal.

### D. Semantic Consistency (Konsistensi Semantik)
*   **Pemeriksaan:** Apakah AI menggunakan jargon yang tervalidasi? (Misal: secara disiplin membedakan antara `Suspend` dan `Delete` sesuai konstitusi proyek).
*   **Target:** 0% *Semantic Drift* atau penemuan istilah *orphan* pada draf arsitektur.

### E. Architectural Consistency (Konsistensi Arsitektural)
*   **Pemeriksaan:** Apakah desain baru ini memaksa masuknya *dependency* yang bertentangan dengan filosofi *Simplicity Preservation*?
*   **Target:** Pelestarian integritas *Module Boundaries* tanpa kebocoran abstrak.

---

## 2. REASONING ESCALATION THRESHOLD (Ambang Batas Eskalasi)

Sistem akan secara otomatis mengevaluasi draf (*self-evaluate*). 

*   Jika **Governance Awareness** bernilai rendah (AI mengusulkan perubahan tanpa menyentuh aspek auditabilitas), usulan tersebut tidak boleh diajukan ke manusia untuk persetujuan.
*   **Tindakan:** AI wajib merefleksikan kegagalannya secara internal, mencari *missing context*, dan melakukan regenerasi penalaran sebelum berani menyajikannya ke layar *user*.
