const APP_TITLE = 'Mental Health Safe Handoff Summary Portal';
const APP_SUBTITLE = 'Standalone Phase 1 continuity layer for minimum necessary coordination';
const SPREADSHEET_ID = '';

const SHEET_SCHEMAS = {
  Cases: [
    'created_at',
    'case_id',
    'patient_code',
    'case_label',
    'entry_pathway',
    'current_status',
    'priority_flag'
  ],
  Handoffs: [
    'updated_at',
    'case_id',
    'patient_code',
    'reviewed_by',
    'consent_status',
    'caregiver_involvement',
    'receiving_sector',
    'handoff_ready',
    'next_step_owner',
    'next_contact_window',
    'minimum_necessary_summary',
    'crisis_safety_summary',
    'do_not_share',
    'referral_status'
  ],
  Partner_Log: [
    'updated_at',
    'case_id',
    'partner_name',
    'partner_type',
    'contact_status',
    'requested_action',
    'notes'
  ],
  Dashboard: [
    'section',
    'metric',
    'value',
    'updated_at'
  ]
};

const OPTION_SETS = {
  entryPathway: ['ER urgent', 'Walk-in', 'Scheduled appointment', 'Community referral', 'Partner referral'],
  caseStatus: ['Open', 'Under review', 'Handoff in progress', 'Follow-up active', 'Closed'],
  priorityFlag: ['Green', 'Orange', 'Red'],
  consentStatus: ['Confirmed', 'Pending discussion', 'Emergency exception only'],
  caregiverInvolvement: ['Patient only', 'Family involved', 'Family not involved', 'To be discussed'],
  receivingSector: ['Public sector', 'Private / NGO', 'Community team', 'Mixed network'],
  handoffReady: ['Draft', 'Ready to send', 'Sent', 'Needs review'],
  nextContactWindow: ['Same day', 'Within 24 hours', 'Within 72 hours', 'At next appointment'],
  referralStatus: ['Not started', 'Requested', 'Accepted', 'In progress', 'Completed', 'Closed'],
  partnerType: ['Community team', 'District health office', 'NGO', 'Private clinic', 'Foundation / welfare', 'Other'],
  contactStatus: ['Draft', 'Requested', 'Accepted', 'In progress', 'Completed', 'Closed']
};

function doGet() {
  ensureSheets_();
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle(APP_TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getBootstrap() {
  ensureSheets_();
  refreshDashboard_();
  return {
    appTitle: APP_TITLE,
    subtitle: APP_SUBTITLE,
    optionSets: OPTION_SETS,
    note: 'This portal does not replace the hospital record. It prepares a minimum necessary handoff summary for safe external coordination.',
    dashboard: getDashboardData_(),
    caseOptions: getCaseOptions_(),
    latestHandoffs: getLatestHandoffCards_()
  };
}

function saveCase(payload) {
  ensureSheets_();
  const patientCode = sanitizeText_(payload.patient_code).toUpperCase() || createPatientCode_();
  const caseId = sanitizeText_(payload.case_id) || createCaseId_();
  const existingCase = getSheetRecords_('Cases').some(function(record) {
    return sanitizeText_(record.case_id) === caseId;
  });

  if (existingCase) {
    throw new Error('This case ID already exists. Please use a different case ID.');
  }

  appendRecord_('Cases', {
    created_at: new Date(),
    case_id: caseId,
    patient_code: patientCode,
    case_label: sanitizeText_(payload.case_label) || patientCode,
    entry_pathway: sanitizeText_(payload.entry_pathway),
    current_status: sanitizeText_(payload.current_status) || 'Open',
    priority_flag: sanitizeText_(payload.priority_flag) || 'Green'
  });

  refreshDashboard_();
  return {
    success: true,
    caseId: caseId,
    patientCode: patientCode,
    message: 'Case created successfully.',
    dashboard: getDashboardData_(),
    caseOptions: getCaseOptions_(),
    latestHandoffs: getLatestHandoffCards_()
  };
}

function saveHandoff(payload) {
  ensureSheets_();
  const caseId = sanitizeText_(payload.case_id);
  if (!caseId) {
    throw new Error('Case is required.');
  }
  assertCaseExists_(caseId);

  const patientCode = findPatientCodeByCaseId_(caseId);

  appendRecord_('Handoffs', {
    updated_at: new Date(),
    case_id: caseId,
    patient_code: patientCode,
    reviewed_by: sanitizeText_(payload.reviewed_by),
    consent_status: sanitizeText_(payload.consent_status),
    caregiver_involvement: sanitizeText_(payload.caregiver_involvement),
    receiving_sector: sanitizeText_(payload.receiving_sector),
    handoff_ready: sanitizeText_(payload.handoff_ready) || 'Draft',
    next_step_owner: sanitizeText_(payload.next_step_owner),
    next_contact_window: sanitizeText_(payload.next_contact_window),
    minimum_necessary_summary: sanitizeText_(payload.minimum_necessary_summary),
    crisis_safety_summary: sanitizeText_(payload.crisis_safety_summary),
    do_not_share: sanitizeText_(payload.do_not_share),
    referral_status: sanitizeText_(payload.referral_status) || 'Not started'
  });

  refreshDashboard_();
  return {
    success: true,
    message: 'Safe handoff summary saved.',
    dashboard: getDashboardData_(),
    caseOptions: getCaseOptions_(),
    latestHandoffs: getLatestHandoffCards_()
  };
}

function savePartnerLog(payload) {
  ensureSheets_();
  const caseId = sanitizeText_(payload.case_id);
  if (!caseId) {
    throw new Error('Case is required.');
  }
  assertCaseExists_(caseId);

  appendRecord_('Partner_Log', {
    updated_at: new Date(),
    case_id: caseId,
    partner_name: sanitizeText_(payload.partner_name),
    partner_type: sanitizeText_(payload.partner_type),
    contact_status: sanitizeText_(payload.contact_status) || 'Draft',
    requested_action: sanitizeText_(payload.requested_action),
    notes: sanitizeText_(payload.notes)
  });

  refreshDashboard_();
  return {
    success: true,
    message: 'Partner coordination log saved.',
    dashboard: getDashboardData_(),
    caseOptions: getCaseOptions_(),
    latestHandoffs: getLatestHandoffCards_()
  };
}

function seedDemoData() {
  ensureSheets_();
  if (getSheetRecords_('Cases').length > 0) {
    return {
      success: true,
      message: 'Demo data already exists.',
      dashboard: getDashboardData_(),
      caseOptions: getCaseOptions_(),
      latestHandoffs: getLatestHandoffCards_()
    };
  }

  saveCase({
    case_id: 'CASE-1001',
    patient_code: 'MH-001',
    case_label: 'Patient Alpha',
    entry_pathway: 'ER urgent',
    current_status: 'Under review',
    priority_flag: 'Red'
  });

  saveCase({
    case_id: 'CASE-1002',
    patient_code: 'MH-002',
    case_label: 'Patient Bravo',
    entry_pathway: 'Community referral',
    current_status: 'Handoff in progress',
    priority_flag: 'Orange'
  });

  saveCase({
    case_id: 'CASE-1003',
    patient_code: 'MH-003',
    case_label: 'Patient Charlie',
    entry_pathway: 'Scheduled appointment',
    current_status: 'Follow-up active',
    priority_flag: 'Green'
  });

  saveHandoff({
    case_id: 'CASE-1001',
    reviewed_by: 'Doctor Demo',
    consent_status: 'Emergency exception only',
    caregiver_involvement: 'To be discussed',
    receiving_sector: 'Public sector',
    handoff_ready: 'Ready to send',
    next_step_owner: 'District Health Office',
    next_contact_window: 'Within 24 hours',
    minimum_necessary_summary: 'Recent crisis presentation with limited caregiver support. Needs urgent clinic follow-up and medication continuity.',
    crisis_safety_summary: 'Escalate same day if self-harm thoughts, hopelessness, or missed medication reappear.',
    do_not_share: 'Detailed psychotherapy history and sensitive narrative content remain in the hospital record.',
    referral_status: 'Requested'
  });

  saveHandoff({
    case_id: 'CASE-1002',
    reviewed_by: 'Social Worker Demo',
    consent_status: 'Confirmed',
    caregiver_involvement: 'Family involved',
    receiving_sector: 'Private / NGO',
    handoff_ready: 'Sent',
    next_step_owner: 'Hope Foundation',
    next_contact_window: 'Within 72 hours',
    minimum_necessary_summary: 'Medication lapse, caregiver strain, and financial stress are disrupting continuity of care.',
    crisis_safety_summary: 'Monitor for missed follow-up, worsening agitation, or loss of supervision.',
    do_not_share: 'Do not circulate detailed family conflict notes beyond direct coordination need.',
    referral_status: 'Accepted'
  });

  savePartnerLog({
    case_id: 'CASE-1001',
    partner_name: 'District Health Office',
    partner_type: 'District health office',
    contact_status: 'Requested',
    requested_action: 'Coordinate urgent clinic follow-up and home contact.',
    notes: 'Use only the minimum necessary summary.'
  });

  savePartnerLog({
    case_id: 'CASE-1002',
    partner_name: 'Hope Foundation',
    partner_type: 'NGO',
    contact_status: 'In progress',
    requested_action: 'Review transport and medication support package.',
    notes: 'Family already aware and involved.'
  });

  refreshDashboard_();
  return {
    success: true,
    message: 'Demo data ready.',
    dashboard: getDashboardData_(),
    caseOptions: getCaseOptions_(),
    latestHandoffs: getLatestHandoffCards_()
  };
}

function ensureSheets_() {
  const spreadsheet = getSpreadsheet_();
  Object.keys(SHEET_SCHEMAS).forEach(function(sheetName) {
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }
    ensureHeaderRow_(sheet, SHEET_SCHEMAS[sheetName]);
  });
}

function refreshDashboard_() {
  const dashboard = getDashboardData_();
  const sheet = getSheet_('Dashboard');
  const rows = [
    ['summary', 'Total cases', dashboard.totalCases, new Date()],
    ['summary', 'Handoffs ready', dashboard.handoffsReady, new Date()],
    ['summary', 'Consent pending', dashboard.consentPending, new Date()],
    ['summary', 'Open partner loops', dashboard.openPartnerLoops, new Date()]
  ];

  sheet.clear();
  sheet.getRange(1, 1, 1, SHEET_SCHEMAS.Dashboard.length).setValues([SHEET_SCHEMAS.Dashboard]);
  if (rows.length) {
    sheet.getRange(2, 1, rows.length, SHEET_SCHEMAS.Dashboard.length).setValues(rows);
  }
}

function getDashboardData_() {
  const cases = getSheetRecords_('Cases');
  const latestHandoffs = indexLatestByCase_(getSheetRecords_('Handoffs'), 'updated_at');
  const latestPartnerLogs = indexLatestByCase_(getSheetRecords_('Partner_Log'), 'updated_at');

  const handoffReadyCount = Object.keys(latestHandoffs).filter(function(caseId) {
    return ['Ready to send', 'Sent'].indexOf(sanitizeText_(latestHandoffs[caseId].handoff_ready)) !== -1;
  }).length;

  const consentPendingCount = Object.keys(latestHandoffs).filter(function(caseId) {
    return ['Pending discussion', 'Emergency exception only'].indexOf(sanitizeText_(latestHandoffs[caseId].consent_status)) !== -1;
  }).length;

  const openPartnerLoops = Object.keys(latestPartnerLogs).filter(function(caseId) {
    return ['Draft', 'Requested', 'Accepted', 'In progress'].indexOf(sanitizeText_(latestPartnerLogs[caseId].contact_status)) !== -1;
  }).length;

  return {
    totalCases: cases.length,
    handoffsReady: handoffReadyCount,
    consentPending: consentPendingCount,
    openPartnerLoops: openPartnerLoops
  };
}

function getLatestHandoffCards_() {
  const latestHandoffs = indexLatestByCase_(getSheetRecords_('Handoffs'), 'updated_at');
  return Object.keys(latestHandoffs).map(function(caseId) {
    const record = latestHandoffs[caseId];
    return {
      caseId: caseId,
      patientCode: sanitizeText_(record.patient_code),
      reviewedBy: sanitizeText_(record.reviewed_by),
      handoffReady: sanitizeText_(record.handoff_ready),
      consentStatus: sanitizeText_(record.consent_status),
      receivingSector: sanitizeText_(record.receiving_sector),
      summary: sanitizeText_(record.minimum_necessary_summary),
      updatedAtRaw: record.updated_at,
      updatedAt: formatDateTime_(record.updated_at)
    };
  }).sort(function(left, right) {
    return toComparableDate_(right.updatedAtRaw) - toComparableDate_(left.updatedAtRaw);
  }).map(function(card) {
    delete card.updatedAtRaw;
    return card;
  });
}

function getCaseOptions_() {
  return getSheetRecords_('Cases').sort(function(left, right) {
    return toComparableDate_(right.created_at) - toComparableDate_(left.created_at);
  }).map(function(record) {
    return {
      value: sanitizeText_(record.case_id),
      patientCode: sanitizeText_(record.patient_code),
      label: sanitizeText_(record.patient_code) + ' - ' + sanitizeText_(record.case_id) + ' - ' + sanitizeText_(record.case_label)
    };
  });
}

function findPatientCodeByCaseId_(caseId) {
  const match = getSheetRecords_('Cases').find(function(record) {
    return sanitizeText_(record.case_id) === caseId;
  });
  return match ? sanitizeText_(match.patient_code) : '';
}

function getSpreadsheet_() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error('No active spreadsheet found. Bind this project to a Google Sheet or set SPREADSHEET_ID in Code.gs.');
  }
  return spreadsheet;
}

function getSheet_(sheetName) {
  return getSpreadsheet_().getSheetByName(sheetName);
}

function getSheetRecords_(sheetName) {
  const sheet = getSheet_(sheetName);
  if (!sheet) {
    return [];
  }
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) {
    return [];
  }
  const headers = values[0];
  return values.slice(1).filter(function(row) {
    return row.some(function(cell) {
      return hasValue_(cell);
    });
  }).map(function(row) {
    return headers.reduce(function(record, header, index) {
      record[header] = row[index];
      return record;
    }, {});
  });
}

function appendRecord_(sheetName, record) {
  const headers = SHEET_SCHEMAS[sheetName];
  const row = headers.map(function(header) {
    return record[header] === undefined ? '' : record[header];
  });
  getSheet_(sheetName).appendRow(row);
}

function ensureHeaderRow_(sheet, headers) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
}

function assertCaseExists_(caseId) {
  const exists = getSheetRecords_('Cases').some(function(record) {
    return sanitizeText_(record.case_id) === caseId;
  });
  if (!exists) {
    throw new Error('Selected case was not found. Please create the case first.');
  }
}

function indexLatestByCase_(records, timestampField) {
  return records.reduce(function(index, record) {
    const caseId = sanitizeText_(record.case_id);
    if (!caseId) {
      return index;
    }
    const current = index[caseId];
    if (!current || toComparableDate_(record[timestampField]) >= toComparableDate_(current[timestampField])) {
      index[caseId] = record;
    }
    return index;
  }, {});
}

function createCaseId_() {
  return 'CASE-' + Utilities.getUuid().slice(0, 8).toUpperCase();
}

function createPatientCode_() {
  return 'MH-' + Utilities.getUuid().slice(0, 4).toUpperCase();
}

function formatDateTime_(value) {
  if (!value) {
    return '';
  }
  const date = value instanceof Date ? value : new Date(value);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
}

function toComparableDate_(value) {
  if (!value) {
    return 0;
  }
  const date = value instanceof Date ? value : new Date(value);
  return date.getTime();
}

function sanitizeText_(value) {
  return value === undefined || value === null ? '' : String(value).trim();
}

function hasValue_(value) {
  return !(value === undefined || value === null || (typeof value === 'string' && value.trim() === ''));
}
