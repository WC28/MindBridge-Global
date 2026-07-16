# MindBridge Global
#IMHWF 2026 GROUP MEMBERS
Ms. Sadia Hashmi | Pakistan |
Miss Witthirasa Chaemphichanyotin  | Thailand |
Dr. Madhu Vamsi Ganduri | India |
Dr. Yuchen Li | China |



Phase 1 prototype for a multidisciplinary mental health coordination workflow using Google Apps Script, Google Sheets, and a lightweight web dashboard.

## Framing

This is not scoped as a single-discipline social work tool. The prototype is framed as:

`MindBridge Global`

It is designed to support structured workflow across:

- doctor
- nurse
- psychologist
- social worker
- occupational therapist
- community team
- patient/family

The Phase 1 prototype demonstrates:

- pre-session check-in
- rule-based risk screening
- shared multidisciplinary review
- optional BPRS 18-item total score interpretation for clinical severity tracking
- MDT care planning
- minimum necessary handoff summary for safe external coordination
- discharge and community follow-up
- privacy-aware structured data collection using patient codes rather than full identifiers

## Included workflow pages

1. Home Dashboard
2. Front Door Registration
3. Patient Check-in
4. Same-Day Service
5. Community Entry
6. Shared Case Workspace
7. Clinical Review
8. Psychological Review
9. Psychosocial Review
10. MDT Care Plan
11. Safe Handoff Summary
12. Follow-up Tracker

## Google Sheet tabs

The script creates these tabs automatically:

1. `Patient_Registration`
2. `Patient_Checkin`
3. `Service_Followup`
4. `Community_Referral`
5. `Clinical_Review`
6. `Psychological_Review`
7. `Psychosocial_Review`
8. `MDT_Care_Plan`
9. `Minimum_Necessary_Handoff`
10. `Public_Coordination`
11. `Private_Coordination`
12. `Follow_Up`
13. `Users`
14. `Portal_Access`
15. `Alert_Queue`
16. `AI_Screening_Log`
17. `Cases_Master`
18. `Case_Timeline`
19. `Dashboard`

## Phase 1 portal login

This prototype now supports separate sign-in flows for:

- public screening
- patient
- family/caregiver
- staff

Role access in Phase 1:

- public screening: `Patient_Checkin`
- patient: `Patient_Checkin`, `Service_Followup`
- family/caregiver: `Patient_Checkin`, `Service_Followup`
- staff: dashboard plus all multidisciplinary workflow pages

Patient/family/staff check-in now includes:

- purpose of visit
- `Scheduled appointment (มาตามนัด)`
- `Walk-in`
- `ER urgent (ER ด่วน)`

After check-in submission:

- the record enters `Alert_Queue`
- queue priority is derived from visit purpose and risk flag
- BPRS score and AI triage recommendation are included in the queue and Telegram alert summary
- Telegram notification can be turned on later for staff alerting

Conference QR screening flow:

- deploy the web app and turn the public conference link into `YOUR_WEB_APP_URL?portal=screening`
- scanning that QR code opens the public screening path for home, caregiver, or event use
- the portal can collect BPRS score, free-text chatbot story, and AI-supported triage in one step
- if the user has no patient code yet, the system generates a new patient code plus patient/family follow-up access codes automatically

Seeded demo credentials:

- staff username: `doctor` password: `demo123`
- staff username: `nurse` password: `demo123`
- patient code: `MH-001` access code: `PT001`
- family code: `MH-001` access code: `FAM001`

Telegram alert configuration in [Code.gs](/Users/witthirasag./Documents/IMHWF2026/Code.gs:5):

- `TELEGRAM_NOTIFICATIONS_ENABLED`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

AI screening configuration:

- `AI_ASSIST_ENABLED` in [Code.gs](/Users/witthirasag./Documents/IMHWF2026/Code.gs:8)
- script property `OPENAI_API_KEY`

Default behavior keeps Telegram turned off and still logs every intake alert into `Alert_Queue`.

## Phase 1 risk-flag note

Use this wording in the proposal:

The Phase 1 prototype uses rule-based risk flags for professional review. It does not make automatic clinical decisions. AI-assisted screening can be developed in later phases after ethical review and validation.

## Safe handoff note

Use this wording in the proposal:

The prototype does not replace the hospital record. It adds a `minimum necessary` handoff summary so external coordination can happen safely without exposing the full chart.

## Deploy in Google Apps Script

1. Open Google Apps Script and create a project, or open `Extensions -> Apps Script` from a Google Sheet.
2. Replace the generated files with:
   - [appsscript.json](/Users/witthirasag./Documents/IMHWF2026/appsscript.json)
   - [Code.gs](/Users/witthirasag./Documents/IMHWF2026/Code.gs)
   - [Index.html](/Users/witthirasag./Documents/IMHWF2026/Index.html)
   - [Styles.html](/Users/witthirasag./Documents/IMHWF2026/Styles.html)
   - [JavaScript.html](/Users/witthirasag./Documents/IMHWF2026/JavaScript.html)
3. Save the project.
4. Run `getAppBootstrap` once to authorize spreadsheet access.
5. If the project is standalone, the script will automatically create a spreadsheet named `MindBridge Global Database` and store its ID in script properties.
6. Deploy as `Web app`.
7. Set access according to your demo needs.

If you want to use an existing spreadsheet instead, set a script property named `SPREADSHEET_ID` to that Google Sheet ID.

## Demo tips

- Use `Seed demo data` from the sidebar to populate example cases.
- For conference or home screening, open the deployed URL with `?portal=screening`.
- Start with `Patient Check-in`, then continue into `Clinical Review`.
- In `Clinical Review`, you can enter an optional BPRS 18-item total score from `18` to `126` and the app will interpret the severity band automatically.
- In the public screening portal, a BPRS total score from `18` to `126` can be entered directly alongside the AI screening narrative so the system can route by severity and urgency.
- The dashboard will summarize total cases, high-risk cases, pending follow-up, referral status, cases by profession, and common risk factors.

## Suggested Phase 2+

- role-based access control
- audit trail and consent handling
- AI-assisted triage after ethics review
- privacy-preserving analytics
- research-ready export structure
