function ensurePrototypeSheets_() {
  const spreadsheet = getSpreadsheet_();
  Object.keys(SHEET_SCHEMAS).forEach(function(sheetName) {
    const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
    ensureHeaderRow_(sheet, SHEET_SCHEMAS[sheetName]);
  });
  seedUsers_();
  seedPortalAccess_();
  syncPortalAccessFromRegistrations_();
  backfillCaseSpine_();
}

function seedUsers_() {
  upsertSeedRows_('Users', [
    {
      email: 'doctor@example.org',
      display_name: 'Doctor Demo',
      role: 'Clinician',
      profession: 'Psychiatrist',
      active: 'Yes',
      login_username: 'doctor',
      login_password: 'demo123',
      allowed_portal: 'staff',
      organization: 'Mental Health Hospital'
    },
    {
      email: 'nurse@example.org',
      display_name: 'Nurse Demo',
      role: 'Clinician',
      profession: 'Psychiatric Nurse',
      active: 'Yes',
      login_username: 'nurse',
      login_password: 'demo123',
      allowed_portal: 'staff',
      organization: 'Mental Health Hospital'
    },
    {
      email: 'psychologist@example.org',
      display_name: 'Psychologist Demo',
      role: 'Allied Health',
      profession: 'Psychologist',
      active: 'Yes',
      login_username: 'psychologist',
      login_password: 'demo123',
      allowed_portal: 'staff',
      organization: 'Mental Health Hospital'
    },
    {
      email: 'socialworker@example.org',
      display_name: 'Social Worker Demo',
      role: 'Allied Health',
      profession: 'Psychiatric Social Worker',
      active: 'Yes',
      login_username: 'socialworker',
      login_password: 'demo123',
      allowed_portal: 'staff',
      organization: 'Mental Health Hospital'
    },
    {
      email: 'ot@example.org',
      display_name: 'OT Demo',
      role: 'Allied Health',
      profession: 'Occupational Therapist',
      active: 'Yes',
      login_username: 'ot',
      login_password: 'demo123',
      allowed_portal: 'staff',
      organization: 'Mental Health Hospital'
    },
    {
      email: 'community@example.org',
      display_name: 'Village Health Volunteer',
      role: 'Community',
      profession: 'Community volunteer',
      active: 'Yes',
      login_username: 'community',
      login_password: 'demo123',
      allowed_portal: 'community',
      organization: 'Ban Klang Community'
    },
    {
      email: 'public@example.org',
      display_name: 'District Health Office Liaison',
      role: 'Public sector',
      profession: 'Public health officer',
      active: 'Yes',
      login_username: 'publicsector',
      login_password: 'demo123',
      allowed_portal: 'public',
      organization: 'District Health Office'
    },
    {
      email: 'private@example.org',
      display_name: 'NGO Partner',
      role: 'Private / NGO',
      profession: 'Case coordinator',
      active: 'Yes',
      login_username: 'ngo',
      login_password: 'demo123',
      allowed_portal: 'private',
      organization: 'Hope Foundation'
    }
  ], ['login_username']);
}

function seedPortalAccess_() {
  upsertPortalAccessRecord_('patient', 'MH-001', 'Patient MH-001', 'PT001');
  upsertPortalAccessRecord_('family', 'MH-001', 'Family of MH-001', 'FAM001');
  upsertPortalAccessRecord_('patient', 'MH-002', 'Patient MH-002', 'PT002');
  upsertPortalAccessRecord_('family', 'MH-002', 'Family of MH-002', 'FAM002');
  upsertPortalAccessRecord_('patient', 'MH-003', 'Patient MH-003', 'PT003');
  upsertPortalAccessRecord_('family', 'MH-003', 'Family of MH-003', 'FAM003');
}

function syncPortalAccessFromRegistrations_() {
  getSheetRecords_('Patient_Registration').forEach(function(record) {
    const patientCode = sanitizeText_(record.patient_code);
    if (!patientCode) {
      return;
    }
    if (sanitizeText_(record.patient_portal_code)) {
      upsertPortalAccessRecord_('patient', patientCode, 'Patient ' + patientCode, record.patient_portal_code);
    }
    if (sanitizeText_(record.family_portal_code)) {
      upsertPortalAccessRecord_('family', patientCode, 'Family of ' + patientCode, record.family_portal_code);
    }
  });
}

function upsertPortalAccessRecord_(portalType, patientCode, displayName, accessCode) {
  upsertSeedRows_('Portal_Access', [{
    portal_type: portalType,
    patient_code: patientCode,
    display_name: displayName,
    access_code: accessCode,
    active: 'Yes'
  }], ['portal_type', 'patient_code']);
}

function upsertSeedRows_(sheetName, seedRows, keys) {
  const sheet = getSheet_(sheetName);
  const headers = SHEET_SCHEMAS[sheetName];
  const records = getSheetRecords_(sheetName);

  seedRows.forEach(function(seedRow) {
    const existingIndex = records.findIndex(function(record) {
      return keys.every(function(key) {
        return sanitizeText_(record[key]).toLowerCase() === sanitizeText_(seedRow[key]).toLowerCase();
      });
    });

    if (existingIndex === -1) {
      appendRecord_(sheetName, seedRow);
      return;
    }

    const existingRecord = records[existingIndex];
    const mergedRow = headers.map(function(header) {
      if (seedRow[header] !== undefined && seedRow[header] !== null && seedRow[header] !== '') {
        return seedRow[header];
      }
      return existingRecord[header] === undefined ? '' : existingRecord[header];
    });
    sheet.getRange(existingIndex + 2, 1, 1, headers.length).setValues([mergedRow]);
  });
}

function ensureHeaderRow_(sheet, headers) {
  const currentHeaders = sheet.getLastColumn() > 0
    ? sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getValues()[0]
    : [];
  const needsUpdate = headers.some(function(header, index) {
    return currentHeaders[index] !== header;
  }) || currentHeaders.length !== headers.length;

  if (needsUpdate) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
}

function appendRecord_(sheetName, record) {
  const headers = SHEET_SCHEMAS[sheetName];
  const row = headers.map(function(header) {
    return record[header] === undefined ? '' : record[header];
  });
  getSheet_(sheetName).appendRow(row);
}

function upsertRowByKeys_(sheetName, record, keys) {
  const sheet = getSheet_(sheetName);
  const headers = SHEET_SCHEMAS[sheetName];
  const records = getSheetRecords_(sheetName);
  const existingIndex = records.findIndex(function(existingRecord) {
    return keys.every(function(key) {
      return sanitizeText_(existingRecord[key]).toLowerCase() === sanitizeText_(record[key]).toLowerCase();
    });
  });
  const row = headers.map(function(header) {
    return record[header] === undefined ? '' : record[header];
  });

  if (existingIndex === -1) {
    sheet.appendRow(row);
    return;
  }

  sheet.getRange(existingIndex + 2, 1, 1, headers.length).setValues([row]);
}

function backfillCaseSpine_() {
  if (getSheetRecords_('Cases_Master').length > 0 || getSheetRecords_('Case_Timeline').length > 0) {
    return;
  }

  [
    ['Patient_Checkin', 'created_at'],
    ['Service_Followup', 'requested_at'],
    ['Community_Referral', 'referred_at'],
    ['Clinical_Review', 'reviewed_at'],
    ['Psychological_Review', 'reviewed_at'],
    ['Psychosocial_Review', 'reviewed_at'],
    ['MDT_Care_Plan', 'updated_at'],
    ['Minimum_Necessary_Handoff', 'updated_at'],
    ['Public_Coordination', 'updated_at'],
    ['Private_Coordination', 'updated_at'],
    ['Follow_Up', 'updated_at']
  ].forEach(function(pair) {
    const sheetName = pair[0];
    const timestampField = pair[1];
    getSheetRecords_(sheetName).sort(function(left, right) {
      return toComparableDate_(left[timestampField]) - toComparableDate_(right[timestampField]);
    }).forEach(function(record) {
      syncCaseMasterFromRecord_(sheetName, record);
      appendTimelineEvent_(sheetName, record);
    });
  });
}

function syncCaseMasterFromRecord_(formKey, record) {
  const caseId = sanitizeText_(record.case_id);
  if (!caseId) {
    return;
  }

  const existing = getSheetRecords_('Cases_Master').find(function(item) {
    return sanitizeText_(item.case_id) === caseId;
  }) || {};
  const priorityFlag = firstNonEmpty_(
    record.priority_for_review,
    record.risk_flag,
    record.overall_risk_flag,
    existing.priority_flag,
    'Green'
  );
  const queuePriority = firstNonEmpty_(
    record.queue_priority,
    shouldEvaluateQueuePriority_(formKey) ? determineQueuePriority_(record) : '',
    existing.queue_priority,
    priorityFlag === 'Red' ? 'Immediate' : priorityFlag === 'Orange' ? 'Priority' : 'Routine'
  );
  const networkStatus = firstNonEmpty_(
    record.coordination_status,
    existing.network_status,
    'Not started'
  );
  const followUpStatus = firstNonEmpty_(
    record.follow_up_status,
    existing.follow_up_status,
    'Not started'
  );
  const handoffStatus = firstNonEmpty_(
    record.handoff_ready,
    existing.handoff_status,
    'Not started'
  );
  const consentStatus = firstNonEmpty_(
    record.consent_status,
    existing.consent_status,
    'Not recorded'
  );

  upsertRowByKeys_('Cases_Master', {
    case_id: caseId,
    patient_code: firstNonEmpty_(record.patient_code, existing.patient_code, caseId),
    entry_point: firstNonEmpty_(deriveEntryPoint_(formKey, record), existing.entry_point, 'Direct intake'),
    entry_label: firstNonEmpty_(deriveEntryLabel_(formKey, record), existing.entry_label, 'Case opened'),
    current_stage: getCaseStageLabel_(formKey),
    journey_status: getJourneyStatusLabel_(formKey),
    priority_flag: priorityFlag,
    queue_priority: queuePriority,
    last_touchpoint_at: firstNonEmpty_(
      record.created_at,
      record.requested_at,
      record.referred_at,
      record.reviewed_at,
      record.updated_at,
      existing.last_touchpoint_at,
      new Date()
    ),
    last_touchpoint_type: getTimelineEventType_(formKey),
    owner_team: firstNonEmpty_(deriveOwnerFromRecord_(formKey, record), existing.owner_team, 'Care coordination'),
    network_status: networkStatus,
    follow_up_status: followUpStatus,
    handoff_status: handoffStatus,
    consent_status: consentStatus,
    next_action: deriveNextAction_(formKey, record, priorityFlag),
    latest_summary: firstNonEmpty_(deriveRecordSummary_(formKey, record), existing.latest_summary, 'Case activity updated')
  }, ['case_id']);
}

function appendTimelineEvent_(formKey, record) {
  const caseId = sanitizeText_(record.case_id);
  if (!caseId) {
    return;
  }

  appendRecord_('Case_Timeline', {
    event_at: firstNonEmpty_(
      record.created_at,
      record.requested_at,
      record.referred_at,
      record.reviewed_at,
      record.updated_at,
      new Date()
    ),
    case_id: caseId,
    patient_code: sanitizeText_(record.patient_code),
    event_type: getTimelineEventType_(formKey),
    stage: getCaseStageLabel_(formKey),
    actor: deriveOwnerFromRecord_(formKey, record),
    summary: deriveRecordSummary_(formKey, record),
    risk_flag: firstNonEmpty_(record.priority_for_review, record.risk_flag, record.overall_risk_flag, 'Green'),
    queue_priority: firstNonEmpty_(
      record.queue_priority,
      shouldEvaluateQueuePriority_(formKey) ? determineQueuePriority_(record) : '',
      ''
    )
  });
}

function shouldEvaluateQueuePriority_(formKey) {
  return ['Patient_Checkin', 'Service_Followup', 'Community_Referral'].indexOf(formKey) !== -1;
}

function getCaseStageLabel_(formKey) {
  const labels = {
    Patient_Checkin: 'Unified Intake',
    Service_Followup: 'Same-Day Service',
    Community_Referral: 'Community Entry',
    Clinical_Review: 'Clinical Lens',
    Psychological_Review: 'Psychological Lens',
    Psychosocial_Review: 'Psychosocial Lens',
    MDT_Care_Plan: 'Shared Care Plan',
    Minimum_Necessary_Handoff: 'Safe Handoff Summary',
    Public_Coordination: 'Public Sector Coordination',
    Private_Coordination: 'Partner / NGO Coordination',
    Follow_Up: 'Continuity Follow-up'
  };
  return labels[formKey] || 'Case Activity';
}

function getJourneyStatusLabel_(formKey) {
  if (['Patient_Checkin', 'Service_Followup', 'Community_Referral'].indexOf(formKey) !== -1) {
    return 'Front Door';
  }
  if (['Clinical_Review', 'Psychological_Review', 'Psychosocial_Review'].indexOf(formKey) !== -1) {
    return 'Shared Review';
  }
  if (formKey === 'MDT_Care_Plan') {
    return 'Shared Plan';
  }
  if (formKey === 'Minimum_Necessary_Handoff') {
    return 'Shared Plan';
  }
  if (['Public_Coordination', 'Private_Coordination'].indexOf(formKey) !== -1) {
    return 'Network Coordination';
  }
  if (formKey === 'Follow_Up') {
    return 'Continuity';
  }
  return 'Case Activity';
}

function getTimelineEventType_(formKey) {
  const labels = {
    Patient_Checkin: 'Check-in submitted',
    Service_Followup: 'Service request logged',
    Community_Referral: 'Community referral received',
    Clinical_Review: 'Clinical review updated',
    Psychological_Review: 'Psychological review updated',
    Psychosocial_Review: 'Psychosocial review updated',
    MDT_Care_Plan: 'Shared care plan updated',
    Minimum_Necessary_Handoff: 'Minimum necessary handoff updated',
    Public_Coordination: 'Public coordination updated',
    Private_Coordination: 'Partner coordination updated',
    Follow_Up: 'Continuity follow-up updated'
  };
  return labels[formKey] || 'Case updated';
}

function deriveEntryPoint_(formKey, record) {
  if (formKey === 'Patient_Checkin') {
    return firstNonEmpty_(record.visit_purpose, 'Patient / family intake');
  }
  if (formKey === 'Service_Followup') {
    return firstNonEmpty_(record.service_type, 'Service follow-up');
  }
  if (formKey === 'Community_Referral') {
    return 'Community referral';
  }
  return '';
}

function deriveEntryLabel_(formKey, record) {
  if (formKey === 'Patient_Checkin') {
    return firstNonEmpty_(record.reason_for_visit, record.visit_purpose, 'Intake opened');
  }
  if (formKey === 'Service_Followup') {
    return firstNonEmpty_(record.service_type, 'Support request');
  }
  if (formKey === 'Community_Referral') {
    return firstNonEmpty_(record.reason_for_referral, 'Community concern submitted');
  }
  return '';
}

function deriveOwnerFromRecord_(formKey, record) {
  return firstNonEmpty_(
    record.reviewer_name,
    record.reviewed_by,
    record.responsible_staff,
    record.next_step_owner,
    record.agency_name,
    record.organization_name,
    record.informant_name,
    record.informant_type,
    record.requester_type,
    getCaseStageLabel_(formKey)
  );
}

function deriveNextAction_(formKey, record, priorityFlag) {
  if (priorityFlag === 'Red') {
    return 'Escalate for urgent multidisciplinary response';
  }
  const nextActions = {
    Patient_Checkin: 'Route into shared review and confirm first responder',
    Service_Followup: 'Confirm same-day response, medication, or appointment action',
    Community_Referral: 'Verify outreach plan and intake ownership',
    Clinical_Review: 'Complete additional lenses and align treatment response',
    Psychological_Review: 'Update shared plan with psychological priorities',
    Psychosocial_Review: 'Coordinate social interventions and welfare supports',
    MDT_Care_Plan: 'Close the loop with referrals and continuity tasks',
    Minimum_Necessary_Handoff: matchesAny_(record.handoff_ready, ['Sent'])
      ? 'Track partner acceptance and continuity delivery'
      : 'Confirm consent boundary and send minimum necessary summary',
    Public_Coordination: 'Confirm partner acceptance and agreed next step',
    Private_Coordination: 'Confirm external support acceptance and delivery date',
    Follow_Up: matchesAny_(record.follow_up_status, ['Completed'])
      ? 'Monitor continuity and reopen only if new risks emerge'
      : 'Track outreach completion and barrier resolution'
  };
  return nextActions[formKey] || 'Continue coordinated case review';
}

function deriveRecordSummary_(formKey, record) {
  const summary = firstNonEmpty_(
    record.main_concern,
    record.reason_for_referral,
    record.current_symptoms,
    record.clinical_notes,
    record.psychological_notes,
    record.psychosocial_notes,
    record.minimum_necessary_summary,
    record.crisis_safety_summary,
    record.referral_reason,
    record.support_needs,
    record.requested_action,
    record.outcome,
    record.follow_up_notes
  );
  return firstNonEmpty_(truncateText_(summary, 180), getTimelineEventType_(formKey));
}

