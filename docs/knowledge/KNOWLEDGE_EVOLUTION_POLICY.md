# KNOWLEDGE EVOLUTION POLICY

**"The Mechanism of Epistemic Adaptation"**

Pengetahuan dalam rekayasa perangkat lunak bukanlah dogma statis. Arsitektur harus berevolusi, aturan bisnis berubah, dan terminologi dapat memuai (*expand*). Namun, evolusi tanpa rekam jejak adalah anarki.

Dokumen ini mengatur bagaimana sistem—baik Manusia maupun AI—diizinkan memperbarui pengetahuan organisasi tanpa meruntuhkan stabilitas epistemologis.

---

## 1. VERSIONING KNOWLEDGE (Versi Pengetahuan Tata Kelola)

Setiap *Long-Term Governance Memory* (ADR, Aturan Bisnis) diperlakukan layaknya basis data relasional.

1.  **Drafting:** Setiap usulan perubahan (e.g. mengganti arsitektur *Caching*) diajukan dalam mode *Draft Proposal*. AI melakukan analisis dampak (*Impact Analysis*) ke seluruh sistem.
2.  **Immutability Rule:** Jika usulan tersebut disetujui, ADR yang lama tidak pernah ditimpa (di-*overwrite*) secara destruktif. Dokumen lama statusnya diubah menjadi `[DEPRECATED]` dan dokumen baru lahir dengan ID *successor* yang jelas.
3.  **Traceability:** Setiap dokumen pengetahuan baru wajib mencantumkan jejak keputusan (`DECISION_TRACEABILITY_MODEL`), menjawab: *"Keputusan ini merevisi apa, dan atas dasar insiden/kebutuhan apa?"*

---

## 2. INSTITUTIONAL MEMORY RETENTION POLICY (Kebijakan Retensi Memori Institusi)

Sistem beroperasi berdasarkan hukum kompresi agar otak manusia dan *context window* AI tidak sesak oleh tumpukan utang pengetahuan (*Knowledge Debt*).

### A. Apa yang Boleh Didepresiasi (Deprecated)
*   Aturan *workflow* fitur lawas yang sudah pensiun.
*   ADR terkait teknologi yang sudah di-migrasi penuh.
*   *(Tindakan: Masuk ke dalam L5 Deprecated Memory. Tidak dimasukkan dalam konteks aktif AI)*.

### B. Apa yang Boleh Diarsipkan (Archived)
*   Catatan rapat, hasil eksplorasi teknis gagal (*failed PoC logs*), diskusi chat yang telah ditutup.
*   *(Tindakan: Disimpan di penyimpanan dingin (cold storage), tidak diindeks oleh mesin pencari Governance utama).*

### C. Apa yang Harus Abadi (Immutable)
*   Filosofi inti, batas wewenang, dan catatan insiden fatal (*Post-Mortem of Major Failures*).
*   *(Tindakan: Disuntikkan sebagai tameng abadi yang memperingatkan AI di masa depan agar tidak mengulangi kesalahan konseptual yang sama).*

---

## 3. SEMANTIC DRIFT DETECTION (Deteksi Pergeseran Makna)

AI bertindak sebagai Polisi Semantik. Seiring berjalannya waktu, kata sandang (*buzzwords*) baru sering meresap ke dalam tim pengembang. 

*   **Peringatan Polusi:** Jika AI mendeteksi pengembang mulai menggunakan kata "Event-Driven" untuk modul yang aslinya disepakati sebagai "Batch Processing", AI tidak boleh beradaptasi dengan kesalahan tersebut.
*   **Intervensi Otoritatif:** AI wajib mengirimkan peringatan: *"Terdeteksi pergeseran semantik. Istilah 'Event-Driven' tidak sesuai dengan status arsitektur aktif modul ini. Tolong kembalikan ke istilah resmi, atau ajukan amandemen arsitektur (ADR)."*
