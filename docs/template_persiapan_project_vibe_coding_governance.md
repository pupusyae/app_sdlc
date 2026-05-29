# TEMPLATE FINAL
# PERSIAPAN MEMULAI PROJECT APLIKASI DENGAN TEKNIK VIBE CODING

---

# 1. TUJUAN DOKUMEN

Dokumen ini digunakan sebagai standar dan panduan resmi untuk memulai, mengelola, dan menjaga stabilitas project aplikasi berbasis AI Assisted Development / Vibe Coding.

Tujuan utama:

- Menjaga konsistensi pengembangan.
- Mencegah AI melakukan improvisasi berlebihan.
- Menjaga architecture tetap stabil.
- Memastikan seluruh perubahan dapat diaudit.
- Mengurangi technical debt.
- Menjaga kualitas source code.
- Menjaga repository tetap aman dan terstruktur.
- Menstandarkan workflow multi-model AI.
- Menjaga kontrol project tetap berada pada manusia.

---

# 2. DEFINISI VIBE CODING

Vibe Coding adalah metode pengembangan aplikasi menggunakan bantuan AI secara intensif untuk:

- analisa,
- desain sistem,
- implementasi,
- debugging,
- dokumentasi,
- review,
- dan automation.

Namun seluruh:

- keputusan architecture,
- governance,
- standard,
- scope,
- dan validasi final

harus tetap dikendalikan manusia.

---

# 3. PRINSIP DASAR VIBE CODING

## 3.1 Human Controlled Development

AI hanya berperan sebagai:

- executor,
- assistant,
- reviewer,
- advisor.

AI bukan pengambil keputusan utama.

---

## 3.2 Blueprint Driven Development

AI tidak boleh bekerja dari prompt umum.

Seluruh implementasi harus berdasarkan:

- blueprint,
- architecture,
- workflow,
- rules,
- acceptance criteria,
- implementation plan.

---

## 3.3 Frozen Architecture

Architecture utama tidak boleh diubah tanpa persetujuan.

Meliputi:

- struktur folder,
- API contract,
- database schema,
- naming convention,
- service pattern,
- authentication flow,
- deployment flow.

---

## 3.4 Scope Isolation

Satu task hanya mengerjakan satu scope.

Dilarang:

- menambahkan fitur lain,
- refactor global,
- mengubah system lain,
- menambahkan dependency tanpa persetujuan.

---

## 3.5 Review Mandatory

Seluruh hasil AI wajib:

- direview,
- diuji,
- diverifikasi,
- diaudit.

Sebelum merge ke branch utama.

---

# 4. STRUKTUR TIM AI DEVELOPMENT

## 4.1 Human Lead

Tanggung jawab:

- menentukan arah project,
- menentukan architecture,
- menentukan standard,
- validasi final,
- approval merge.

---

## 4.2 Architect AI

Tugas:

- membuat blueprint,
- membuat architecture,
- membuat design pattern,
- membuat schema,
- membuat governance.

Model yang direkomendasikan:

- DeepSeek V4 Pro

---

## 4.3 Planner AI

Tugas:

- memecah task,
- membuat implementation plan,
- membuat acceptance criteria,
- membuat checklist.

Model yang direkomendasikan:

- Gemini Flash
- DeepSeek V4 Pro

---

## 4.4 Executor AI

Tugas:

- implementasi coding,
- CRUD,
- UI,
- API,
- bug fixing kecil.

Model yang direkomendasikan:

- DeepSeek V4 Flash

---

## 4.5 Reviewer AI

Tugas:

- audit hasil coding,
- cek consistency,
- cek security,
- cek performance,
- cek architecture compliance.

Model yang direkomendasikan:

- DeepSeek V4 Pro

---

## 4.6 UI/UX AI

Tugas:

- ide visual,
- UX improvement,
- responsive improvement.

Model yang direkomendasikan:

- Minimax 2.5

---

# 5. STRUKTUR FOLDER GOVERNANCE

Struktur minimal yang direkomendasikan:

```txt
/docs
    /architecture
    /workflow
    /standards
    /features

PROJECT_RULES.md
ARCHITECTURE.md
IMPLEMENTATION_PLAN.md
AI_GOVERNANCE.md
REPOSITORY_RULES.md
REVIEW_CHECKLIST.md
UI_GUIDELINE.md
SECURITY_STANDARD.md
CONTRIBUTING.md
CHANGELOG.md
README.md
```

---

# 6. DOKUMEN WAJIB PROJECT

# 6.1 PROJECT_RULES.md

Berisi:

- aturan coding,
- aturan dependency,
- aturan refactor,
- aturan architecture,
- aturan UI,
- batasan AI.

Contoh:

```md
- No direct commit to main
- No architecture modification
- No dependency addition without approval
- No global refactor
- Follow existing naming convention
- Follow existing folder structure
```

---

# 6.2 ARCHITECTURE.md

Berisi:

- system overview,
- flow diagram,
- API architecture,
- database architecture,
- authentication flow,
- service structure,
- queue flow,
- deployment architecture.

---

# 6.3 IMPLEMENTATION_PLAN.md

Berisi:

- roadmap,
- phase development,
- task breakdown,
- target milestone,
- dependency antar task.

Contoh:

```md
Phase 1
- Login API
- JWT Authentication
- Session Management

Phase 2
- Dashboard
- Role Permission
- Reporting
```

---

# 6.4 AI_GOVERNANCE.md

Berisi:

- batasan AI,
- workflow AI,
- approval flow,
- review flow,
- task handling.

Contoh:

```md
AI cannot:
- modify unrelated files
- add dependency without approval
- change architecture
- delete files without confirmation
- refactor outside task scope
```

---

# 6.5 REPOSITORY_RULES.md

Berisi:

- branching strategy,
- commit standard,
- merge policy,
- pull request policy,
- review requirement.

---

# 6.6 REVIEW_CHECKLIST.md

Berisi checklist review:

- security,
- consistency,
- performance,
- maintainability,
- testing,
- responsive,
- dependency.

---

# 6.7 UI_GUIDELINE.md

Berisi:

- typography,
- spacing,
- color system,
- responsive rules,
- component pattern,
- dark mode rules,
- animation rules.

---

# 7. REPOSITORY GOVERNANCE

# 7.1 Branch Structure

Rekomendasi:

```txt
main
develop
feature/*
hotfix/*
refactor/*
```

---

# 7.2 Main Branch Protection

Aturan:

- tidak boleh direct push,
- tidak boleh force push,
- wajib review sebelum merge,
- wajib testing sebelum merge,
- wajib approval sebelum merge.

---

# 7.3 Workflow Branch

## Membuat branch baru

```bash
git checkout main
git pull origin main
git checkout -b feature/login-system
```

---

## Setelah task selesai

```bash
git add .
git commit -m "feat: add login system"
git push origin feature/login-system
```

---

## Setelah review dan testing

Merge:

```txt
feature/* -> develop -> main
```

---

# 7.4 Commit Standard

Gunakan semantic commit:

```txt
feat:
fix:
refactor:
docs:
style:
chore:
test:
```

Contoh:

```txt
feat: add customer dashboard API
fix: repair token validation
refactor: simplify queue service
```

---

# 8. STANDAR WORKFLOW VIBE CODING

# 8.1 Tahap 1 — Analisa

Kegiatan:

- business analysis,
- requirement analysis,
- workflow analysis,
- system impact analysis.

Output:

- BRD,
- workflow,
- requirement list.

---

# 8.2 Tahap 2 — Architecture Design

Kegiatan:

- menentukan stack,
- menentukan structure,
- menentukan API,
- menentukan schema,
- menentukan security.

Output:

- architecture document,
- schema,
- API contract.

---

# 8.3 Tahap 3 — Task Breakdown

Kegiatan:

- memecah task kecil,
- menentukan acceptance criteria,
- menentukan dependency task.

Output:

- implementation plan,
- checklist.

---

# 8.4 Tahap 4 — Coding

Aturan:

- 1 branch = 1 task,
- tidak boleh keluar scope,
- tidak boleh improvisasi,
- tidak boleh ubah architecture.

---

# 8.5 Tahap 5 — Review

Review meliputi:

- security,
- consistency,
- architecture compliance,
- maintainability,
- unnecessary dependency,
- responsive,
- error handling.

---

# 8.6 Tahap 6 — Testing

Minimal:

- functional testing,
- responsive testing,
- API testing,
- regression testing,
- integration testing.

---

# 8.7 Tahap 7 — Merge

Hanya dilakukan jika:

- testing passed,
- review passed,
- acceptance criteria fulfilled,
- approval granted.

---

# 9. RULES KHUSUS UNTUK AI CODER

# 9.1 Dilarang Melakukan

```txt
- Global refactor
- Silent modification
- Dependency addition without approval
- Architecture changes
- File deletion without confirmation
- Feature expansion outside task
- Modifying unrelated files
```

---

# 9.2 Wajib Dilakukan

```txt
- Follow existing pattern
- Follow repository rules
- Follow architecture rules
- Keep implementation minimal
- Explain changes clearly
- Create TODO if unclear
```

---

# 9.3 No Assumption Rule

Jika informasi tidak jelas:

AI wajib:

- bertanya,
- membuat TODO,
- atau meminta klarifikasi.

AI dilarang membuat asumsi sendiri.

---

# 10. STANDAR PROMPT VIBE CODING

# 10.1 Prompt Architect

```txt
You are software architect.

Focus:
- scalable architecture
- maintainability
- security
- simplicity

Restrictions:
- avoid overengineering
- keep architecture practical
```

---

# 10.2 Prompt Executor

```txt
You are implementation executor only.

Rules:
- no architecture changes
- no global refactor
- no dependency addition
- implement only requested task
- follow existing pattern
- create TODO if unclear
```

---

# 10.3 Prompt Reviewer

```txt
Review only changed files.

Focus:
- security
- architecture compliance
- consistency
- maintainability
- unnecessary abstraction
- breaking changes
```

---

# 11. ACCEPTANCE CRITERIA STANDARD

Contoh:

```md
Acceptance Criteria:

- Login successful
- JWT stored securely
- Responsive mobile layout
- Error handling implemented
- No hardcoded URL
- No console error
- No breaking existing feature
```

---

# 12. TESTING STANDARD

Minimal testing:

| Jenis Testing | Wajib |
|---|---|
| Functional Testing | Ya |
| Responsive Testing | Ya |
| API Testing | Ya |
| Regression Testing | Ya |
| Security Validation | Ya |
| Load Testing | Jika diperlukan |
| UAT | Ya |

---

# 13. SECURITY STANDARD

Minimal:

```txt
- Input validation
- Authentication validation
- Authorization validation
- Rate limiting
- Secure environment variable
- No hardcoded secret
- Secure API handling
- Logging validation
```

---

# 14. DOCUMENTATION STANDARD

Seluruh fitur wajib memiliki:

- feature documentation,
- API documentation,
- workflow documentation,
- testing documentation,
- change log.

---

# 15. CHANGE MANAGEMENT

Setiap perubahan wajib memiliki:

- reason,
- impact,
- rollback plan,
- testing result.

---

# 16. REVIEW CHECKLIST TEMPLATE

```md
# Review Checklist

## Architecture
- [ ] Follow architecture
- [ ] No unnecessary abstraction
- [ ] No architecture violation

## Security
- [ ] Input validated
- [ ] Auth validated
- [ ] No hardcoded secret

## Code Quality
- [ ] Naming consistent
- [ ] No duplicated logic
- [ ] Error handling exists

## Repository
- [ ] Correct branch
- [ ] Semantic commit
- [ ] No unrelated file changes

## Testing
- [ ] Functional test passed
- [ ] Responsive passed
- [ ] API passed
```

---

# 17. AI SESSION START CHECKLIST

Sebelum coding:

```md
- Pull latest branch
- Read PROJECT_RULES.md
- Read ARCHITECTURE.md
- Read IMPLEMENTATION_PLAN.md
- Confirm task scope
- Create new branch
- Define acceptance criteria
```

---

# 18. AI SESSION END CHECKLIST

Sebelum merge:

```md
- Review completed
- Testing completed
- No console error
- No unrelated changes
- Commit standardized
- Documentation updated
- Changelog updated
```

---

# 19. BEST PRACTICE UTAMA

---

# 19.1 Keep Task Small

Task kecil jauh lebih efektif dibanding task besar.

Keuntungan:

- lebih mudah dikontrol,
- lebih mudah direview,
- lebih mudah diuji,
- lebih mudah dirollback,
- lebih mudah dipahami AI,
- mengurangi hallucination,
- mengurangi improvisasi AI.

Rekomendasi:

```txt
1 Task = 1 Scope
1 Branch = 1 Task
1 Prompt = 1 Objective
```

Contoh yang baik:

```txt
- membuat login API
- membuat middleware auth
- membuat dashboard statistik
- membuat export excel
```

Contoh yang buruk:

```txt
- membuat seluruh ERP
- membuat seluruh backend
- membuat seluruh dashboard management
```

---

# 19.2 Avoid Overengineering

AI sangat cenderung melakukan:

- abstraction berlebihan,
- membuat pattern terlalu kompleks,
- membuat service tidak perlu,
- membuat generic system berlebihan,
- membuat reusable component terlalu dini.

Prinsip utama:

```txt
Simple > Clever
Stable > Complex
Maintainable > Fancy
```

Prioritaskan:

- keterbacaan,
- maintainability,
- konsistensi,
- stabilitas.

Hindari:

- premature optimization,
- excessive abstraction,
- unnecessary microservice,
- dynamic configuration berlebihan.

---

# 19.3 Existing Pattern First

AI wajib mengikuti pattern yang sudah ada.

Dilarang:

- membuat style baru,
- membuat naming baru,
- membuat architecture baru,
- membuat folder baru tanpa alasan jelas.

Aturan:

```txt
If existing pattern works:
Do not create new pattern.
```

Manfaat:

- consistency,
- easier maintenance,
- easier onboarding,
- easier debugging.

---

# 19.4 Main Branch Always Stable

Branch main harus selalu:

- deployable,
- stable,
- tested,
- production ready.

Dilarang:

- merge experimental feature,
- merge untested feature,
- merge incomplete feature.

Workflow ideal:

```txt
feature/* -> develop -> main
```

---

# 19.5 Human Final Approval

AI tidak boleh memiliki otoritas final.

Seluruh:

- merge,
- deployment,
- architecture change,
- dependency addition,
- schema change

harus melalui approval manusia.

---

# 19.6 Incremental Development

Pengembangan dilakukan bertahap.

Hindari:

- massive rewrite,
- massive refactor,
- big bang deployment.

Gunakan:

```txt
Small changes
Small releases
Small validations
```

---

# 19.7 Documentation First

Sebelum coding:

minimal harus tersedia:

- architecture,
- workflow,
- implementation plan,
- repository rules,
- acceptance criteria.

AI yang bekerja tanpa dokumentasi akan:

- lebih improvisatif,
- lebih inkonsisten,
- lebih sering salah asumsi.

---

# 19.8 Acceptance Criteria Mandatory

Setiap task wajib memiliki acceptance criteria.

Tanpa acceptance criteria:

- AI akan memperluas scope,
- review menjadi subjektif,
- validasi menjadi sulit.

Contoh:

```md
Acceptance Criteria:

- Login berhasil
- JWT tersimpan
- Responsive mobile
- Error handling tersedia
- Tidak ada console error
```

---

# 19.9 Diff-Based Review

Review hanya file yang berubah.

Jangan review seluruh project.

Fokus review:

- security,
- architecture compliance,
- consistency,
- dependency,
- breaking changes.

Manfaat:

- review lebih cepat,
- lebih fokus,
- lebih akurat.

---

# 19.10 AI Session Isolation

Pisahkan session AI berdasarkan:

- architecture,
- implementation,
- review,
- documentation.

Jangan campur semua dalam satu session.

Karena:

- context menjadi terlalu besar,
- AI mulai kehilangan fokus,
- AI mulai improvisasi.

---

# 19.11 Repository Cleanliness

Repository harus tetap bersih.

Dilarang:

- dead code,
- duplicate code,
- unused dependency,
- random temporary file,
- inconsistent naming.

Gunakan:

```txt
clean architecture
clean commit
clean branch
clean structure
```

---

# 19.12 Controlled Dependency

AI sangat suka menambahkan package.

Aturan:

```txt
No dependency addition without approval.
```

Karena dependency berarti:

- security risk,
- maintenance burden,
- update burden,
- compatibility risk.

---

# 19.13 Security By Default

AI sering fokus functionality dan melupakan security.

Minimal wajib:

```txt
- input validation
- auth validation
- authorization validation
- rate limiting
- secure environment variable
- no hardcoded secret
- audit logging
```

---

# 19.14 Minimal Scope Refactor

Jika task adalah:

```txt
fix login
```

maka AI tidak boleh:

- refactor dashboard,
- mengganti architecture,
- mengubah database,
- mengganti state management.

Prinsip:

```txt
Fix only related scope.
```

---

# 19.15 Prompt Consistency

Gunakan template prompt tetap.

Tujuan:

- menjaga konsistensi output,
- menjaga perilaku AI,
- mengurangi improvisasi.

Minimal prompt executor:

```txt
- no architecture changes
- no dependency addition
- no global refactor
- implement only requested scope
- follow existing pattern
```

---

# 19.16 AI as Junior Developer

Mindset paling aman:

Perlakukan AI sebagai:

```txt
very fast junior developer
```

Bukan:

```txt
fully autonomous senior architect
```

Artinya:

AI tetap perlu:

- SOP,
- review,
- governance,
- approval,
- validation.

---

# 19.17 Freeze Architecture During Sprint

Selama sprint berjalan:

architecture tidak boleh berubah.

Perubahan architecture hanya boleh:

- setelah evaluasi,
- setelah review,
- setelah approval.

Karena perubahan architecture saat implementasi menyebabkan:

- instability,
- rewrite,
- chaos dependency,
- broken integration.

---

# 19.18 Feature Flag Recommended

Untuk fitur besar:

Gunakan feature flag.

Manfaat:

- testing lebih aman,
- rollback lebih mudah,
- deployment lebih fleksibel.

---

# 19.19 Rollback Plan Mandatory

Setiap perubahan penting wajib memiliki:

```txt
rollback plan
```

Minimal:

- cara rollback,
- impact rollback,
- data affected,
- recovery step.

---

# 19.20 Logging & Monitoring Mandatory

AI sering lupa observability.

Minimal:

```txt
- error logging
- API logging
- authentication logging
- audit trail
- monitoring
```

---

# 19.21 Change Summary Required

Setiap task wajib memiliki:

```md
FILES CHANGED
REASON
RISK
DEPENDENCY ADDED
BREAKING CHANGE
TEST RESULT
```

Tujuan:

- memudahkan review,
- memudahkan audit,
- memudahkan rollback.

---

# 19.22 No Silent Changes

AI tidak boleh mengubah:

- configuration,
- dependency,
- environment,
- routing,
- auth,
- schema

secara diam-diam.

Seluruh perubahan harus dijelaskan.

---

# 19.23 Production Safety First

Prioritas utama:

```txt
production stability
```

Bukan:

```txt
feature quantity
```

Karena:

system enterprise lebih membutuhkan:

- reliability,
- predictability,
- maintainability.

---

# 19.24 Separate Experimental Environment

Fitur eksperimental wajib:

- menggunakan branch khusus,
- menggunakan environment khusus,
- tidak langsung masuk production.

---

# 19.25 CI/CD Validation Recommended

Minimal automation:

```txt
- lint check
- build check
- test check
- security scan
```

Sebelum merge.

---

# 19.26 Knowledge Centralization

Seluruh knowledge project harus tersimpan di repository.

Meliputi:

- architecture,
- workflow,
- API,
- troubleshooting,
- deployment,
- SOP.

Hindari knowledge hanya tersimpan di chat AI.

---

# 19.27 Human Readability First

Code harus:

- mudah dibaca,
- mudah dipahami,
- mudah dipelihara.

Bukan sekadar:

- pintar,
- singkat,
- kompleks.

---

# 19.28 Consistency Over Innovation

Dalam enterprise:

consistency lebih penting dibanding kreativitas.

Karena consistency menghasilkan:

- maintenance lebih mudah,
- debugging lebih mudah,
- onboarding lebih mudah.

---

# 19.29 Technical Debt Monitoring

Pantau:

- duplicate logic,
- dead code,
- inconsistent structure,
- outdated dependency,
- temporary workaround.

Lakukan cleanup berkala.

---

# 19.30 Governance is More Important Than AI Model

Keberhasilan vibe coding lebih dipengaruhi oleh:

- governance,
- workflow,
- review,
- architecture,
- repository discipline.

Bukan sekadar:

- model AI paling mahal,
- model AI paling pintar.

---

# 20. CONTOH STRUKTUR PROJECT IDEAL

```txt
project-root/
│
├── docs/
│   ├── architecture/
│   ├── standards/
│   ├── workflow/
│   ├── features/
│   └── security/
│
├── src/
├── tests/
├── scripts/
├── infrastructure/
│
├── PROJECT_RULES.md
├── ARCHITECTURE.md
├── IMPLEMENTATION_PLAN.md
├── AI_GOVERNANCE.md
├── REPOSITORY_RULES.md
├── REVIEW_CHECKLIST.md
├── UI_GUIDELINE.md
├── SECURITY_STANDARD.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── README.md
```

---

# 21. CONTOH WORKFLOW HARIAN VIBE CODING

# Tahap 1 — Persiapan

```bash
git checkout main
git pull origin main
```

---

# Tahap 2 — Buat Branch

```bash
git checkout -b feature/customer-dashboard
```

---

# Tahap 3 — Review Governance

Baca:

- PROJECT_RULES.md
- ARCHITECTURE.md
- IMPLEMENTATION_PLAN.md

---

# Tahap 4 — Implementasi

AI mengerjakan:

- hanya scope task,
- tanpa refactor global,
- tanpa dependency tambahan.

---

# Tahap 5 — Self Review

Review:

- logic,
- security,
- consistency,
- responsive,
- error handling.

---

# Tahap 6 — Commit

```bash
git add .
git commit -m "feat: add customer dashboard"
```

---

# Tahap 7 — Push

```bash
git push origin feature/customer-dashboard
```

---

# Tahap 8 — Review & Testing

- review code,
- testing,
- UAT,
- approval.

---

# Tahap 9 — Merge

```txt
feature -> develop -> main
```

---

# 22. KESIMPULAN FINAL

Vibe Coding bukan berarti:

- membiarkan AI bekerja bebas,
- membuat aplikasi tanpa governance,
- mengandalkan improvisasi AI.

Vibe Coding yang profesional adalah:

```txt
AI Accelerated Development
with Strong Governance
```

Kunci keberhasilan:

- architecture jelas,
- repository disiplin,
- task kecil,
- workflow stabil,
- review ketat,
- dan kontrol manusia yang konsisten.

AI harus diposisikan sebagai:

- accelerator,
- assistant,
- executor.

Sedangkan manusia tetap menjadi:

- architect,
- controller,
- reviewer,
- dan final decision maker.


