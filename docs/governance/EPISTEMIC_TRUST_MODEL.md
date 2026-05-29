# EPISTEMIC TRUST MODEL

**"The Epistemic Validation Engine"**

Dalam infrastruktur *cognitive governance*, kemampuan menjawab pertanyaan adalah komoditas murah. Tantangan sesungguhnya adalah memverifikasi **kredibilitas** dari sebuah penalaran (*reasoning*) dan memastikan asal-usul (*lineage*) dari klaim yang diajukan oleh AI maupun manusia.

Dokumen ini mengatur bagaimana sistem menentukan tingkat kepercayaan (*Trustworthiness*) pada suatu entitas pengetahuan.

---

## 1. TRUST SOURCE HIERARCHY (Hierarki Sumber Kepercayaan)

Sistem wajib merakit konteks dengan mengutamakan tingkat kepercayaan tertinggi. Jika terdapat benturan fakta, sumber dengan tingkat yang lebih tinggi membatalkan sumber di bawahnya.

1. **Human-Approved Constitutional Core** (Tertinggi) - *Contoh: System Philosophy, Security Models.*
2. **Human-Approved Architecture Records (ADR)** - *Dokumen resmi arsitektur yang sudah ditandatangani.*
3. **Machine-Readable Governance Rules** - *Aturan terstruktur yang berjalan di sistem validasi.*
4. **Human Consensus / Reviewed PRs** - *Persetujuan dari dua atau lebih manusia pada lingkup kerja aktif.*
5. **AI Suggestion / Inference** - *Hipotesis, dugaan, atau solusi rancangan AI yang belum diverifikasi.*
6. **Raw Conversation / User Intent** (Terendah) - *Keinginan sesaat pengguna di dalam ruang obrolan (chat).*

---

## 2. KNOWLEDGE CONFIDENCE LEVEL (Skala Probabilitas Pengetahuan)

AI diwajibkan untuk melampirkan label tingkat kepercayaan secara eksplisit saat memberikan saran arsitektur:

| Level | Kategori | Makna | Tindakan |
| :--- | :--- | :--- | :--- |
| **L4** | **Verified** | Bersumber dari *Approved Governance/ADR*. | Dapat dijadikan landasan absolut. |
| **L3** | **High Confidence** | Disintesis dari pola *Historical Pull Requests* yang sukses. | Dapat dieksekusi dengan *review* ringan. |
| **L2** | **Probable (Inference)** | Hasil murni penalaran (*reasoning*) AI berdasarkan konteks generik. | **Wajib** mencantumkan asumsi yang dipakai. |
| **L1** | **Unverified** | Ekstraksi mentah dari percakapan pengguna yang belum tervalidasi. | Harus dimurnikan via *Discovery Engine*. |
| **L0** | **Deprecated** | Berasal dari ADR kedaluwarsa atau aturan yang sudah digantikan. | **Harus diblokir** penggunaannya. |

---

## 3. TRUST DEGRADATION (Peluruhan Kepercayaan Kognitif)

Pengetahuan teknis memiliki *half-life* (waktu paruh). ADR yang valid dua tahun lalu mungkin mengandung bias arsitektural untuk konteks hari ini.

*   **Verifikasi Berkala:** Setiap *Knowledge Model* memiliki metadata usia.
*   **Degradasi Otomatis:** Sebuah konsep L4 (Verified) akan turun menjadi L3 (High Confidence) jika tidak ada *commit* atau validasi ulang terhadap modul tersebut dalam kurun waktu 12 bulan.
*   **AI Obligation:** AI harus secara reaktif mendeteksi degradasi ini dan memicu *Governance Intelligence* untuk menanyakan ulang relevansi aturan lama tersebut sebelum menggunakannya sebagai tameng penalaran.
