# GOVERNANCE MEMORY MODEL

**"The Architecture of Institutional Retention"**

Tidak semua pengetahuan lahir setara. Mengingat segalanya adalah resep menuju kelumpuhan (*cognitive overload*). Sistem tata kelola kecerdasan buatan yang sehat harus tahu persis **apa yang harus diukir di atas batu, apa yang boleh diubah, dan apa yang harus segera dilupakan.**

Dokumen ini mendefinisikan lapisan klasifikasi memori (*Memory Classification Architecture*) dari organisasi.

---

## 1. STRATIFIKASI MEMORI (The Memory Layers)

Sistem mengklasifikasikan setiap dokumen, percakapan, dan keputusan ke dalam 5 lapisan retensi:

### L1: Immutable Constitutional Memory (Memori Konstitusional Abadi)
*   **Karakteristik:** Tidak dapat diubah oleh eskalasi operasional biasa. Perubahan di level ini membutuhkan perombakan *civilization-level*.
*   **Konten:** `SYSTEM_PHILOSOPHY.md`, `FORBIDDEN_ACTIONS.md`, `HUMAN_ACCOUNTABILITY_MODEL.md`.
*   **Retensi AI:** Diprioritaskan absolut (Prioritas 1) pada setiap *Context Assembly*. Tidak pernah kedaluwarsa (*No Decay*).

### L2: Long-Term Governance Memory (Memori Tata Kelola Jangka Panjang)
*   **Karakteristik:** Hukum arsitektur yang mengikat secara operasional namun dapat diamandemen jika sistem berevolusi.
*   **Konten:** *Architecture Decision Records (ADR)*, `TERMINOLOGY_SYSTEM.md`.
*   **Retensi AI:** Memiliki *Context Timestamp*. Membutuhkan *refresh* validasi secara periodik (misal: 12 bulan).

### L3: Operational Memory (Memori Operasional)
*   **Karakteristik:** Aturan harian yang sangat dinamis, spesifik pada modul atau rilis tertentu.
*   **Konten:** *Business Rules* per modul, *Workflow Logic*, Struktur *Database Schema* saat ini.
*   **Retensi AI:** AI wajib memverifikasi memori ini setiap terjadi *Pull Request* pada *domain* yang bersangkutan.

### L4: Temporary Working Memory (Memori Kerja Sementara)
*   **Karakteristik:** Fluktuasi kognitif harian. Ide, diskusi, asumsi, dan perdebatan yang belum mencapai finalitas.
*   **Konten:** Percakapan mentah (*Raw Chats*), Komentar PR, Catatan *brainstorming*.
*   **Retensi AI:** **Wajib dibuang (Flushed)** dari ruang penalaran (*reasoning space*) AI setelah resolusi (*approval*) dicapai. AI dilarang merujuk memori sementara untuk keputusan arsitektural.

### L5: Deprecated Memory (Memori Fosil/Pensiun)
*   **Karakteristik:** Pengetahuan yang pernah valid di masa lalu namun kini telah digantikan.
*   **Konten:** ADR usang, kebijakan lawas.
*   **Retensi AI:** Dikunci secara baca-saja (*Read-Only Archive*). AI hanya boleh mengakses memori ini secara historis untuk menjawab: *"Mengapa kita TIDAK lagi menggunakan teknologi X?"*

---

## 2. PENGELOLAAN OVERLOAD KOGNITIF (Cognitive Budgeting)

Setiap *Context Assembly* memiliki batas kapasitas token (*Context Budget*). 
*   **Prinsip Kompresi:** AI dilarang menarik L3 (Operational Memory) dari *domain* lain yang tidak relevan dengan tiket pekerjaan aktif.
*   **Peringatan Kepenuhan:** Jika tumpukan ADR (L2) terlalu membengkak hingga melebihi batas rasional manusia untuk memahaminya, AI wajib memicu sinyal *Governance Fatigue*, mengusulkan kompilasi dan penyederhanaan (Refactoring) terhadap aturan-aturan tersebut.
