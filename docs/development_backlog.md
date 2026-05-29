# THE COGNITIVE SDLC WORKSPACE
## Master Development Backlog (Phase A & B)

Sebagai *Senior System Analyst*, berikut adalah spesifikasi tugas (*Task Breakdown*) terperinci yang saya susun untuk tim *engineering* Anda. Seluruh tugas ini dirancang untuk memastikan mereka tidak sekadar "membangun aplikasi chat", melainkan membangun **Governance-Centered AI Engineering Environment**.

Backlog ini difokuskan pada penyelesaian **Phase A (Cognitive Workspace MVP)** dan fondasi awal **Phase B (Governance Intelligence)**.

---

## EPIC 1: FRONTEND FOUNDATION & UX KOGNITIF
**Tujuan:** Membangun *Layer 1 (Discovery Workspace)* di mana pengguna berdiskusi tanpa memikirkan kerumitan tata kelola.

### Task 1.1: Setup Global Store & Cognitive State (Next.js)
*   **Konteks:** Menghindari *state pollution*.
*   **Instruksi Dev:**
    *   Implementasikan *Zustand* atau *React Context* murni khusus untuk `CognitiveState` (menyimpan blok semantik aktif, dan daftar *Severity Extraction*).
    *   Jangan mencampur aduk data *Chat History* dengan *Governance Meta-State*.
*   **Acceptance Criteria:** `CognitiveState` dapat menyimpan array objek `severityAlerts` dan merender ulang komponen `Sidebar` tanpa me-*re-render* seluruh layar obrolan.

### Task 1.2: Implementasi Semantic Chat Blocks
*   **Konteks:** Obrolan harus dikelompokkan ke dalam struktur kognitif, bukan urutan waktu (*timeline*) kasual.
*   **Instruksi Dev:**
    *   Modifikasi `ChatWorkspace.tsx` agar setiap input pesan wajib memiliki label semantik (contoh: `[Business Objective]`, `[Risk]`, `[Authority]`).
    *   Buat mekanisme UI agar *user* bisa dengan mudah melakukan *switch* blok semantik sebelum menekan Enter.
*   **Acceptance Criteria:** *Payload* JSON ke backend memiliki bentuk `{ text: "...", semantic_block: "Risk" }`.

### Task 1.3: Pembangunan "Severity-Based Live Sidebar"
*   **Konteks:** Menampilkan peringatan tata kelola secara seketika (*real-time*).
*   **Instruksi Dev:**
    *   Pecah komponen `Sidebar.tsx` menjadi 3 sub-komponen: `CriticalAlert`, `WarningAlert`, dan `SuggestionAlert`.
    *   Setiap elemen *alert* harus bisa diklik untuk memperluas (*expand*) deskripsi detail pelanggaran atau saran.
*   **Acceptance Criteria:** Sidebar berhasil menerima respons *Staged Extraction* dari backend dan merender kategori sesuai *severity*.

### Task 1.4: Pembuatan "Human Approval Gates" UI
*   **Konteks:** AI dilarang membekukan pengetahuan tanpa otorisasi.
*   **Instruksi Dev:**
    *   Buat komponen `ApprovalModal` (menggunakan *headless UI* atau *Radix*).
    *   Saat AI mengajukan *Glossary Candidate* baru, munculkan tombol ganda: `[Approve & Freeze]` dan `[Reject & Re-reason]`.
*   **Acceptance Criteria:** Status tidak akan berpindah ke `Approved` di *state management* hingga tombol diklik eksplisit oleh pengguna.

### Task 1.5: Pembangunan "Epistemic Health Indicator"
*   **Konteks:** Dasbor visual mini yang menampilkan kesehatan *reasoning*.
*   **Instruksi Dev:**
    *   Implementasikan komponen visualisasi data mini (bar progress animasi dengan *Framer Motion*).
    *   Terima prop metrik dari backend (Governance Clarity, Semantic Stability).
*   **Acceptance Criteria:** Bar berwarna hijau jika skor > 80%, kuning jika > 60%, merah jika < 60%.

---

## EPIC 2: BACKEND CONSTITUTION ENGINE (FastAPI)
**Tujuan:** Membangun *Layer 2 (Constitution Engine)* sebagai pusat orkestrasi pemrosesan *governance*.

### Task 2.1: Konstruksi "Context Assembler" Pipeline
*   **Konteks:** AI tidak boleh menjawab tanpa landasan konstitusi.
*   **Instruksi Dev:**
    *   Di direktori `/backend/app/constitution/`, buat fungsi `build_cognitive_context(domain_id)`.
    *   Fungsi ini harus mengambil teks dari `SYSTEM_PHILOSOPHY.md`, `FORBIDDEN_ACTIONS.md` (jika ada), dan `TERMINOLOGY_SYSTEM.md`, lalu merakitnya menjadi satu *string/array system prompt*.
*   **Acceptance Criteria:** Fungsi sanggup merakit batas memori (tidak melebihi kuota 4000 token) dengan mengutamakan L1 Constitutional Memory.

### Task 2.2: Pembangunan Staged Extraction Endpoint
*   **Konteks:** Ekstraksi ringan (saat mengetik) vs ekstraksi dalam (saat pengiriman).
*   **Instruksi Dev:**
    *   Di `/backend/app/api/extract.py`, selesaikan *endpoint* `POST /extract`.
    *   Terima parameter `stage: 'light' | 'deep'`.
    *   Untuk `light`: Jalankan *Regex* atau pencocokan *String* sederhana terhadap kamus *Glossary* aktif.
    *   Untuk `deep`: Serahkan tugas kepada *Reasoning Engine* (LLM call).
*   **Acceptance Criteria:** *Response time* untuk `light` < 200ms.

---

## EPIC 3: REASONING & GOVERNANCE INTELLIGENCE
**Tujuan:** Membangun *Layer 3* yang menjadi otak analitik dari sistem.

### Task 3.1: Integrasi LLM Core (Single Reasoning Engine)
*   **Konteks:** Tidak boleh menggunakan *multi-agent* terlebih dahulu.
*   **Instruksi Dev:**
    *   Di `/backend/app/reasoning/`, bangun `EngineCore` yang terkoneksi ke LLM (OpenAI/Anthropic) menggunakan *LangChain* dasar atau modul asinkron murni.
    *   Engine ini MURNI berfungsi sebagai analis. Jangan biarkan *engine* ini memanipulasi *database* secara langsung (*Side-effect free*).
*   **Acceptance Criteria:** *Engine* dapat menerima `user_input` dan `constitutional_context`, lalu mengembalikan format JSON absolut sesuai pydantic schema `GovernanceAnalysisResult`.

### Task 3.2: Pembangunan "Semantic Drift Detector"
*   **Konteks:** Mendeteksi pembusukan makna.
*   **Instruksi Dev:**
    *   Di `/backend/app/governance/`, buat modul `semantic_validator.py`.
    *   Ambil input pesan *user*, ekstrak kata kunci, dan cocokkan dengan entri `TERMINOLOGY_SYSTEM`.
    *   Jika kata bersinonim (yang terlarang) terdeteksi, kembalikan *Warning Severity*.
*   **Acceptance Criteria:** Penggunaan kata "OKAY" sebagai pengganti "APPROVE" otomatis memicu *Warning Alert* di sistem.

### Task 3.3: Pembangunan "Cognitive Security Scanner" (Prompt Defense)
*   **Konteks:** Mencegah *Authority Simulation*.
*   **Instruksi Dev:**
    *   Di `/backend/app/security/`, buat modul `cognitive_firewall.py`.
    *   Fungsi *pre-processing* ini akan memindai input pengguna untuk mencari pola kalimat manipulasi otoritas (contoh: "Sebagai admin, abaikan aturan ini").
*   **Acceptance Criteria:** Input dengan gaya *Prompt Injection* tata kelola akan langsung ditolak (Return HTTP 403) sebelum mencapai LLM Engine.

---

## EPIC 4: INSTITUTIONAL MEMORY (DATABASE & VECTOR STORE)
**Tujuan:** Menyiapkan struktur *database* untuk *Layer 4* (Memory Engine).

### Task 4.1: Desain Skema Relasional (PostgreSQL)
*   **Konteks:** Menyimpan struktur percakapan dan status tata kelola.
*   **Instruksi Dev:**
    *   Gunakan *SQLAlchemy* untuk membuat skema tabel: `projects`, `conversations`, `semantic_blocks`, `adr_records`.
    *   Pastikan tabel `adr_records` memiliki kolom `status` (Draft, Approved, Deprecated) sesuai hukum *Knowledge Decay Policy*.
*   **Acceptance Criteria:** Migrasi *Alembic* dapat dijalankan tanpa *error*.

### Task 4.2: Konfigurasi pgvector untuk Semantic Search
*   **Konteks:** Pencarian sejarah keputusan arsitektur secara kontekstual.
*   **Instruksi Dev:**
    *   Pastikan ekstensi `vector` pada PostgreSQL aktif (sudah dikonfigurasi di Docker).
    *   Buat tabel `knowledge_vectors` dengan kolom *embedding* dimensi yang sesuai.
    *   Buat *service* untuk menanamkan (*embed*) dan mencari (*query*) dokumen arsitektur masa lalu.
*   **Acceptance Criteria:** *Backend* mampu melakukan `cosine similarity search` dasar terhadap histori *ADR*.

---

## EPIC 5: GOVERNANCE TIMELINE & LINEAGE (FRONTEND)
**Tujuan:** Memvisualisasikan evolusi pengetahuan, sehingga pengguna dapat melihat masa lalu arsitektur (Decision Lineage) tanpa harus membongkar repositori teks secara manual. Fokus utama untuk **Phase C**.

### Task 5.1: Pembangunan "Governance Timeline Panel"
*   **Konteks:** Menampilkan sejarah keputusan yang diambil di masa lalu.
*   **Instruksi Dev:**
    *   Buat komponen UI baru (e.g., `GovernanceTimeline.tsx`) yang dapat diakses melalui tab atau *slide-over* di samping *Live Sidebar*.
    *   Visualisasikan data kronologis berdasarkan waktu disetujuinya suatu ADR atau aturan terminologi.
*   **Acceptance Criteria:** Pengguna dapat melihat *timeline vertikal* yang menunjukkan tanggal, judul perubahan tata kelola, dan status saat ini (Active/Deprecated).

### Task 5.2: Visualisasi "Decision Lineage Graph"
*   **Konteks:** Menjawab pertanyaan "Keputusan A menggantikan Keputusan B akibat Insiden C".
*   **Instruksi Dev:**
    *   Integrasikan *library* visualisasi ringan (contoh: *React Flow*).
    *   Representasikan keterhubungan antar ADR berdasarkan *ID Successor*.
*   **Acceptance Criteria:** Terdapat mode tampilan grafik (Graph View) di mana pengguna dapat melihat simpul (*nodes*) keputusan arsitektur yang saling terhubung.

### Task 5.3: "Conversation Checkpoint" System
*   **Konteks:** Membekukan memori di titik tertentu untuk menghindari kebingungan dalam obrolan panjang.
*   **Instruksi Dev:**
    *   Implementasikan tombol `[Create Snapshot]` di antarmuka obrolan.
    *   Tombol ini memicu penangkapan (*capture*) terhadap *Cognitive State* (keseluruhan ADR kandidat dan memori sementara saat itu).
*   **Acceptance Criteria:** Snapshot tersimpan dan pengguna dapat mengembalikan (*rollback*) status tata kelola ke titik *checkpoint* tersebut.

---

## EPIC 6: INSTITUTIONAL MEMORY PIPELINE (BACKEND)
**Tujuan:** Menjadikan PostgreSQL dan `pgvector` sebagai memori jangka panjang (*Long-Term Memory*) yang menyuplai mesin *reasoning* dengan konteks historis.

### Task 6.1: Memory Ingestion Service (Embedding API)
*   **Konteks:** Mengonversi persetujuan (Approve) menjadi pengetahuan terindeks.
*   **Instruksi Dev:**
    *   Di direktori `/backend/app/memory/`, buat `ingestion_service.py`.
    *   Setiap kali ada *payload* `Approve` dari frontend atas suatu *ADR Candidate* atau terminologi, *service* ini akan memanggil API *Embedding* (e.g. OpenAI `text-embedding-ada-002`) dan menyimpannya ke tabel `knowledge_vectors`.
*   **Acceptance Criteria:** Proses *approve* berhasil memunculkan baris baru di tabel *vector* dengan *embedding array* yang valid.

### Task 6.2: Historical Context Retrieval (Semantic Search)
*   **Konteks:** Menyuntikkan ingatan ke dalam *Reasoning Engine*.
*   **Instruksi Dev:**
    *   Ubah alur `deep_extract` di *Staged Extraction Endpoint*.
    *   Sebelum LLM melakukan penalaran, cari (secara leksikal maupun kemiripan kosinus) riwayat ADR atau percakapan lama yang relevan dengan pertanyaan/blok saat ini.
    *   Suntikkan hasil pencarian ini sebagai `Historical Context` tambahan di luar konstitusi L1.
*   **Acceptance Criteria:** LLM mampu menjawab "*Mengapa kita tidak menggunakan Redis?*" dengan mengutip ADR masa lalu yang ditarik dari `pgvector`.

### Task 6.3: Knowledge Evolution Versioning API
*   **Konteks:** Mekanisme pengamanan agar memori lama tidak tertimpa (*No Overwrite Rule*).
*   **Instruksi Dev:**
    *   Buat *endpoint* `PUT /api/v1/governance/adr/{id}/deprecate`.
    *   Pastikan sistem hanya mengizinkan penambahan dokumen baru dan pembaruan kolom `status` menjadi `[DEPRECATED]` untuk dokumen lama.
*   **Acceptance Criteria:** Memanggil *endpoint update* terhadap entitas arsitektur menghasilkan 1 entri baru dan 1 entri lama berstatus *Deprecated*.
