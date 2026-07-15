const BPRS_PORTAL_APP_TITLE = 'MindBridge BPRS Access';
const BPRS_PORTAL_SUBTITLE = 'A separate public-facing BPRS 18-item check-in for patients, families, caregivers, and staff';
const BPRS_PORTAL_DASHBOARD_TITLE = 'MindBridge Case Dashboard';
const BPRS_PORTAL_SPREADSHEET_NAME = 'MindBridge BPRS Public Database';
const BPRS_PORTAL_SPREADSHEET_ID_PROPERTY = 'BPRS_SPREADSHEET_ID';
const BPRS_PORTAL_SUBMISSIONS_SHEET = 'BPRS_Submissions';
const BPRS_PORTAL_CASE_STATUS_SHEET = 'Case_Status';
const BPRS_PORTAL_UNIFIED_INTAKE_URL = '';
// Alerts fire for new submissions with scores above 40 or immediate safety concerns.
const BPRS_PORTAL_NOTIFY_ENABLED = false;
const BPRS_PORTAL_NOTIFY_THRESHOLD = 40;
const BPRS_PORTAL_TELEGRAM_BOT_TOKEN = '';
const BPRS_PORTAL_TELEGRAM_CHAT_ID = '';

const BPRS_PORTAL_ITEMS = [
  { id: 'somatic_concern', number: 1, title: 'Somatic Concern' },
  { id: 'anxiety', number: 2, title: 'Anxiety' },
  { id: 'emotional_withdrawal', number: 3, title: 'Emotional Withdrawal' },
  { id: 'conceptual_disorganization', number: 4, title: 'Conceptual Disorganization' },
  { id: 'guilt_feelings', number: 5, title: 'Guilt Feelings' },
  { id: 'tension', number: 6, title: 'Tension' },
  { id: 'mannerisms_posturing', number: 7, title: 'Mannerisms and Posturing' },
  { id: 'grandiosity', number: 8, title: 'Grandiosity' },
  { id: 'depressive_mood', number: 9, title: 'Depressive Mood' },
  { id: 'hostility', number: 10, title: 'Hostility' },
  { id: 'suspiciousness', number: 11, title: 'Suspiciousness' },
  { id: 'hallucinatory_behavior', number: 12, title: 'Hallucinatory Behavior' },
  { id: 'motor_retardation', number: 13, title: 'Motor Retardation' },
  { id: 'uncooperativeness', number: 14, title: 'Uncooperativeness' },
  { id: 'unusual_thought_content', number: 15, title: 'Unusual Thought Content' },
  { id: 'blunted_affect', number: 16, title: 'Blunted Affect' },
  { id: 'excitement', number: 17, title: 'Excitement' },
  { id: 'disorientation', number: 18, title: 'Disorientation' }
];

const BPRS_PORTAL_SCALE = [
  { value: 1, label: 'Not present' },
  { value: 2, label: 'Very mild' },
  { value: 3, label: 'Mild' },
  { value: 4, label: 'Moderate' },
  { value: 5, label: 'Moderately severe' },
  { value: 6, label: 'Severe' },
  { value: 7, label: 'Extremely severe' }
];

const BPRS_PORTAL_SHEET_HEADERS = [
  'submitted_at',
  'reference_code',
  'respondent_role',
  'completion_context',
  'preferred_language',
  'respondent_name',
  'patient_code',
  'caregiver_name',
  'immediate_safety',
  'notes',
  'total_score',
  'interpretation',
  'urgency_label',
  'urgency_tone',
  'route_destination',
  'route_timing',
  'route_team',
  'ai_screening_summary',
  'ai_triage_summary',
  'next_step',
  'workflow_summary',
  'notification_status',
  'notification_response',
  'top_signals',
  'summary_text',
  'somatic_concern',
  'anxiety',
  'emotional_withdrawal',
  'conceptual_disorganization',
  'guilt_feelings',
  'tension',
  'mannerisms_posturing',
  'grandiosity',
  'depressive_mood',
  'hostility',
  'suspiciousness',
  'hallucinatory_behavior',
  'motor_retardation',
  'uncooperativeness',
  'unusual_thought_content',
  'blunted_affect',
  'excitement',
  'disorientation'
];

const BPRS_PORTAL_CASE_STATUS_HEADERS = [
  'reference_code',
  'created_at',
  'updated_at',
  'total_score',
  'interpretation',
  'urgency_label',
  'urgency_tone',
  'workflow_stage_key',
  'workflow_stage_label',
  'workflow_stage_description',
  'route_destination',
  'route_timing',
  'route_team',
  'psychiatrist_alert_required',
  'emergency_flag',
  'mdt_recommended',
  'community_recommended',
  'appointment_recommended',
  'notification_status',
  'top_signals',
  'case_summary',
  'clinician_note'
];

function doGet(e) {
  const view = sanitizeText_(e && e.parameter ? e.parameter.view : '');
  const template = HtmlService.createTemplateFromFile(view === 'dashboard' ? 'Dashboard' : 'Index');
  return template.evaluate()
    .setTitle(view === 'dashboard' ? BPRS_PORTAL_DASHBOARD_TITLE : BPRS_PORTAL_APP_TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function authorizeAndSetup() {
  ensureBprsPortalSheet_();
  ensureCaseStatusSheet_();
  const spreadsheet = getBprsSpreadsheet_();
  return {
    success: true,
    message: 'BPRS public portal setup complete.',
    spreadsheetName: spreadsheet.getName(),
    spreadsheetUrl: spreadsheet.getUrl(),
    publicUrl: getViewUrl_(''),
    dashboardUrl: getViewUrl_('dashboard'),
    unifiedIntakeUrl: sanitizeText_(BPRS_PORTAL_UNIFIED_INTAKE_URL)
  };
}

function getBootstrap() {
  return getPublicBootstrap();
}

function getbootstrap() {
  return getPublicBootstrap();
}

function getPublicBootstrap() {
  ensureBprsPortalSheet_();
  ensureCaseStatusSheet_();
  return {
    appTitle: BPRS_PORTAL_APP_TITLE,
    subtitle: BPRS_PORTAL_SUBTITLE,
    spreadsheetUrl: getBprsSpreadsheet_().getUrl(),
    dashboardUrl: getViewUrl_('dashboard'),
    unifiedIntakeUrl: sanitizeText_(BPRS_PORTAL_UNIFIED_INTAKE_URL),
    items: BPRS_PORTAL_ITEMS,
    scale: BPRS_PORTAL_SCALE,
    workflowPhases: [
      '1. Access and identify who is completing the check-in',
      '2. AI intake captures context, language, and immediate safety concern',
      '3. Complete all 18 BPRS symptom ratings',
      '4. AI screening interprets symptom burden and top signals',
      '5. AI triage matches the right care pathway and timing',
      '6. Continue to Unified Intake before psychiatrist warning if score is above 40 or safety is flagged',
      '7. Continue to follow-up and community support'
    ],
    interpretationBands: [
      '18-30: Minimal to mild symptoms',
      '31-40: Mild to moderate clinical significance',
      '41-60: Moderate to severe psychopathology',
      'Above 60: Very severe psychiatric symptom burden'
    ]
  };
}

function getDashboardBootstrap() {
  ensureCaseStatusSheet_();
  return {
    title: BPRS_PORTAL_DASHBOARD_TITLE,
    spreadsheetUrl: getBprsSpreadsheet_().getUrl(),
    publicUrl: getViewUrl_(''),
    dashboardUrl: getViewUrl_('dashboard'),
    stages: getStageList_()
  };
}

function getDashboardData() {
  ensureCaseStatusSheet_();
  const cases = readCaseStatusRows_();
  const stageMap = getStageCatalog_();
  const buckets = {
    emergency: [],
    psychiatrist: [],
    mdt: [],
    community: [],
    closed: []
  };

  cases.forEach(function(item) {
    const key = stageMap[item.workflowStageKey] ? item.workflowStageKey : 'community';
    buckets[key].push(item);
  });

  const openCases = cases.filter(function(item) {
    return item.workflowStageKey !== 'closed';
  }).length;
  const alertsSent = cases.filter(function(item) {
    return item.notificationStatus === 'Sent';
  }).length;
  const todayCount = cases.filter(function(item) {
    return item.isToday;
  }).length;

  return {
    generatedAt: formatDateTime_(new Date()),
    spreadsheetUrl: getBprsSpreadsheet_().getUrl(),
    summary: {
      totalCases: cases.length,
      openCases: openCases,
      todayCases: todayCount,
      emergencyCases: buckets.emergency.length,
      psychiatristCases: buckets.psychiatrist.length,
      mdtCases: buckets.mdt.length,
      communityCases: buckets.community.length,
      alertsSent: alertsSent
    },
    columns: getStageList_().map(function(stage) {
      return {
        key: stage.key,
        title: stage.label,
        tone: stage.tone,
        description: stage.description,
        cases: buckets[stage.key]
      };
    }),
    recentCases: cases.slice(0, 12)
  };
}

function updateCaseStage(payload) {
  const referenceCode = sanitizeText_(payload && payload.referenceCode);
  const stageKey = sanitizeText_(payload && payload.stageKey);
  const clinicianNote = sanitizeText_(payload && payload.clinicianNote);
  const stage = getStageCatalog_()[stageKey];

  if (!referenceCode) {
    throw new Error('Missing reference code.');
  }
  if (!stage) {
    throw new Error('Invalid workflow stage.');
  }

  const sheet = ensureCaseStatusSheet_();
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    throw new Error('No cases found in dashboard.');
  }

  const headers = data[0];
  const rowIndex = data.findIndex(function(row, index) {
    return index > 0 && sanitizeText_(row[0]) === referenceCode;
  });

  if (rowIndex < 1) {
    throw new Error('Case not found for reference ' + referenceCode + '.');
  }

  const row = data[rowIndex];
  const columnMap = buildHeaderIndexMap_(headers);

  row[columnMap.updated_at] = new Date();
  row[columnMap.workflow_stage_key] = stage.key;
  row[columnMap.workflow_stage_label] = stage.label;
  row[columnMap.workflow_stage_description] = stage.description;
  row[columnMap.clinician_note] = clinicianNote;

  sheet.getRange(rowIndex + 1, 1, 1, headers.length).setValues([row]);

  return {
    success: true,
    referenceCode: referenceCode,
    stageLabel: stage.label,
    dashboard: getDashboardData()
  };
}

function saveAssessment(payload) {
  ensureBprsPortalSheet_();
  ensureCaseStatusSheet_();
  const prepared = normalizeAssessmentPayload_(payload || {});
  const scoring = scoreBprsAssessment_(prepared);
  const referenceCode = buildReferenceCode_();
  const notification = maybeNotifyPsychiatrist_(prepared, scoring, referenceCode);

  appendAssessmentRow_(prepared, scoring, referenceCode, notification);
  upsertCaseStatusRow_(referenceCode, scoring, notification);

  return {
    saved: true,
    submissionMode: 'apps_script',
    referenceCode: referenceCode,
    totalScore: scoring.totalScore,
    interpretation: scoring.interpretation,
    urgencyLabel: scoring.urgencyLabel,
    urgencyTone: scoring.urgencyTone,
    routeDestination: scoring.routeDestination,
    routeTiming: scoring.routeTiming,
    routeTeam: scoring.routeTeam,
    aiScreeningSummary: scoring.aiScreeningSummary,
    aiTriageSummary: scoring.aiTriageSummary,
    workflowStageKey: scoring.workflowStageKey,
    workflowStageLabel: scoring.workflowStageLabel,
    workflowStageDescription: scoring.workflowStageDescription,
    mdtRecommended: scoring.mdtRecommended,
    communityRecommended: scoring.communityRecommended,
    appointmentRecommended: scoring.appointmentRecommended,
    nextStep: scoring.nextStep,
    workflowSummary: scoring.workflowSummary,
    notificationStatus: notification.status,
    notificationResponse: notification.response,
    notificationTriggered: notification.triggered,
    topSignals: scoring.topSignals,
    summaryText: scoring.summaryText,
    spreadsheetUrl: getBprsSpreadsheet_().getUrl(),
    dashboardUrl: getViewUrl_('dashboard'),
    unifiedIntakeUrl: sanitizeText_(BPRS_PORTAL_UNIFIED_INTAKE_URL)
  };
}

function normalizeAssessmentPayload_(payload) {
  const responses = {};

  BPRS_PORTAL_ITEMS.forEach(function(item) {
    const value = Number(payload.responses && payload.responses[item.id]);
    if (!isFinite(value) || value < 1 || value > 7) {
      throw new Error('Please complete all 18 BPRS items using scores from 1 to 7.');
    }
    responses[item.id] = value;
  });

  return {
    respondentRole: sanitizeText_(payload.respondentRole) || 'patient',
    completionContext: sanitizeText_(payload.completionContext) || 'at_home',
    preferredLanguage: sanitizeText_(payload.preferredLanguage) || 'en',
    respondentName: sanitizeText_(payload.respondentName),
    patientCode: sanitizeText_(payload.patientCode),
    caregiverName: sanitizeText_(payload.caregiverName),
    immediateSafety: payload.immediateSafety ? 'Yes' : 'No',
    notes: sanitizeText_(payload.notes),
    responses: responses
  };
}

function scoreBprsAssessment_(prepared) {
  const totalScore = BPRS_PORTAL_ITEMS.reduce(function(sum, item) {
    return sum + prepared.responses[item.id];
  }, 0);

  let interpretation = '';
  if (totalScore <= 30) {
    interpretation = 'Minimal to mild symptoms';
  } else if (totalScore <= 40) {
    interpretation = 'Mild to moderate clinical significance';
  } else if (totalScore <= 60) {
    interpretation = 'Moderate to severe psychopathology';
  } else {
    interpretation = 'Very severe psychiatric symptom burden';
  }

  const highConcernIds = [
    'hallucinatory_behavior',
    'unusual_thought_content',
    'disorientation',
    'hostility',
    'excitement',
    'conceptual_disorganization'
  ];
  const hasCriticalItem = highConcernIds.some(function(id) {
    return prepared.responses[id] >= 6;
  });
  const hasUrgentItem = highConcernIds.some(function(id) {
    return prepared.responses[id] >= 5;
  });
  const psychosisLoad = sumResponses_(prepared.responses, [
    'suspiciousness',
    'hallucinatory_behavior',
    'unusual_thought_content',
    'disorientation',
    'conceptual_disorganization',
    'grandiosity'
  ]);
  const moodDistressLoad = sumResponses_(prepared.responses, [
    'anxiety',
    'depressive_mood',
    'guilt_feelings',
    'tension',
    'emotional_withdrawal',
    'blunted_affect'
  ]);
  const activationLoad = sumResponses_(prepared.responses, [
    'hostility',
    'excitement',
    'mannerisms_posturing',
    'motor_retardation',
    'uncooperativeness'
  ]);

  let urgencyLabel = 'Stable support pathway';
  let urgencyTone = 'stable';
  let routeDestination = 'Community support or routine clinic';
  let routeTiming = 'Routine follow-up';
  let routeTeam = 'Patient, family, caregiver, or community support link';
  let aiScreeningSummary = '';
  let aiTriageSummary = '';
  let workflowStageKey = 'community';
  let workflowStageLabel = 'Community monitoring';
  let workflowStageDescription = 'Low-risk cases stay visible for community or family follow-up and self-help support.';
  let psychiatristAlertRequired = false;
  let emergencyFlag = false;
  let mdtRecommended = false;
  let communityRecommended = true;
  let appointmentRecommended = false;
  let nextStep = 'Share the result with the care team, continue routine follow-up, and use the summary to support a clinical conversation.';
  let workflowSummary = 'Front door access completed. Continue with routine follow-up, psychoeducation, and community support if needed.';
  const dominantConcern = buildDominantConcernLabel_(psychosisLoad, moodDistressLoad, activationLoad);

  if (prepared.immediateSafety === 'Yes') {
    urgencyLabel = 'Emergency attention now';
    urgencyTone = 'critical';
    routeDestination = 'Emergency services';
    routeTiming = 'Now';
    routeTeam = 'Emergency team and psychiatric crisis response';
    workflowStageKey = 'emergency';
    workflowStageLabel = 'Emergency now';
    workflowStageDescription = 'Immediate safety concern. Alert psychiatrist, activate emergency routing, and prepare MDT support after stabilization.';
    psychiatristAlertRequired = true;
    emergencyFlag = true;
    mdtRecommended = true;
    communityRecommended = false;
    appointmentRecommended = true;
    aiScreeningSummary = 'AI-assisted screening detected an immediate safety concern from intake and symptom review, with the strongest pattern in ' + dominantConcern + '.';
    aiTriageSummary = 'AI-assisted triage recommends immediate emergency routing and psychiatric crisis response without waiting for a routine appointment.';
    nextStep = 'Go to the nearest emergency service or activate local emergency support immediately. Do not wait for a routine appointment.';
    workflowSummary = 'Front door access detected immediate safety concern. Escalate directly to emergency services and psychiatric crisis response.';
  } else if (totalScore > 60 || hasCriticalItem) {
    urgencyLabel = 'Immediate clinical review';
    urgencyTone = 'critical';
    routeDestination = psychosisLoad >= moodDistressLoad ? 'Psychiatrist / emergency psychiatric review' : 'Psychiatrist and high-priority psychological review';
    routeTiming = 'Immediate same-day review';
    routeTeam = 'Psychiatrist, nurse, and crisis-capable mental health team';
    workflowStageKey = 'psychiatrist';
    workflowStageLabel = 'Psychiatrist review';
    workflowStageDescription = 'Very high-risk case. Notify psychiatrist now, arrange same-day review, and allow psychiatrist to pull in MDT support.';
    psychiatristAlertRequired = true;
    mdtRecommended = true;
    communityRecommended = false;
    appointmentRecommended = true;
    aiScreeningSummary = 'AI-assisted screening detected very high symptom burden or critical psychiatric signals, with the strongest pattern in ' + dominantConcern + '.';
    aiTriageSummary = 'AI-assisted triage recommends immediate same-day specialist review with crisis-capable psychiatric support.';
    nextStep = 'Escalate for urgent same-day mental health review and direct safety assessment.';
    workflowSummary = 'Front door assessment shows very high symptom burden or critical symptom signals. Move directly to urgent mental health review and same-day safety assessment.';
  } else if (totalScore > 40 || hasUrgentItem) {
    urgencyLabel = 'Priority same-day review';
    urgencyTone = 'urgent';
    routeDestination = psychosisLoad + activationLoad >= moodDistressLoad
      ? 'Psychiatrist'
      : 'Psychologist or psychiatrist';
    routeTiming = 'Priority review today';
    routeTeam = 'Mental health intake team with multidisciplinary backup';
    workflowStageKey = 'psychiatrist';
    workflowStageLabel = 'Psychiatrist review';
    workflowStageDescription = 'New high-priority case. Notify psychiatrist, arrange early appointment, and keep MDT backup ready.';
    psychiatristAlertRequired = true;
    mdtRecommended = true;
    communityRecommended = true;
    appointmentRecommended = true;
    aiScreeningSummary = 'AI-assisted screening detected moderate to severe psychopathology or urgent psychiatric signals, with the strongest pattern in ' + dominantConcern + '.';
    aiTriageSummary = 'AI-assisted triage recommends priority same-day mental health review and psychiatrist notification if needed.';
    nextStep = 'Arrange prompt psychiatric or psychological review, ideally the same day or as soon as safely possible.';
    workflowSummary = 'Front door assessment shows moderate to severe psychopathology or urgent symptom signals. Route to priority same-day specialist review.';
  } else if (totalScore >= 31) {
    urgencyLabel = 'Watch closely and follow up';
    urgencyTone = 'watch';
    routeDestination = moodDistressLoad >= psychosisLoad ? 'Psychologist / primary mental health clinic' : 'GP or psychiatrist for follow-up review';
    routeTiming = 'Within 24 to 72 hours';
    routeTeam = 'Outpatient mental health team, GP, or structured follow-up service';
    workflowStageKey = 'mdt';
    workflowStageLabel = 'MDT coordination';
    workflowStageDescription = 'Moderate-risk case. Arrange follow-up, allow psychiatrist or psychologist to consult MDT, and consider community monitoring.';
    mdtRecommended = true;
    communityRecommended = true;
    appointmentRecommended = true;
    aiScreeningSummary = 'AI-assisted screening detected clinically significant symptoms, with the strongest pattern in ' + dominantConcern + '.';
    aiTriageSummary = 'AI-assisted triage recommends structured follow-up within 24 to 72 hours with the most appropriate mental health service.';
    nextStep = 'Share with the clinic, document the pattern, and arrange follow-up with the appropriate professional team.';
    workflowSummary = 'Front door assessment shows clinically significant symptoms. Route to structured follow-up and the most appropriate professional team.';
  } else {
    aiScreeningSummary = 'AI-assisted screening detected lower symptom burden overall, while the most noticeable pattern remains in ' + dominantConcern + '.';
    aiTriageSummary = 'AI-assisted triage recommends routine follow-up, psychoeducation, and community support unless symptoms escalate.';
  }

  const topSignals = BPRS_PORTAL_ITEMS
    .map(function(item) {
      return {
        title: item.title,
        value: prepared.responses[item.id]
      };
    })
    .sort(function(left, right) {
      return right.value - left.value;
    })
    .slice(0, 3)
    .filter(function(item) {
      return item.value >= 4;
    })
    .map(function(item) {
      return item.title + ' (' + item.value + '/7)';
    });

  const summaryText = [
    'BPRS total score: ' + totalScore + '.',
    'Interpretation: ' + interpretation + '.',
    'Urgency: ' + urgencyLabel + '.',
    'AI screening: ' + aiScreeningSummary,
    'AI triage: ' + aiTriageSummary,
    'Route: ' + routeDestination + ' (' + routeTiming + ').',
    topSignals.length ? 'Top symptom signals: ' + topSignals.join(', ') + '.' : 'No symptom domain reached the moderate threshold of 4/7 in the top three signals.',
    'This result should support, not replace, clinical judgment.'
  ].join(' ');

  return {
    totalScore: totalScore,
    interpretation: interpretation,
    urgencyLabel: urgencyLabel,
    urgencyTone: urgencyTone,
    routeDestination: routeDestination,
    routeTiming: routeTiming,
    routeTeam: routeTeam,
    aiScreeningSummary: aiScreeningSummary,
    aiTriageSummary: aiTriageSummary,
    workflowStageKey: workflowStageKey,
    workflowStageLabel: workflowStageLabel,
    workflowStageDescription: workflowStageDescription,
    psychiatristAlertRequired: psychiatristAlertRequired,
    emergencyFlag: emergencyFlag,
    mdtRecommended: mdtRecommended,
    communityRecommended: communityRecommended,
    appointmentRecommended: appointmentRecommended,
    nextStep: nextStep,
    workflowSummary: workflowSummary,
    topSignals: topSignals,
    summaryText: summaryText
  };
}

function appendAssessmentRow_(prepared, scoring, referenceCode, notification) {
  const sheet = ensureBprsPortalSheet_();
  const row = [
    new Date(),
    referenceCode,
    prepared.respondentRole,
    prepared.completionContext,
    prepared.preferredLanguage,
    prepared.respondentName,
    prepared.patientCode,
    prepared.caregiverName,
    prepared.immediateSafety,
    prepared.notes,
    scoring.totalScore,
    scoring.interpretation,
    scoring.urgencyLabel,
    scoring.urgencyTone,
    scoring.routeDestination,
    scoring.routeTiming,
    scoring.routeTeam,
    scoring.aiScreeningSummary,
    scoring.aiTriageSummary,
    scoring.nextStep,
    scoring.workflowSummary,
    notification.status,
    notification.response,
    scoring.topSignals.join(', '),
    scoring.summaryText
  ];

  BPRS_PORTAL_ITEMS.forEach(function(item) {
    row.push(prepared.responses[item.id]);
  });

  sheet.appendRow(row);
}

function ensureBprsPortalSheet_() {
  const spreadsheet = getBprsSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(BPRS_PORTAL_SUBMISSIONS_SHEET);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(BPRS_PORTAL_SUBMISSIONS_SHEET);
  }

  const headerRange = sheet.getRange(1, 1, 1, BPRS_PORTAL_SHEET_HEADERS.length);
  const currentHeaders = headerRange.getValues()[0];
  const needsHeaderRefresh = currentHeaders.join('|') !== BPRS_PORTAL_SHEET_HEADERS.join('|');
  if (needsHeaderRefresh) {
    headerRange.setValues([BPRS_PORTAL_SHEET_HEADERS]);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, BPRS_PORTAL_SHEET_HEADERS.length);
  }

  return sheet;
}

function ensureCaseStatusSheet_() {
  const spreadsheet = getBprsSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(BPRS_PORTAL_CASE_STATUS_SHEET);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(BPRS_PORTAL_CASE_STATUS_SHEET);
  }

  const headerRange = sheet.getRange(1, 1, 1, BPRS_PORTAL_CASE_STATUS_HEADERS.length);
  const currentHeaders = headerRange.getValues()[0];
  const needsHeaderRefresh = currentHeaders.join('|') !== BPRS_PORTAL_CASE_STATUS_HEADERS.join('|');
  if (needsHeaderRefresh) {
    headerRange.setValues([BPRS_PORTAL_CASE_STATUS_HEADERS]);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, BPRS_PORTAL_CASE_STATUS_HEADERS.length);
  }

  return sheet;
}

function getBprsSpreadsheet_() {
  const properties = PropertiesService.getScriptProperties();
  const storedId = sanitizeText_(properties.getProperty(BPRS_PORTAL_SPREADSHEET_ID_PROPERTY));
  if (storedId) {
    try {
      return SpreadsheetApp.openById(storedId);
    } catch (error) {}
  }

  const spreadsheet = SpreadsheetApp.create(BPRS_PORTAL_SPREADSHEET_NAME);
  properties.setProperty(BPRS_PORTAL_SPREADSHEET_ID_PROPERTY, spreadsheet.getId());
  return spreadsheet;
}

function buildReferenceCode_() {
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
  const randomChunk = Math.floor(Math.random() * 900 + 100);
  return 'BPRS-' + stamp + '-' + randomChunk;
}

function getViewUrl_(view) {
  const baseUrl = sanitizeText_(ScriptApp.getService().getUrl());
  if (!baseUrl) {
    return '';
  }
  if (!view) {
    return baseUrl;
  }
  return baseUrl + '?view=' + encodeURIComponent(view);
}

function upsertCaseStatusRow_(referenceCode, scoring, notification) {
  const sheet = ensureCaseStatusSheet_();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const existingIndex = data.findIndex(function(row, index) {
    return index > 0 && sanitizeText_(row[0]) === referenceCode;
  });
  const stage = getStageCatalog_()[scoring.workflowStageKey] || getStageCatalog_().community;
  const row = [
    referenceCode,
    new Date(),
    new Date(),
    scoring.totalScore,
    scoring.interpretation,
    scoring.urgencyLabel,
    scoring.urgencyTone,
    stage.key,
    stage.label,
    stage.description,
    scoring.routeDestination,
    scoring.routeTiming,
    scoring.routeTeam,
    scoring.psychiatristAlertRequired ? 'Yes' : 'No',
    scoring.emergencyFlag ? 'Yes' : 'No',
    scoring.mdtRecommended ? 'Yes' : 'No',
    scoring.communityRecommended ? 'Yes' : 'No',
    scoring.appointmentRecommended ? 'Yes' : 'No',
    notification.status,
    scoring.topSignals.join(', '),
    scoring.workflowSummary,
    ''
  ];

  if (existingIndex > 0) {
    const columnMap = buildHeaderIndexMap_(headers);
    const existingRow = data[existingIndex];
    row[columnMap.created_at] = existingRow[columnMap.created_at] || row[columnMap.created_at];
    row[columnMap.clinician_note] = existingRow[columnMap.clinician_note] || '';
    sheet.getRange(existingIndex + 1, 1, 1, row.length).setValues([row]);
    return;
  }

  sheet.appendRow(row);
}

function maybeNotifyPsychiatrist_(prepared, scoring, referenceCode) {
  const shouldNotify = scoring.totalScore > BPRS_PORTAL_NOTIFY_THRESHOLD || prepared.immediateSafety === 'Yes';
  if (!shouldNotify) {
    return {
      triggered: false,
      status: 'Not triggered',
      response: 'No psychiatrist alert was sent because the score did not go above ' + BPRS_PORTAL_NOTIFY_THRESHOLD + ' and no immediate safety flag was selected.'
    };
  }

  if (sanitizeText_(BPRS_PORTAL_UNIFIED_INTAKE_URL)) {
    return {
      triggered: true,
      status: 'Unified Intake pending',
      response: 'High-priority BPRS result captured. Review and save the connected Unified Intake form before Telegram alert delivery.'
    };
  }

  if (!BPRS_PORTAL_NOTIFY_ENABLED) {
    return {
      triggered: true,
      status: 'Disabled',
      response: 'Psychiatrist notification is disabled in Code.gs.'
    };
  }

  if (!sanitizeText_(BPRS_PORTAL_TELEGRAM_BOT_TOKEN) || !sanitizeText_(BPRS_PORTAL_TELEGRAM_CHAT_ID)) {
    return {
      triggered: true,
      status: 'Config missing',
      response: 'Missing BPRS_PORTAL_TELEGRAM_BOT_TOKEN or BPRS_PORTAL_TELEGRAM_CHAT_ID.'
    };
  }

  const url = 'https://api.telegram.org/bot' + BPRS_PORTAL_TELEGRAM_BOT_TOKEN + '/sendMessage';
  const payload = {
    chat_id: BPRS_PORTAL_TELEGRAM_CHAT_ID,
    text: buildPsychiatristAlertMessage_(prepared, scoring, referenceCode)
  };

  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    const statusCode = response.getResponseCode();
    const responseText = truncateText_(response.getContentText(), 500);
    return {
      triggered: true,
      status: statusCode >= 200 && statusCode < 300 ? 'Sent' : 'Failed',
      response: 'HTTP ' + statusCode + ': ' + responseText
    };
  } catch (error) {
    return {
      triggered: true,
      status: 'Error',
      response: truncateText_(error && error.message ? error.message : String(error), 500)
    };
  }
}

function buildPsychiatristAlertMessage_(prepared, scoring, referenceCode) {
  const topSignals = scoring.topSignals.length ? scoring.topSignals.join(', ') : 'No moderate-or-higher top signals captured';
  const lines = [
    'MindBridge BPRS New Patient Alert',
    'A new BPRS public workflow submission crossed the psychiatrist alert threshold.',
    '',
    'Reference: ' + referenceCode,
    'Patient-safe code: ' + referenceCode,
    'Context: ' + firstNonEmpty_(prepared.completionContext, 'Not provided'),
    'Immediate safety: ' + firstNonEmpty_(prepared.immediateSafety, 'No'),
    'BPRS total score: ' + String(scoring.totalScore),
    'Interpretation: ' + scoring.interpretation,
    'Urgency: ' + scoring.urgencyLabel,
    'Workflow stage: ' + scoring.workflowStageLabel,
    'AI screening: ' + scoring.aiScreeningSummary,
    'AI triage: ' + scoring.aiTriageSummary,
    'Route: ' + scoring.routeDestination,
    'Timing: ' + scoring.routeTiming,
    'Suggested team: ' + scoring.routeTeam,
    'Top signals: ' + topSignals
  ];
  return lines.join('\n');
}

function sanitizeText_(value) {
  return String(value === undefined || value === null ? '' : value).trim();
}

function buildDominantConcernLabel_(psychosisLoad, moodDistressLoad, activationLoad) {
  if (psychosisLoad >= moodDistressLoad && psychosisLoad >= activationLoad) {
    return 'thinking and perception symptoms';
  }
  if (moodDistressLoad >= psychosisLoad && moodDistressLoad >= activationLoad) {
    return 'mood and emotional distress symptoms';
  }
  return 'behavioral activation or slowing symptoms';
}

function getStageCatalog_() {
  return {
    emergency: {
      key: 'emergency',
      label: 'Emergency now',
      tone: 'critical',
      description: 'Immediate safety escalation, psychiatrist alert, and emergency routing.'
    },
    psychiatrist: {
      key: 'psychiatrist',
      label: 'Psychiatrist review',
      tone: 'urgent',
      description: 'New high-risk case waiting for psychiatrist review and appointment planning.'
    },
    mdt: {
      key: 'mdt',
      label: 'MDT coordination',
      tone: 'watch',
      description: 'Psychiatrist, psychologist, nurse, and MDT coordination with possible community support.'
    },
    community: {
      key: 'community',
      label: 'Community monitoring',
      tone: 'stable',
      description: 'Routine follow-up, community resources, and close family or local monitoring.'
    },
    closed: {
      key: 'closed',
      label: 'Closed / followed up',
      tone: 'stable',
      description: 'Case reviewed, action completed, and follow-up documented.'
    }
  };
}

function getStageList_() {
  const catalog = getStageCatalog_();
  return [
    catalog.emergency,
    catalog.psychiatrist,
    catalog.mdt,
    catalog.community,
    catalog.closed
  ];
}

function readCaseStatusRows_() {
  const sheet = ensureCaseStatusSheet_();
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return [];
  }

  const headers = data[0];
  const columnMap = buildHeaderIndexMap_(headers);

  return data.slice(1).filter(function(row) {
    return sanitizeText_(row[columnMap.reference_code]);
  }).map(function(row) {
    const createdAt = row[columnMap.created_at];
    const updatedAt = row[columnMap.updated_at];
    return {
      referenceCode: sanitizeText_(row[columnMap.reference_code]),
      totalScore: Number(row[columnMap.total_score] || 0),
      interpretation: sanitizeText_(row[columnMap.interpretation]),
      urgencyLabel: sanitizeText_(row[columnMap.urgency_label]),
      urgencyTone: sanitizeText_(row[columnMap.urgency_tone]) || 'stable',
      workflowStageKey: sanitizeText_(row[columnMap.workflow_stage_key]) || 'community',
      workflowStageLabel: sanitizeText_(row[columnMap.workflow_stage_label]),
      workflowStageDescription: sanitizeText_(row[columnMap.workflow_stage_description]),
      routeDestination: sanitizeText_(row[columnMap.route_destination]),
      routeTiming: sanitizeText_(row[columnMap.route_timing]),
      routeTeam: sanitizeText_(row[columnMap.route_team]),
      psychiatristAlertRequired: sanitizeText_(row[columnMap.psychiatrist_alert_required]) === 'Yes',
      emergencyFlag: sanitizeText_(row[columnMap.emergency_flag]) === 'Yes',
      mdtRecommended: sanitizeText_(row[columnMap.mdt_recommended]) === 'Yes',
      communityRecommended: sanitizeText_(row[columnMap.community_recommended]) === 'Yes',
      appointmentRecommended: sanitizeText_(row[columnMap.appointment_recommended]) === 'Yes',
      notificationStatus: sanitizeText_(row[columnMap.notification_status]),
      topSignals: sanitizeText_(row[columnMap.top_signals]),
      caseSummary: sanitizeText_(row[columnMap.case_summary]),
      clinicianNote: sanitizeText_(row[columnMap.clinician_note]),
      createdAtMs: createdAt instanceof Date ? createdAt.getTime() : 0,
      createdAtLabel: formatDateTime_(createdAt),
      updatedAtLabel: formatDateTime_(updatedAt),
      isToday: isSameLocalDate_(createdAt, new Date())
    };
  }).sort(function(left, right) {
    return right.createdAtMs - left.createdAtMs;
  });
}

function buildHeaderIndexMap_(headers) {
  return headers.reduce(function(map, header, index) {
    map[sanitizeText_(header)] = index;
    return map;
  }, {});
}

function formatDateTime_(value) {
  if (!(value instanceof Date)) {
    return sanitizeText_(value);
  }
  return Utilities.formatDate(value, Session.getScriptTimeZone(), 'dd MMM yyyy HH:mm');
}

function isSameLocalDate_(left, right) {
  if (!(left instanceof Date) || !(right instanceof Date)) {
    return false;
  }
  return Utilities.formatDate(left, Session.getScriptTimeZone(), 'yyyyMMdd') ===
    Utilities.formatDate(right, Session.getScriptTimeZone(), 'yyyyMMdd');
}

function sumResponses_(responses, ids) {
  return ids.reduce(function(sum, id) {
    return sum + Number(responses[id] || 0);
  }, 0);
}

function firstNonEmpty_() {
  for (var i = 0; i < arguments.length; i += 1) {
    if (sanitizeText_(arguments[i])) {
      return sanitizeText_(arguments[i]);
    }
  }
  return '';
}

function truncateText_(value, maxLength) {
  const text = sanitizeText_(value);
  if (!maxLength || text.length <= maxLength) {
    return text;
  }
  return text.slice(0, Math.max(0, maxLength - 3)) + '...';
}
