# AI CONTEXT SPECIFICATION

**"The Assembly of Epistemic Trust"**

Kecerdasan AI tidak ditentukan oleh jumlah parameter model LLM-nya, melainkan oleh kemurnian, keteraturan, dan hierarki konteks konstitusi yang diberikan kepadanya sebelum ia diizinkan bernalar.

Dokumen ini adalah spesifikasi wajib bagi *AI Context Engine* dalam menginjeksikan pengetahuan sebelum merespons perintah *user*.

---

## 1. CONTEXT PRIORITY ORDER (Hierarki Prioritas Konteks)

Ketika AI merakit penalaran (*Context Assembly*), aturan dengan prioritas lebih tinggi **secara absolut** menganulir aturan yang berada di prioritas lebih rendah jika terjadi konflik penalaran.

Hierarki Injeksi:
1. **System Philosophy & Ethics** (Apakah ini melanggar martabat kognitif?)
2. **Forbidden Actions** (Apakah ini di dalam daftar harga mati AI/System/Human?)
3. **Security Standards & Authority Boundaries** (Siapa yang berhak melakukan ini?)
4. **Active Architecture Decision Records (ADR)** (Konstitusi arsitektur makro)
5. **Business Rules & Workflows** (Proses bisnis)
6. **Terminology System (Glossary)** (Definisi dan semantik kata)
7. **User Intent / Raw Prompt** (Keinginan sesaat manusia)

*Perhatian: Keinginan manusia (User Intent) adalah prioritas TERENDAH di mata AI jika bertentangan dengan System Philosophy (Prioritas 1).*

---

## 2. CONTEXT SCOPE RULE (Aturan Batasan Radius Konteks)

AI dilarang keras menerima injeksi seluruh isi repositori sekaligus. *Context overload* adalah ibu kandung dari halusinasi arsitektur.

1. **Scoped Constitutional Context:** AI hanya diinjeksikan konteks yang relevan dengan *Domain Impact Analysis* saat ini.
2. Jika *user* membahas tentang modul Pembayaran, *Context Engine* tidak boleh menginjeksikan ADR tentang arsitektur Caching Media kecuali terdapat keterhubungan (*Knowledge Linkage*) secara eksplisit.
3. AI **wajib menolak (Refuse)** menjawab jika ia merasa radius konteks yang diberikan tidak cukup baginya untuk menyimpulkan sebuah keputusan arsitektural yang aman.

---

## 3. CONTEXT FRESHNESS & EXPIRATION (Kedaluwarsa Konteks)

Pengetahuan tidak hidup abadi. Konteks yang basi (*obsolete*) lebih berbahaya daripada AI yang tidak tahu apa-apa.

*   **Verifikasi Usia Konteks:** Setiap dokumen memiliki *Context Timestamp*. AI akan memberikan skor *Unverified/Deprecated* pada *Business Rules* atau ADR yang sudah terlalu lama tidak diaudit (misal: > 1 tahun).
*   **Context Obsolescence Alert:** AI akan memperingatkan manusia: *"ADR-004 digunakan sebagai fondasi penalaran saya, namun dokumen ini terakhir diverifikasi pada tahun 2021. Apakah Anda ingin melanjutkan dengan tingkat probabilitas risiko semantik ini?"*

---

## 4. CONTEXTUAL CONFLICT RESOLUTION (Resolusi Konflik Perakitan)

Jika pada saat *Context Assembly*, AI mendeteksi adanya kontradiksi antara hierarki yang setara (misal: dua ADR yang tampaknya saling bertabrakan untuk domain irisan):

1. **AI dilarang melakukan *silent synthesis* (meringkas kompromi sendiri).**
2. AI harus menunda eksekusi dan memicu *Epistemic Escalation* kepada Arsitek Manusia.
3. AI harus menyajikan *Conflict Matrix*, menunjukkan benturan semantik yang terdeteksi, dan meminta putusan manusia sebelum melangkah maju ke tahap ekstraksi terstruktur.
