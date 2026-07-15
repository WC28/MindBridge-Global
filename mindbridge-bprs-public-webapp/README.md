# MindBridge BPRS Access

Separate public-facing BPRS presentation app for:

- patient
- family
- caregiver
- staff

This project is intentionally separate from the existing staff workflow so it can be demonstrated as a simple front door for:

- hospital walk-ins
- home check-ins
- caregiver-assisted assessment
- QR access during presentations

## What it does

- guided 18-item BPRS-aligned check-in
- role and setting selection
- live total score calculation
- severity interpretation:
  - `18-30` minimal to mild symptoms
  - `31-40` mild to moderate clinical significance
  - `41-60` moderate to severe psychopathology
  - `>60` very severe psychiatric symptom burden
- urgency banner:
  - `Stable`
  - `Watch`
  - `Urgent`
  - `Critical`
- shareable summary
- Google Sheets save when deployed as Apps Script
- static/offline presentation mode when opened from built HTML

## Important clinical note

The official BPRS is clinician-rated. This public-facing prototype uses the same 18 symptom domains as a guided pre-assessment that supports conversation and triage discussion. It does not replace clinical judgment or emergency assessment.

## Files

- [Code.gs](/Users/witthirasag./Documents/IMHWF2026/mindbridge-bprs-public-webapp/Code.gs)
- [Index.html](/Users/witthirasag./Documents/IMHWF2026/mindbridge-bprs-public-webapp/Index.html)
- [Stylesheet.html](/Users/witthirasag./Documents/IMHWF2026/mindbridge-bprs-public-webapp/Stylesheet.html)
- [JavaScript.html](/Users/witthirasag./Documents/IMHWF2026/mindbridge-bprs-public-webapp/JavaScript.html)
- [appsscript.json](/Users/witthirasag./Documents/IMHWF2026/mindbridge-bprs-public-webapp/appsscript.json)

## Apps Script setup

1. Create a new standalone Google Apps Script project.
2. Copy these files into that project.
3. Save the project.
4. Run `authorizeAndSetup` once.
5. Deploy as a web app.

The project will automatically create a spreadsheet named `MindBridge BPRS Public Database` and save the ID in script properties.

## Static presentation build

Run:

```bash
node mindbridge-bprs-public-webapp/scripts/build-static.mjs
```

Outputs:

- [docs/bprs/index.html](/Users/witthirasag./Documents/IMHWF2026/docs/bprs/index.html)
- [offline/mindbridge-bprs-public-offline.html](/Users/witthirasag./Documents/IMHWF2026/offline/mindbridge-bprs-public-offline.html)
