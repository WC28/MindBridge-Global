function savePatientRegistration_(payload) {
  const patientCode = sanitizeText_(payload.patient_code) || createPatientCode_();
  const patientPortalCode = sanitizeText_(payload.patient_portal_code) || createPortalCode_('PT');
  const familyPortalCode = sanitizeText_(payload.family_portal_code) || createPortalCode_('FAM');

  appendRecord_('Patient_Registration', {
    registered_at: new Date(),
    patient_code: patientCode,
    patient_label: sanitizeText_(payload.patient_label),
    contact_phone: sanitizeText_(payload.contact_phone),
    emergency_contact: sanitizeText_(payload.emergency_contact),
    caregiver_name: sanitizeText_(payload.caregiver_name),
    health_coverage: sanitizeText_(payload.health_coverage),
    reason_for_first_visit: sanitizeText_(payload.reason_for_first_visit),
    consent_acknowledged: sanitizeText_(payload.consent_acknowledged) || 'Yes',
    registration_source: sanitizeText_(payload.registration_source) || 'Self registration',
    patient_portal_code: patientPortalCode,
    family_portal_code: familyPortalCode
  });

  upsertPortalAccessRecord_('patient', patientCode, 'Patient ' + patientCode, patientPortalCode);
  upsertPortalAccessRecord_('family', patientCode, 'Family of ' + patientCode, familyPortalCode);

  return {
    success: true,
    patientCode: patientCode,
    generatedCodes: {
      patientCode: patientCode,
      patientPortalCode: patientPortalCode,
      familyPortalCode: familyPortalCode
    },
    message: 'Registration saved and portal codes generated.'
  };
}

function savePatientCheckin_(payload) {
  const hasIncomingPatientCode = !!sanitizeText_(payload.patient_code);
  const patientCode = sanitizeText_(payload.patient_code) || createPatientCode_();
  const caseId = sanitizeText_(payload.case_id) || findLatestCaseIdByPatientCode_(patientCode) || createCaseId_();
  const bprsScore = normalizeOptionalIntegerInRange_(payload.bprs_total_score, 18, 126, 'BPRS 18-item total score');
  const bprsInterpretation = interpretBPRS18Total_(bprsScore);
  const preparedPayload = mergeObjects_(payload, {
    patient_code: patientCode,
    bprs_total_score: bprsScore ? String(bprsScore) : '',
    bprs_interpretation: bprsInterpretation
  });
  const evaluation = evaluateRiskFlag_('Patient_Checkin', preparedPayload);
  const aiScreening = runAIAssistedScreening_('Patient_Checkin', preparedPayload, caseId, patientCode, evaluation);
  const mergedReasons = mergeScreeningReasons_(evaluation.reasons, aiScreening.aiReasons);
  const record = {
    created_at: new Date(),
    case_id: caseId,
    patient_code: patientCode,
    respondent_name: sanitizeText_(payload.respondent_name),
    informant_type: sanitizeText_(payload.informant_type),
    preferred_language: sanitizeText_(payload.preferred_language) || 'English',
    visit_date: parseDateValue_(payload.visit_date) || new Date(),
    main_concern: sanitizeText_(payload.main_concern),
    current_symptoms: sanitizeText_(payload.current_symptoms),
    chatbot_transcript: sanitizeText_(payload.chatbot_transcript),
    distress_level: sanitizeText_(payload.distress_level),
    bprs_total_score: bprsScore,
    bprs_interpretation: bprsInterpretation,
    safety_concern: sanitizeText_(payload.safety_concern),
    family_caregiver_support: sanitizeText_(payload.family_caregiver_support),
    barrier_to_care: sanitizeText_(payload.barrier_to_care),
    additional_notes: sanitizeText_(payload.additional_notes),
    risk_flag: aiScreening.priorityForReview,
    risk_reasons: mergedReasons.join(', '),
    visit_purpose: sanitizeText_(payload.visit_purpose),
    reason_for_visit: sanitizeText_(payload.reason_for_visit),
    appointment_code: sanitizeText_(payload.appointment_code),
    accompanying_person: sanitizeText_(payload.accompanying_person),
    payment_coverage: sanitizeText_(payload.payment_coverage),
    local_rule_flag: evaluation.flag,
    local_rule_reasons: evaluation.reasons.join(', '),
    ai_priority_flag: aiScreening.aiPriorityFlag,
    ai_confidence: aiScreening.aiConfidence,
    ai_reasons: aiScreening.aiReasons.join(', '),
    triage_destination: aiScreening.triageDestination,
    recommended_service: aiScreening.recommendedService,
    triage_urgency: aiScreening.triageUrgency,
    emergency_action: aiScreening.emergencyAction,
    self_help_guidance: aiScreening.selfHelpGuidance,
    mdt_focus: aiScreening.mdtFocus,
    community_support_signal: aiScreening.communitySupportSignal,
    follow_up_window: aiScreening.followUpWindow,
    priority_for_review: aiScreening.priorityForReview,
    ai_validation_status: aiScreening.validationStatus
  };
  appendRecord_('Patient_Checkin', record);
  syncCaseMasterFromRecord_('Patient_Checkin', record);
  appendTimelineEvent_('Patient_Checkin', record);

  let generatedCodes = null;
  if (!hasIncomingPatientCode) {
    const patientPortalCode = createPortalCode_('PT');
    const familyPortalCode = createPortalCode_('FAM');
    const displayName = sanitizeText_(payload.respondent_name) || ('Patient ' + patientCode);
    upsertPortalAccessRecord_('patient', patientCode, displayName, patientPortalCode);
    upsertPortalAccessRecord_('family', patientCode, 'Family of ' + patientCode, familyPortalCode);
    generatedCodes = {
      patientCode: patientCode,
      patientPortalCode: patientPortalCode,
      familyPortalCode: familyPortalCode
    };
  }

  const alertResult = queueAlertForRecord_('Patient check-in', record);
  return {
    success: true,
    caseId: caseId,
    patientCode: patientCode,
    riskFlag: aiScreening.priorityForReview,
    riskReasons: mergedReasons,
    localRuleFlag: evaluation.flag,
    aiScreening: toClientAIScreening_(aiScreening),
    bprsScore: bprsScore ? String(bprsScore) : '',
    bprsInterpretation: bprsInterpretation,
    generatedCodes: generatedCodes,
    alertQueued: alertResult.queued,
    queuePriority: alertResult.priority,
    telegramStatus: alertResult.telegramStatus,
    message: alertResult.message
  };
}

function saveServiceFollowup_(payload) {
  const caseId = sanitizeText_(payload.case_id) || findLatestCaseIdByPatientCode_(payload.patient_code) || createCaseId_();
  const evaluation = evaluateRiskFlag_('Service_Followup', payload);
  const aiScreening = runAIAssistedScreening_('Service_Followup', payload, caseId, sanitizeText_(payload.patient_code), evaluation);
  const mergedReasons = mergeScreeningReasons_(evaluation.reasons, aiScreening.aiReasons);
  const record = {
    requested_at: new Date(),
    case_id: caseId,
    patient_code: sanitizeText_(payload.patient_code),
    requester_type: sanitizeText_(payload.requester_type),
    service_type: sanitizeText_(payload.service_type),
    appointment_code: sanitizeText_(payload.appointment_code),
    medication_need: sanitizeText_(payload.medication_need),
    current_symptoms: sanitizeText_(payload.current_symptoms),
    main_concern: sanitizeText_(payload.main_concern),
    caregiver_concern: sanitizeText_(payload.caregiver_concern),
    social_problem: sanitizeText_(payload.social_problem),
    payment_coverage: sanitizeText_(payload.payment_coverage),
    today_support_needed: sanitizeText_(payload.today_support_needed),
    urgency_level: sanitizeText_(payload.urgency_level),
    risk_flag: aiScreening.priorityForReview,
    risk_reasons: mergedReasons.join(', '),
    local_rule_flag: evaluation.flag,
    local_rule_reasons: evaluation.reasons.join(', '),
    ai_priority_flag: aiScreening.aiPriorityFlag,
    ai_confidence: aiScreening.aiConfidence,
    ai_reasons: aiScreening.aiReasons.join(', '),
    priority_for_review: aiScreening.priorityForReview,
    ai_validation_status: aiScreening.validationStatus
  };
  appendRecord_('Service_Followup', record);
  syncCaseMasterFromRecord_('Service_Followup', record);
  appendTimelineEvent_('Service_Followup', record);

  const alertResult = queueAlertForRecord_('Service follow-up', record);
  return {
    success: true,
    caseId: caseId,
    riskFlag: aiScreening.priorityForReview,
    riskReasons: mergedReasons,
    localRuleFlag: evaluation.flag,
    aiScreening: toClientAIScreening_(aiScreening),
    alertQueued: alertResult.queued,
    queuePriority: alertResult.priority,
    telegramStatus: alertResult.telegramStatus,
    message: alertResult.message
  };
}

function saveCommunityReferral_(payload) {
  const caseId = sanitizeText_(payload.case_id) || findLatestCaseIdByPatientCode_(payload.patient_code) || createCaseId_();
  const evaluation = evaluateRiskFlag_('Community_Referral', payload);
  const aiScreening = runAIAssistedScreening_('Community_Referral', payload, caseId, sanitizeText_(payload.patient_code), evaluation);
  const mergedReasons = mergeScreeningReasons_(evaluation.reasons, aiScreening.aiReasons);
  const record = {
    referred_at: new Date(),
    case_id: caseId,
    patient_code: sanitizeText_(payload.patient_code),
    informant_name: sanitizeText_(payload.informant_name),
    relationship_to_patient: sanitizeText_(payload.relationship_to_patient),
    contact_phone: sanitizeText_(payload.contact_phone),
    visit_purpose: sanitizeText_(payload.visit_purpose),
    reason_for_referral: sanitizeText_(payload.reason_for_referral),
    observed_behavior: sanitizeText_(payload.observed_behavior),
    main_concern: sanitizeText_(payload.main_concern),
    current_symptoms: sanitizeText_(payload.current_symptoms),
    safety_concern: sanitizeText_(payload.safety_concern),
    family_caregiver_support: sanitizeText_(payload.family_caregiver_support),
    barrier_to_care: sanitizeText_(payload.barrier_to_care),
    additional_notes: sanitizeText_(payload.additional_notes),
    risk_flag: aiScreening.priorityForReview,
    risk_reasons: mergedReasons.join(', '),
    local_rule_flag: evaluation.flag,
    local_rule_reasons: evaluation.reasons.join(', '),
    ai_priority_flag: aiScreening.aiPriorityFlag,
    ai_confidence: aiScreening.aiConfidence,
    ai_reasons: aiScreening.aiReasons.join(', '),
    priority_for_review: aiScreening.priorityForReview,
    ai_validation_status: aiScreening.validationStatus
  };
  appendRecord_('Community_Referral', record);
  syncCaseMasterFromRecord_('Community_Referral', record);
  appendTimelineEvent_('Community_Referral', record);

  const alertResult = queueAlertForRecord_('Community referral', record);
  return {
    success: true,
    caseId: caseId,
    riskFlag: aiScreening.priorityForReview,
    riskReasons: mergedReasons,
    localRuleFlag: evaluation.flag,
    aiScreening: toClientAIScreening_(aiScreening),
    alertQueued: alertResult.queued,
    queuePriority: alertResult.priority,
    telegramStatus: alertResult.telegramStatus,
    message: alertResult.message
  };
}

function saveClinicalReview_(payload) {
  const caseId = requireCaseId_(payload);
  const evaluation = evaluateRiskFlag_('Clinical_Review', payload);
  const bprsScore = normalizeOptionalIntegerInRange_(payload.bprs_total_score, 18, 126, 'BPRS 18-item total score');
  const bprsInterpretation = interpretBPRS18Total_(bprsScore);
  appendRecord_('Clinical_Review', {
    reviewed_at: new Date(),
    case_id: caseId,
    reviewer_name: sanitizeText_(payload.reviewer_name),
    diagnosis_group: sanitizeText_(payload.diagnosis_group),
    bprs_total_score: bprsScore,
    bprs_interpretation: bprsInterpretation,
    medication_adherence: sanitizeText_(payload.medication_adherence),
    relapse_warning_signs: sanitizeText_(payload.relapse_warning_signs),
    suicide_self_harm_concern: sanitizeText_(payload.suicide_self_harm_concern),
    violence_risk: sanitizeText_(payload.violence_risk),
    substance_use_concern: sanitizeText_(payload.substance_use_concern),
    clinical_notes: sanitizeText_(payload.clinical_notes),
    risk_flag: evaluation.flag,
    risk_reasons: evaluation.reasons.join(', ')
  });
  const savedRecord = indexLatestByCase_(getSheetRecords_('Clinical_Review'), 'reviewed_at')[caseId];
  syncCaseMasterFromRecord_('Clinical_Review', savedRecord);
  appendTimelineEvent_('Clinical_Review', savedRecord);

  return {
    success: true,
    caseId: caseId,
    riskFlag: evaluation.flag,
    riskReasons: evaluation.reasons,
    bprsScore: bprsScore ? String(bprsScore) : '',
    bprsInterpretation: bprsInterpretation,
    message: 'Clinical review saved.'
  };
}

function savePsychologicalReview_(payload) {
  const caseId = requireCaseId_(payload);
  const evaluation = evaluateRiskFlag_('Psychological_Review', payload);
  appendRecord_('Psychological_Review', {
    reviewed_at: new Date(),
    case_id: caseId,
    reviewer_name: sanitizeText_(payload.reviewer_name),
    stress_level: sanitizeText_(payload.stress_level),
    coping_ability: sanitizeText_(payload.coping_ability),
    trauma_grief_concern: sanitizeText_(payload.trauma_grief_concern),
    therapy_need: sanitizeText_(payload.therapy_need),
    sleep_problem: sanitizeText_(payload.sleep_problem),
    emotional_regulation: sanitizeText_(payload.emotional_regulation),
    psychological_notes: sanitizeText_(payload.psychological_notes),
    risk_flag: evaluation.flag,
    risk_reasons: evaluation.reasons.join(', ')
  });
  const savedRecord = indexLatestByCase_(getSheetRecords_('Psychological_Review'), 'reviewed_at')[caseId];
  syncCaseMasterFromRecord_('Psychological_Review', savedRecord);
  appendTimelineEvent_('Psychological_Review', savedRecord);

  return {
    success: true,
    caseId: caseId,
    riskFlag: evaluation.flag,
    riskReasons: evaluation.reasons,
    message: 'Psychological review saved.'
  };
}

function savePsychosocialReview_(payload) {
  const caseId = requireCaseId_(payload);
  const evaluation = evaluateRiskFlag_('Psychosocial_Review', payload);
  appendRecord_('Psychosocial_Review', {
    reviewed_at: new Date(),
    case_id: caseId,
    reviewer_name: sanitizeText_(payload.reviewer_name),
    family_conflict: sanitizeText_(payload.family_conflict),
    debt_financial_stress: sanitizeText_(payload.debt_financial_stress),
    housing_problem: sanitizeText_(payload.housing_problem),
    caregiver_support: sanitizeText_(payload.caregiver_support),
    welfare_need: sanitizeText_(payload.welfare_need),
    stigma: sanitizeText_(payload.stigma),
    violence_abuse: sanitizeText_(payload.violence_abuse),
    community_support: sanitizeText_(payload.community_support),
    psychosocial_notes: sanitizeText_(payload.psychosocial_notes),
    risk_flag: evaluation.flag,
    risk_reasons: evaluation.reasons.join(', ')
  });
  const savedRecord = indexLatestByCase_(getSheetRecords_('Psychosocial_Review'), 'reviewed_at')[caseId];
  syncCaseMasterFromRecord_('Psychosocial_Review', savedRecord);
  appendTimelineEvent_('Psychosocial_Review', savedRecord);

  return {
    success: true,
    caseId: caseId,
    riskFlag: evaluation.flag,
    riskReasons: evaluation.reasons,
    message: 'Psychosocial review saved.'
  };
}

function saveMDTCarePlan_(payload) {
  const caseId = requireCaseId_(payload);
  const overallRiskFlag = getCurrentOverallRisk_(caseId);
  appendRecord_('MDT_Care_Plan', {
    updated_at: new Date(),
    case_id: caseId,
    meeting_date: parseDateValue_(payload.meeting_date),
    main_care_goal: sanitizeText_(payload.main_care_goal),
    clinical_plan: sanitizeText_(payload.clinical_plan),
    psychological_plan: sanitizeText_(payload.psychological_plan),
    social_intervention_plan: sanitizeText_(payload.social_intervention_plan),
    rehabilitation_plan: sanitizeText_(payload.rehabilitation_plan),
    referral_plan: sanitizeText_(payload.referral_plan),
    discharge_readiness: sanitizeText_(payload.discharge_readiness),
    team_members: sanitizeText_(payload.team_members),
    overall_risk_flag: overallRiskFlag
  });
  const savedRecord = indexLatestByCase_(getSheetRecords_('MDT_Care_Plan'), 'updated_at')[caseId];
  syncCaseMasterFromRecord_('MDT_Care_Plan', savedRecord);
  appendTimelineEvent_('MDT_Care_Plan', savedRecord);

  return {
    success: true,
    caseId: caseId,
    riskFlag: overallRiskFlag,
    riskReasons: [],
    message: 'MDT care plan saved.'
  };
}

function saveMinimumNecessaryHandoff_(payload) {
  const caseId = requireCaseId_(payload);
  appendRecord_('Minimum_Necessary_Handoff', {
    updated_at: new Date(),
    case_id: caseId,
    reviewed_by: sanitizeText_(payload.reviewed_by),
    consent_status: sanitizeText_(payload.consent_status),
    caregiver_involvement: sanitizeText_(payload.caregiver_involvement),
    public_sector_share: sanitizeText_(payload.public_sector_share),
    private_partner_share: sanitizeText_(payload.private_partner_share),
    community_follow_up_share: sanitizeText_(payload.community_follow_up_share),
    handoff_ready: sanitizeText_(payload.handoff_ready) || 'Draft',
    next_step_owner: sanitizeText_(payload.next_step_owner),
    next_contact_window: sanitizeText_(payload.next_contact_window),
    minimum_necessary_summary: sanitizeText_(payload.minimum_necessary_summary),
    crisis_safety_summary: sanitizeText_(payload.crisis_safety_summary),
    do_not_share: sanitizeText_(payload.do_not_share)
  });
  const savedRecord = indexLatestByCase_(getSheetRecords_('Minimum_Necessary_Handoff'), 'updated_at')[caseId];
  syncCaseMasterFromRecord_('Minimum_Necessary_Handoff', savedRecord);
  appendTimelineEvent_('Minimum_Necessary_Handoff', savedRecord);

  return {
    success: true,
    caseId: caseId,
    message: 'Safe handoff summary saved.'
  };
}

function savePublicCoordination_(payload) {
  const caseId = requireCaseId_(payload);
  appendRecord_('Public_Coordination', {
    updated_at: new Date(),
    case_id: caseId,
    agency_name: sanitizeText_(payload.agency_name),
    coordination_type: sanitizeText_(payload.coordination_type),
    urgency_level: sanitizeText_(payload.urgency_level),
    referral_reason: sanitizeText_(payload.referral_reason),
    shared_information: sanitizeText_(payload.shared_information),
    requested_action: sanitizeText_(payload.requested_action),
    meeting_date: parseDateValue_(payload.meeting_date),
    coordination_status: sanitizeText_(payload.coordination_status) || 'Requested',
    notes: sanitizeText_(payload.notes)
  });
  const savedRecord = indexLatestByCase_(getSheetRecords_('Public_Coordination'), 'updated_at')[caseId];
  syncCaseMasterFromRecord_('Public_Coordination', savedRecord);
  appendTimelineEvent_('Public_Coordination', savedRecord);

  return {
    success: true,
    caseId: caseId,
    message: 'Public sector coordination update saved.'
  };
}

function savePrivateCoordination_(payload) {
  const caseId = requireCaseId_(payload);
  appendRecord_('Private_Coordination', {
    updated_at: new Date(),
    case_id: caseId,
    organization_name: sanitizeText_(payload.organization_name),
    support_domain: sanitizeText_(payload.support_domain),
    urgency_level: sanitizeText_(payload.urgency_level),
    referral_reason: sanitizeText_(payload.referral_reason),
    support_needs: sanitizeText_(payload.support_needs),
    requested_action: sanitizeText_(payload.requested_action),
    meeting_date: parseDateValue_(payload.meeting_date),
    coordination_status: sanitizeText_(payload.coordination_status) || 'Requested',
    notes: sanitizeText_(payload.notes)
  });
  const savedRecord = indexLatestByCase_(getSheetRecords_('Private_Coordination'), 'updated_at')[caseId];
  syncCaseMasterFromRecord_('Private_Coordination', savedRecord);
  appendTimelineEvent_('Private_Coordination', savedRecord);

  return {
    success: true,
    caseId: caseId,
    message: 'Private / NGO coordination update saved.'
  };
}

function saveFollowUp_(payload) {
  const caseId = requireCaseId_(payload);
  const evaluation = evaluateRiskFlag_('Follow_Up', payload);
  appendRecord_('Follow_Up', {
    updated_at: new Date(),
    case_id: caseId,
    follow_up_due_date: parseDateValue_(payload.follow_up_due_date),
    responsible_staff: sanitizeText_(payload.responsible_staff),
    referral_destination: sanitizeText_(payload.referral_destination),
    follow_up_status: sanitizeText_(payload.follow_up_status),
    barrier_after_discharge: sanitizeText_(payload.barrier_after_discharge),
    outcome: sanitizeText_(payload.outcome),
    escalation_needed: sanitizeText_(payload.escalation_needed),
    follow_up_notes: sanitizeText_(payload.follow_up_notes),
    risk_flag: evaluation.flag,
    risk_reasons: evaluation.reasons.join(', ')
  });
  const savedRecord = indexLatestByCase_(getSheetRecords_('Follow_Up'), 'updated_at')[caseId];
  syncCaseMasterFromRecord_('Follow_Up', savedRecord);
  appendTimelineEvent_('Follow_Up', savedRecord);

  return {
    success: true,
    caseId: caseId,
    riskFlag: evaluation.flag,
    riskReasons: evaluation.reasons,
    message: 'Follow-up record saved.'
  };
}

