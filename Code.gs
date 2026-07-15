const APP_TITLE = 'MindBridge Global';
const APP_SUBTITLE = 'Phase 1 prototype for an integrated AI-powered global mental health ecosystem';
const SPREADSHEET_LINK_OR_ID = 'https://docs.google.com/spreadsheets/d/1ZtYIof8z94Nf8BtKO2iTF5NM-pob5WS5xtk1fMtf0RE/edit?gid=0#gid=0';
const SESSION_TTL_SECONDS = 21600;
const TELEGRAM_NOTIFICATIONS_ENABLED = false;
const TELEGRAM_BOT_TOKEN = '';
const TELEGRAM_CHAT_ID = '';
const AI_ASSIST_ENABLED = true;
const AI_PROVIDER = 'openai';
const AI_MODEL = 'gpt-4.1';
const AI_API_KEY_PROPERTY = 'OPENAI_API_KEY';

const SHEET_SCHEMAS = {
  Patient_Registration: [
    'registered_at',
    'patient_code',
    'patient_label',
    'contact_phone',
    'emergency_contact',
    'caregiver_name',
    'health_coverage',
    'reason_for_first_visit',
    'consent_acknowledged',
    'registration_source',
    'patient_portal_code',
    'family_portal_code'
  ],
  Patient_Checkin: [
    'created_at',
    'case_id',
    'patient_code',
    'respondent_name',
    'informant_type',
    'preferred_language',
    'visit_date',
    'main_concern',
    'current_symptoms',
    'chatbot_transcript',
    'distress_level',
    'bprs_total_score',
    'bprs_interpretation',
    'safety_concern',
    'family_caregiver_support',
    'barrier_to_care',
    'additional_notes',
    'risk_flag',
    'risk_reasons',
    'visit_purpose',
    'reason_for_visit',
    'appointment_code',
    'accompanying_person',
    'payment_coverage',
    'local_rule_flag',
    'local_rule_reasons',
    'ai_priority_flag',
    'ai_confidence',
    'ai_reasons',
    'triage_destination',
    'recommended_service',
    'triage_urgency',
    'emergency_action',
    'self_help_guidance',
    'mdt_focus',
    'community_support_signal',
    'follow_up_window',
    'priority_for_review',
    'ai_validation_status'
  ],
  Service_Followup: [
    'requested_at',
    'case_id',
    'patient_code',
    'requester_type',
    'service_type',
    'appointment_code',
    'medication_need',
    'current_symptoms',
    'main_concern',
    'caregiver_concern',
    'social_problem',
    'payment_coverage',
    'today_support_needed',
    'urgency_level',
    'risk_flag',
    'risk_reasons',
    'local_rule_flag',
    'local_rule_reasons',
    'ai_priority_flag',
    'ai_confidence',
    'ai_reasons',
    'priority_for_review',
    'ai_validation_status'
  ],
  Community_Referral: [
    'referred_at',
    'case_id',
    'patient_code',
    'informant_name',
    'relationship_to_patient',
    'contact_phone',
    'visit_purpose',
    'reason_for_referral',
    'observed_behavior',
    'main_concern',
    'current_symptoms',
    'safety_concern',
    'family_caregiver_support',
    'barrier_to_care',
    'additional_notes',
    'risk_flag',
    'risk_reasons',
    'local_rule_flag',
    'local_rule_reasons',
    'ai_priority_flag',
    'ai_confidence',
    'ai_reasons',
    'priority_for_review',
    'ai_validation_status'
  ],
  Clinical_Review: [
    'reviewed_at',
    'case_id',
    'reviewer_name',
    'diagnosis_group',
    'bprs_total_score',
    'bprs_interpretation',
    'medication_adherence',
    'relapse_warning_signs',
    'suicide_self_harm_concern',
    'violence_risk',
    'substance_use_concern',
    'clinical_notes',
    'risk_flag',
    'risk_reasons'
  ],
  Psychological_Review: [
    'reviewed_at',
    'case_id',
    'reviewer_name',
    'stress_level',
    'coping_ability',
    'trauma_grief_concern',
    'therapy_need',
    'sleep_problem',
    'emotional_regulation',
    'psychological_notes',
    'risk_flag',
    'risk_reasons'
  ],
  Psychosocial_Review: [
    'reviewed_at',
    'case_id',
    'reviewer_name',
    'family_conflict',
    'debt_financial_stress',
    'housing_problem',
    'caregiver_support',
    'welfare_need',
    'stigma',
    'violence_abuse',
    'community_support',
    'psychosocial_notes',
    'risk_flag',
    'risk_reasons'
  ],
  MDT_Care_Plan: [
    'updated_at',
    'case_id',
    'meeting_date',
    'main_care_goal',
    'clinical_plan',
    'psychological_plan',
    'social_intervention_plan',
    'rehabilitation_plan',
    'referral_plan',
    'discharge_readiness',
    'team_members',
    'overall_risk_flag'
  ],
  Minimum_Necessary_Handoff: [
    'updated_at',
    'case_id',
    'reviewed_by',
    'consent_status',
    'caregiver_involvement',
    'public_sector_share',
    'private_partner_share',
    'community_follow_up_share',
    'handoff_ready',
    'next_step_owner',
    'next_contact_window',
    'minimum_necessary_summary',
    'crisis_safety_summary',
    'do_not_share'
  ],
  Public_Coordination: [
    'updated_at',
    'case_id',
    'agency_name',
    'coordination_type',
    'urgency_level',
    'referral_reason',
    'shared_information',
    'requested_action',
    'meeting_date',
    'coordination_status',
    'notes'
  ],
  Private_Coordination: [
    'updated_at',
    'case_id',
    'organization_name',
    'support_domain',
    'urgency_level',
    'referral_reason',
    'support_needs',
    'requested_action',
    'meeting_date',
    'coordination_status',
    'notes'
  ],
  Follow_Up: [
    'updated_at',
    'case_id',
    'follow_up_due_date',
    'responsible_staff',
    'referral_destination',
    'follow_up_status',
    'barrier_after_discharge',
    'outcome',
    'escalation_needed',
    'follow_up_notes',
    'risk_flag',
    'risk_reasons'
  ],
  Users: [
    'email',
    'display_name',
    'role',
    'profession',
    'active',
    'login_username',
    'login_password',
    'allowed_portal',
    'organization'
  ],
  Portal_Access: [
    'portal_type',
    'patient_code',
    'display_name',
    'access_code',
    'active'
  ],
  Alert_Queue: [
    'queued_at',
    'case_id',
    'patient_code',
    'informant_type',
    'visit_purpose',
    'queue_priority',
    'risk_flag',
    'triage_destination',
    'triage_urgency',
    'bprs_total_score',
    'bprs_interpretation',
    'summary',
    'telegram_status',
    'telegram_response',
    'handled_status'
  ],
  AI_Screening_Log: [
    'screened_at',
    'case_id',
    'patient_code',
    'source_form',
    'screening_status',
    'ai_provider',
    'ai_model',
    'local_rule_flag',
    'ai_priority_flag',
    'priority_for_review',
    'agreement_status',
    'ai_confidence',
    'human_review_required',
    'monitor_group',
    'bias_watch_status',
    'ai_summary',
    'ai_reasons',
    'triage_destination',
    'recommended_service',
    'triage_urgency',
    'emergency_action',
    'raw_output'
  ],
  Cases_Master: [
    'case_id',
    'patient_code',
    'entry_point',
    'entry_label',
    'current_stage',
    'journey_status',
    'priority_flag',
    'queue_priority',
    'last_touchpoint_at',
    'last_touchpoint_type',
    'owner_team',
    'network_status',
    'follow_up_status',
    'handoff_status',
    'consent_status',
    'next_action',
    'latest_summary'
  ],
  Case_Timeline: [
    'event_at',
    'case_id',
    'patient_code',
    'event_type',
    'stage',
    'actor',
    'summary',
    'risk_flag',
    'queue_priority'
  ],
  Dashboard: [
    'section',
    'metric',
    'value',
    'updated_at',
    'notes'
  ]
};

const OPTION_SETS = {
  registrationSource: ['Self registration', 'Staff-assisted registration', 'Caregiver-assisted registration'],
  consentOptions: ['Yes', 'Pending discussion'],
  informantType: ['Patient', 'Family/Caregiver', 'Staff'],
  requesterType: ['Patient', 'Family/Caregiver', 'Staff'],
  preferredLanguage: ['English', 'Thai', 'Chinese (Simplified)', 'Hindi', 'Urdu'],
  visitPurpose: ['Scheduled appointment (มาตามนัด)', 'Walk-in', 'ER urgent (ER ด่วน)', 'Referral', 'Community follow-up', 'Digital self-screening'],
  reasonForVisit: [
    'See psychiatrist / doctor',
    'Follow-up appointment',
    'Medication refill',
    'See psychologist',
    'See psychiatric social worker',
    'Vocational training / rehabilitation',
    'Group activity / therapy activity',
    'Welfare / legal support',
    'Self-screening / AI triage',
    'Other'
  ],
  paymentCoverage: ['Universal coverage', 'Social security', 'Civil servant benefit', 'Self-pay', 'Other'],
  medicationNeed: ['No medication issue', 'Need refill soon', 'Out of medication', 'Adherence concern'],
  serviceType: [
    'Appointment follow-up',
    'Medication refill',
    'Psychology visit',
    'Social work visit',
    'Rehabilitation / OT',
    'Group activity',
    'Home visit coordination',
    'Other'
  ],
  supportNeed: [
    'Routine review',
    'Medication refill only',
    'Psychology support',
    'Social work support',
    'Rehabilitation support',
    'Urgent review'
  ],
  urgencyLevel: ['Routine', 'Priority', 'Immediate'],
  relationshipType: [
    'Neighbor',
    'Community volunteer',
    'Village health volunteer',
    'Community leader',
    'Employer',
    'Teacher / school staff',
    'Other'
  ],
  coordinationType: [
    'Home visit coordination',
    'Welfare support',
    'Legal / protection support',
    'Shelter placement',
    'School support',
    'Medication follow-up',
    'Case conference',
    'Other'
  ],
  supportDomain: [
    'Vocational support',
    'Employment support',
    'Foundation / welfare support',
    'Private shelter',
    'Community activity',
    'Private clinic / pharmacy linkage',
    'Other'
  ],
  coordinationStatus: ['Draft', 'Requested', 'Accepted', 'In progress', 'Completed', 'Closed'],
  distressLevel: ['Low', 'Moderate', 'High', 'Severe'],
  safetyConcern: ['None', 'Monitor', 'Urgent', 'Suicide/Self-harm concern'],
  familySupport: ['Strong', 'Limited', 'No caregiver available'],
  barrierToCare: ['None', 'Transportation', 'Cost', 'Time/Work', 'Stigma', 'Housing', 'Other'],
  diagnosisGroup: [
    'Mood disorder',
    'Psychotic disorder',
    'Anxiety-related disorder',
    'Substance-related disorder',
    'Neurocognitive condition',
    'Other/Undifferentiated'
  ],
  medicationAdherence: ['Adherent', 'Partially adherent', 'Not adherent', 'Not applicable'],
  relapseWarning: ['None', 'Mild', 'Moderate', 'Severe'],
  suicideConcern: ['None', 'Passive thoughts', 'Active concern', 'Immediate risk'],
  violenceRisk: ['None', 'Low', 'Moderate', 'High'],
  substanceConcern: ['None', 'Monitor', 'Active concern'],
  stressLevel: ['Low', 'Moderate', 'High', 'Severe'],
  copingAbility: ['Strong', 'Adequate', 'Reduced', 'Poor'],
  traumaConcern: ['None', 'Monitor', 'Active concern'],
  therapyNeed: ['Routine', 'Soon', 'Urgent'],
  sleepProblem: ['None', 'Mild', 'Moderate', 'Severe'],
  emotionalRegulation: ['Stable', 'Some difficulty', 'Significant difficulty'],
  familyConflict: ['None', 'Mild', 'Moderate', 'Severe'],
  debtStress: ['None', 'Mild', 'Moderate', 'Severe'],
  housingProblem: ['Stable', 'Unstable', 'Unsafe', 'Homeless risk'],
  caregiverSupport: ['Adequate', 'Limited', 'No caregiver available'],
  welfareNeed: ['None', 'Routine support', 'Urgent support'],
  stigma: ['None', 'Mild', 'Moderate', 'Severe'],
  violenceAbuse: ['None', 'Past concern', 'Current concern', 'Immediate danger'],
  communitySupport: ['Strong', 'Available', 'Limited', 'None'],
  dischargeReadiness: ['Ready', 'Needs follow-up plan', 'Needs stabilization'],
  followUpStatus: ['Pending', 'Scheduled', 'Completed', 'Missed', 'Escalated'],
  barrierAfterDischarge: ['None', 'Transportation', 'Cost', 'Medication access', 'Family support', 'Housing', 'Stigma', 'Other'],
  escalationNeeded: ['No', 'Monitor', 'Yes - urgent'],
  consentStatus: ['Confirmed', 'Pending discussion', 'Emergency exception only'],
  caregiverInvolvement: ['Patient only', 'Family involved', 'Family not involved', 'To be discussed'],
  shareBoundary: ['Do not share', 'Share minimum necessary', 'Share after direct confirmation'],
  handoffReady: ['Draft', 'Ready to send', 'Sent', 'Needs review'],
  nextContactWindow: ['Same day', 'Within 24 hours', 'Within 72 hours', 'At next appointment']
};

function doGet(e) {
  ensurePrototypeSheets_();
  const template = HtmlService.createTemplateFromFile('Index');
  template.initialPortal = normalizePortalType_((e && e.parameter && e.parameter.portal) || '');
  return template.evaluate()
    .setTitle(APP_TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function authorizeAndSetup() {
  ensurePrototypeSheets_();
  const spreadsheet = getSpreadsheet_();
  return {
    success: true,
    message: 'Setup complete. Sheets are ready.',
    spreadsheetName: spreadsheet.getName(),
    spreadsheetUrl: spreadsheet.getUrl()
  };
}

function getBootstrap() {
  return getAppBootstrap('');
}

function getbootstrap() {
  return getAppBootstrap('');
}

function getAppBootstrap(sessionToken) {
  ensurePrototypeSheets_();
  const base = buildBaseBootstrap_();
  const session = getSessionFromToken_(sessionToken);
  if (!session) {
    return base;
  }
  return mergeObjects_(base, buildAuthenticatedBootstrap_(session));
}

function loginPortal(portalType, credentials) {
  ensurePrototypeSheets_();
  const normalizedPortalType = normalizePortalType_(portalType);
  let profile;

  if (normalizedPortalType === 'register') {
    profile = {
      portalType: 'register',
      displayName: 'New Registration',
      profession: '',
      organization: ''
    };
  } else if (normalizedPortalType === 'screening') {
    profile = {
      portalType: 'screening',
      displayName: 'Public Screening',
      profession: '',
      organization: ''
    };
  } else if (normalizedPortalType === 'patient' || normalizedPortalType === 'family') {
    profile = validatePortalAccessCredentials_(normalizedPortalType, credentials || {});
  } else if (['staff', 'community', 'public', 'private'].indexOf(normalizedPortalType) !== -1) {
    profile = validateUserPortalCredentials_(normalizedPortalType, credentials || {});
  } else {
    throw new Error('Unsupported portal type.');
  }

  const session = createSession_(profile);
  return mergeObjects_(buildBaseBootstrap_(), buildAuthenticatedBootstrap_(session));
}

function logoutPortal(sessionToken) {
  if (sanitizeText_(sessionToken)) {
    CacheService.getScriptCache().remove(buildSessionCacheKey_(sessionToken));
  }
  return { success: true };
}

function saveForm(formKey, payload, sessionToken) {
  ensurePrototypeSheets_();
  const session = requireSession_(sessionToken);
  authorizeFormAccess_(session, formKey);

  const handlers = {
    Patient_Registration: savePatientRegistration_,
    Patient_Checkin: savePatientCheckin_,
    Service_Followup: saveServiceFollowup_,
    Community_Referral: saveCommunityReferral_,
    Clinical_Review: saveClinicalReview_,
    Psychological_Review: savePsychologicalReview_,
    Psychosocial_Review: savePsychosocialReview_,
    MDT_Care_Plan: saveMDTCarePlan_,
    Minimum_Necessary_Handoff: saveMinimumNecessaryHandoff_,
    Public_Coordination: savePublicCoordination_,
    Private_Coordination: savePrivateCoordination_,
    Follow_Up: saveFollowUp_
  };

  if (!handlers[formKey]) {
    throw new Error('Unsupported form: ' + formKey);
  }

  const preparedPayload = preparePayloadForSession_(session, formKey, payload || {});
  const result = handlers[formKey](preparedPayload, session);
  refreshDashboardSheet_();

  const response = sanitizeSaveResponseForSession_(session, result);
  const portalState = buildAuthenticatedBootstrap_(session);
  response.dashboard = portalState.dashboard;
  response.ecosystemHub = portalState.ecosystemHub;
  response.caseWorkspace = portalState.caseWorkspace;
  response.referralNetwork = portalState.referralNetwork;
  response.caseOptions = portalState.caseOptions;
  response.staffOptions = portalState.staffOptions;
  response.formContext = portalState.formContext;
  return response;
}

function refreshDashboardData(sessionToken) {
  ensurePrototypeSheets_();
  const session = requireSession_(sessionToken);
  if (session.portalType !== 'staff') {
    throw new Error('Dashboard access is restricted to staff.');
  }

  refreshDashboardSheet_();
  const portalState = buildAuthenticatedBootstrap_(session);
  return {
    dashboard: portalState.dashboard,
    ecosystemHub: portalState.ecosystemHub,
    caseWorkspace: portalState.caseWorkspace,
    referralNetwork: portalState.referralNetwork,
    caseOptions: portalState.caseOptions,
    staffOptions: portalState.staffOptions,
    spreadsheetName: portalState.spreadsheetName,
    spreadsheetUrl: portalState.spreadsheetUrl
  };
}

function seedDemoData(sessionToken) {
  ensurePrototypeSheets_();
  const session = requireSession_(sessionToken);
  if (session.portalType !== 'staff') {
    throw new Error('Demo data seeding is restricted to staff.');
  }

  if (getSheetRecords_('Patient_Checkin').length > 0 || getSheetRecords_('Patient_Registration').length > 0) {
    const existingPortalState = buildAuthenticatedBootstrap_(session);
    return {
      seeded: false,
      message: 'Prototype data already exists.',
      dashboard: existingPortalState.dashboard,
      ecosystemHub: existingPortalState.ecosystemHub,
      caseWorkspace: existingPortalState.caseWorkspace,
      referralNetwork: existingPortalState.referralNetwork,
      caseOptions: existingPortalState.caseOptions,
      staffOptions: existingPortalState.staffOptions,
      spreadsheetName: existingPortalState.spreadsheetName,
      spreadsheetUrl: existingPortalState.spreadsheetUrl
    };
  }

  savePatientRegistration_({
    patient_code: 'MH-001',
    patient_label: 'Patient Alpha',
    contact_phone: '081-111-0001',
    emergency_contact: 'Relative A',
    caregiver_name: 'Caregiver A',
    health_coverage: 'Universal coverage',
    reason_for_first_visit: 'Urgent mood deterioration and isolation',
    consent_acknowledged: 'Yes',
    registration_source: 'Staff-assisted registration',
    patient_portal_code: 'PT001',
    family_portal_code: 'FAM001'
  });

  savePatientRegistration_({
    patient_code: 'MH-002',
    patient_label: 'Patient Bravo',
    contact_phone: '081-111-0002',
    emergency_contact: 'Relative B',
    caregiver_name: 'Sibling B',
    health_coverage: 'Social security',
    reason_for_first_visit: 'Family concern about relapse and medication lapse',
    consent_acknowledged: 'Yes',
    registration_source: 'Caregiver-assisted registration',
    patient_portal_code: 'PT002',
    family_portal_code: 'FAM002'
  });

  savePatientRegistration_({
    patient_code: 'MH-003',
    patient_label: 'Patient Charlie',
    contact_phone: '081-111-0003',
    emergency_contact: 'Relative C',
    caregiver_name: 'Spouse C',
    health_coverage: 'Civil servant benefit',
    reason_for_first_visit: 'Rehabilitation and community reintegration',
    consent_acknowledged: 'Yes',
    registration_source: 'Staff-assisted registration',
    patient_portal_code: 'PT003',
    family_portal_code: 'FAM003'
  });

  const alphaCaseId = createCaseId_();
  const bravoCaseId = createCaseId_();
  const charlieCaseId = createCaseId_();

  savePatientCheckin_({
    case_id: alphaCaseId,
    patient_code: 'MH-001',
    informant_type: 'Patient',
    visit_date: '2026-07-01',
    visit_purpose: 'ER urgent (ER ด่วน)',
    reason_for_visit: 'See psychiatrist / doctor',
    appointment_code: 'ER-4001',
    accompanying_person: 'Neighbor',
    payment_coverage: 'Universal coverage',
    main_concern: 'Low mood, hopelessness, and recent crisis',
    current_symptoms: 'Poor sleep, not eating, self-harm thoughts',
    distress_level: 'Severe',
    safety_concern: 'Suicide/Self-harm concern',
    family_caregiver_support: 'Limited',
    barrier_to_care: 'Transportation',
    additional_notes: 'Presented via emergency pathway'
  });

  saveClinicalReview_({
    case_id: alphaCaseId,
    reviewer_name: 'Doctor Demo',
    diagnosis_group: 'Mood disorder',
    bprs_total_score: '49',
    medication_adherence: 'Partially adherent',
    relapse_warning_signs: 'Severe',
    suicide_self_harm_concern: 'Active concern',
    violence_risk: 'Low',
    substance_use_concern: 'None',
    clinical_notes: 'Needs urgent safety plan and observation'
  });

  savePsychologicalReview_({
    case_id: alphaCaseId,
    reviewer_name: 'Psychologist Demo',
    stress_level: 'Severe',
    coping_ability: 'Poor',
    trauma_grief_concern: 'Active concern',
    therapy_need: 'Urgent',
    sleep_problem: 'Severe',
    emotional_regulation: 'Significant difficulty',
    psychological_notes: 'Severe distress with limited coping'
  });

  savePublicCoordination_({
    case_id: alphaCaseId,
    agency_name: 'District Health Office',
    coordination_type: 'Medication follow-up',
    urgency_level: 'Immediate',
    referral_reason: 'Need public sector continuity after crisis stabilization',
    shared_information: 'Risk summary, medication needs, follow-up tasks',
    requested_action: 'Coordinate community clinic and home visit',
    meeting_date: '2026-07-02',
    coordination_status: 'Requested',
    notes: 'Priority public sector handoff after discharge planning'
  });

  savePatientCheckin_({
    case_id: bravoCaseId,
    patient_code: 'MH-002',
    informant_type: 'Family/Caregiver',
    visit_date: '2026-07-02',
    visit_purpose: 'Walk-in',
    reason_for_visit: 'Medication refill',
    appointment_code: 'WLK-2102',
    accompanying_person: 'Sibling',
    payment_coverage: 'Social security',
    main_concern: 'Medication lapse, conflict at home, and financial stress',
    current_symptoms: 'Irritability, low routine, poor sleep',
    distress_level: 'High',
    safety_concern: 'Monitor',
    family_caregiver_support: 'No caregiver available',
    barrier_to_care: 'Cost',
    additional_notes: 'Caregiver fatigue and missed visits'
  });

  saveServiceFollowup_({
    case_id: bravoCaseId,
    patient_code: 'MH-002',
    requester_type: 'Family/Caregiver',
    service_type: 'Medication refill',
    appointment_code: 'MED-8802',
    medication_need: 'Out of medication',
    current_symptoms: 'Irritable and less engaged',
    main_concern: 'Family wants urgent refill and review',
    caregiver_concern: 'Caregiver overwhelmed and cannot supervise daily',
    social_problem: 'Debt and unstable income',
    payment_coverage: 'Social security',
    today_support_needed: 'Urgent review',
    urgency_level: 'Priority'
  });

  savePsychosocialReview_({
    case_id: bravoCaseId,
    reviewer_name: 'Social Worker Demo',
    family_conflict: 'Moderate',
    debt_financial_stress: 'Severe',
    housing_problem: 'Stable',
    caregiver_support: 'No caregiver available',
    welfare_need: 'Urgent support',
    stigma: 'Moderate',
    violence_abuse: 'None',
    community_support: 'Limited',
    psychosocial_notes: 'Financial strain is disrupting continuity of care'
  });

  savePrivateCoordination_({
    case_id: bravoCaseId,
    organization_name: 'Hope Foundation',
    support_domain: 'Foundation / welfare support',
    urgency_level: 'Priority',
    referral_reason: 'Need short-term financial and caregiver support',
    support_needs: 'Medication support, transport support, family counseling linkage',
    requested_action: 'Review for emergency welfare package',
    meeting_date: '2026-07-04',
    coordination_status: 'In progress',
    notes: 'NGO support requested while welfare paperwork is pending'
  });

  saveFollowUp_({
    case_id: bravoCaseId,
    follow_up_due_date: '2026-07-05',
    responsible_staff: 'Community Team',
    referral_destination: 'Community Mental Health Center',
    follow_up_status: 'Pending',
    barrier_after_discharge: 'Medication access',
    outcome: '',
    escalation_needed: 'Monitor',
    follow_up_notes: 'Coordinate refill and caregiver support'
  });

  saveMinimumNecessaryHandoff_({
    case_id: alphaCaseId,
    reviewed_by: 'Doctor Demo',
    consent_status: 'Emergency exception only',
    caregiver_involvement: 'To be discussed',
    public_sector_share: 'Share minimum necessary',
    private_partner_share: 'Do not share',
    community_follow_up_share: 'Share after direct confirmation',
    handoff_ready: 'Ready to send',
    next_step_owner: 'District Health Office Liaison',
    next_contact_window: 'Within 24 hours',
    minimum_necessary_summary: 'Recent crisis presentation with limited caregiver support. Needs urgent clinic follow-up, medication continuity, and coordinated home contact after stabilization.',
    crisis_safety_summary: 'Escalate rapidly if hopelessness, self-harm thoughts, or medication interruption reappear. Confirm local crisis contact and same-day review pathway.',
    do_not_share: 'Detailed psychotherapy content and sensitive narrative history stay inside the hospital record.'
  });

  saveMinimumNecessaryHandoff_({
    case_id: bravoCaseId,
    reviewed_by: 'Social Worker Demo',
    consent_status: 'Confirmed',
    caregiver_involvement: 'Family involved',
    public_sector_share: 'Share minimum necessary',
    private_partner_share: 'Share minimum necessary',
    community_follow_up_share: 'Share after direct confirmation',
    handoff_ready: 'Sent',
    next_step_owner: 'Community Team',
    next_contact_window: 'Within 72 hours',
    minimum_necessary_summary: 'Medication lapse, caregiver strain, and financial stress are disrupting continuity. Priority is refill access, caregiver support, and transport or welfare linkage.',
    crisis_safety_summary: 'Monitor for missed medication, worsening agitation, or loss of support. Escalate if follow-up is missed or the caregiver cannot maintain supervision.',
    do_not_share: 'Do not circulate detailed family conflict notes beyond direct care coordination needs.'
  });

  savePatientCheckin_({
    case_id: charlieCaseId,
    patient_code: 'MH-003',
    informant_type: 'Staff',
    visit_date: '2026-07-03',
    visit_purpose: 'Scheduled appointment (มาตามนัด)',
    reason_for_visit: 'Vocational training / rehabilitation',
    appointment_code: 'SCH-7750',
    accompanying_person: 'Spouse',
    payment_coverage: 'Civil servant benefit',
    main_concern: 'Needs rehabilitation and gradual work return support',
    current_symptoms: 'Anxiety in crowded settings',
    distress_level: 'Moderate',
    safety_concern: 'None',
    family_caregiver_support: 'Strong',
    barrier_to_care: 'None',
    additional_notes: 'Stable and motivated for structured support'
  });

  savePsychologicalReview_({
    case_id: charlieCaseId,
    reviewer_name: 'Psychologist Demo',
    stress_level: 'Moderate',
    coping_ability: 'Adequate',
    trauma_grief_concern: 'None',
    therapy_need: 'Routine',
    sleep_problem: 'Mild',
    emotional_regulation: 'Stable',
    psychological_notes: 'Engaged and goal-directed'
  });

  saveMDTCarePlan_({
    case_id: charlieCaseId,
    meeting_date: '2026-07-03',
    main_care_goal: 'Maintain functioning and support work reintegration',
    clinical_plan: 'Continue routine review and medication monitoring',
    psychological_plan: 'Brief anxiety management sessions',
    social_intervention_plan: 'Coordinate workplace and family support',
    rehabilitation_plan: 'Gradual return to work with OT support',
    referral_plan: 'Link to community activity and vocational coaching',
    discharge_readiness: 'Needs follow-up plan',
    team_members: 'Doctor, Nurse, Psychologist, Social Worker, OT'
  });

  saveMinimumNecessaryHandoff_({
    case_id: charlieCaseId,
    reviewed_by: 'Psychologist Demo',
    consent_status: 'Confirmed',
    caregiver_involvement: 'Family involved',
    public_sector_share: 'Do not share',
    private_partner_share: 'Share minimum necessary',
    community_follow_up_share: 'Share minimum necessary',
    handoff_ready: 'Draft',
    next_step_owner: 'OT Demo',
    next_contact_window: 'At next appointment',
    minimum_necessary_summary: 'Stable for rehabilitation-focused follow-up. Main needs are gradual community reintegration, vocational coaching, and anxiety-sensitive activity planning.',
    crisis_safety_summary: 'No acute safety concern. Review promptly if anxiety escalates or community participation drops sharply.',
    do_not_share: 'Keep detailed internal recovery goals and private counseling reflections inside the hospital record.'
  });

  saveCommunityReferral_({
    case_id: charlieCaseId,
    patient_code: 'MH-003',
    informant_name: 'Village Health Volunteer',
    relationship_to_patient: 'Village health volunteer',
    contact_phone: '089-444-2000',
    visit_purpose: 'Community follow-up',
    reason_for_referral: 'Community monitoring and support after rehabilitation plan',
    observed_behavior: 'Attending some activities but avoids crowds',
    main_concern: 'Wants community-based activity support',
    current_symptoms: 'Mild anxiety in unfamiliar groups',
    safety_concern: 'None',
    family_caregiver_support: 'Strong',
    barrier_to_care: 'None',
    additional_notes: 'Community mentor available'
  });

  refreshDashboardSheet_();
  const portalState = buildAuthenticatedBootstrap_(session);
  return {
    seeded: true,
    message: 'Prototype data added.',
    dashboard: portalState.dashboard,
    ecosystemHub: portalState.ecosystemHub,
    caseWorkspace: portalState.caseWorkspace,
    referralNetwork: portalState.referralNetwork,
    caseOptions: portalState.caseOptions,
    staffOptions: portalState.staffOptions,
    spreadsheetName: portalState.spreadsheetName,
    spreadsheetUrl: portalState.spreadsheetUrl
  };
}

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

function firstNonEmpty_() {
  for (var i = 0; i < arguments.length; i += 1) {
    if (hasValue_(arguments[i])) {
      return arguments[i];
    }
  }
  return '';
}

function hasValue_(value) {
  return !(value === undefined || value === null || (typeof value === 'string' && value.trim() === ''));
}

function buildBaseBootstrap_() {
  return {
    authenticated: false,
    appTitle: APP_TITLE,
    subtitle: APP_SUBTITLE,
    portalOptions: [
      {
        id: 'register',
        title: 'New Patient Registration',
        subtitle: 'Create a privacy-preserving patient profile and portal codes'
      },
      {
        id: 'patient',
        title: 'Patient Portal',
        subtitle: 'Self check-in and follow-up request'
      },
      {
        id: 'screening',
        title: 'Conference QR Screening',
        subtitle: 'Public BPRS and AI-supported screening from a QR scan or home access'
      },
      {
        id: 'family',
        title: 'Family / Caregiver Portal',
        subtitle: 'Caregiver-assisted check-in and support request'
      },
      {
        id: 'community',
        title: 'Community Referral',
        subtitle: 'Referral from volunteers, neighbors, or community leaders'
      },
      {
        id: 'staff',
        title: 'Hospital Staff Hub',
        subtitle: 'MindBridge orchestration across intake, triage, case review, network coordination, and continuity'
      },
      {
        id: 'public',
        title: 'Public Sector Network',
        subtitle: 'Interagency coordination with public sector partners'
      },
      {
        id: 'private',
        title: 'Private / NGO Network',
        subtitle: 'External coordination for private sector and NGO support'
      }
    ],
    proposalNote: 'This Phase 1 MVP demonstrates the front door, AI-assisted screening support, intelligent triage, multidisciplinary care planning, safe handoff, continuity follow-up, and dashboard learning loop of the larger MindBridge Global ecosystem. AI suggestions are for professional review only, never automatic clinical decisions, and external coordination should use a minimum necessary handoff summary rather than a full hospital record.'
  };
}

function buildAuthenticatedBootstrap_(session) {
  const spreadsheet = getSpreadsheet_();
  const isStaff = session.portalType === 'staff';
  const canSeeCaseOptions = ['staff', 'public', 'private'].indexOf(session.portalType) !== -1;

  return {
    authenticated: true,
    sessionToken: session.token,
    currentUser: {
      portalType: session.portalType,
      displayName: session.displayName,
      patientCode: session.patientCode || '',
      profession: session.profession || '',
      organization: session.organization || '',
      roleLabel: getPortalRoleLabel_(session.portalType)
    },
    allowedPages: getAllowedPagesForPortalType_(session.portalType),
    defaultPage: session.portalType === 'staff' ? 'ecosystem_hub' : getAllowedPagesForPortalType_(session.portalType)[0],
    optionSets: OPTION_SETS,
    caseOptions: canSeeCaseOptions ? getCaseOptions_() : [],
    staffOptions: isStaff ? getStaffOptions_() : [],
    dashboard: isStaff ? getDashboardData_() : buildEmptyDashboard_(),
    ecosystemHub: isStaff ? getEcosystemHubData_() : buildEmptyEcosystemHub_(),
    caseWorkspace: isStaff ? getCaseWorkspaceData_() : buildEmptyCaseWorkspace_(),
    referralNetwork: isStaff ? getReferralNetworkData_() : buildEmptyReferralNetwork_(),
    formContext: getFormContextForSession_(session),
    canRefreshDashboard: isStaff,
    canSeedDemoData: isStaff,
    spreadsheetName: isStaff ? spreadsheet.getName() : '',
    spreadsheetUrl: isStaff ? spreadsheet.getUrl() : ''
  };
}

function getPortalRoleLabel_(portalType) {
  switch (portalType) {
    case 'register':
      return 'Registration access';
    case 'patient':
      return 'Patient portal';
    case 'screening':
      return 'Public self-screening';
    case 'family':
      return 'Family portal';
    case 'community':
      return 'Community referral';
    case 'public':
      return 'Public sector network';
    case 'private':
      return 'Private / NGO network';
    default:
      return 'Hospital staff';
  }
}

function buildEmptyDashboard_() {
  return {
    summaryCards: [],
    workflowCoverage: [],
    arrivalMix: [],
    networkOverview: [],
    aiMonitoring: [],
    biasWatch: [],
    commonRiskFactors: [],
    triageQueue: [],
    recentFlags: [],
    lastUpdated: ''
  };
}

function buildEmptyEcosystemHub_() {
  return {
    summaryCards: [],
    journeyRail: [],
    frontDoorMix: [],
    spotlight: [],
    architectureLayers: [],
    collaborationBackbone: [],
    phaseFocus: [],
    phaseStatus: '',
    ecosystemLayerCount: 0,
    lastUpdated: ''
  };
}

function buildEmptyCaseWorkspace_() {
  return {
    cases: [],
    lastUpdated: ''
  };
}

function buildEmptyReferralNetwork_() {
  return {
    summaryCards: [],
    lanes: [],
    openLoops: [],
    lastUpdated: ''
  };
}

function getAllowedPagesForPortalType_(portalType) {
  switch (portalType) {
    case 'register':
      return ['Patient_Registration'];
    case 'screening':
      return ['Patient_Checkin'];
    case 'patient':
      return ['Patient_Checkin', 'Service_Followup'];
    case 'family':
      return ['Patient_Checkin', 'Service_Followup'];
    case 'community':
      return ['Community_Referral'];
    case 'public':
      return ['Public_Coordination'];
    case 'private':
      return ['Private_Coordination'];
    default:
      return [
        'ecosystem_hub',
        'dashboard',
        'triage_hub',
        'Patient_Registration',
        'Patient_Checkin',
        'Service_Followup',
        'Community_Referral',
        'case_workspace',
        'Clinical_Review',
        'Psychological_Review',
        'Psychosocial_Review',
        'MDT_Care_Plan',
        'Minimum_Necessary_Handoff',
        'referral_network',
        'Public_Coordination',
        'Private_Coordination',
        'Follow_Up'
      ];
  }
}

function getFormContextForSession_(session) {
  if (session.portalType === 'staff') {
    return {};
  }

  if (session.portalType === 'register') {
    return {
      Patient_Registration: {
        hiddenFields: ['registration_source'],
        fixedValues: {
          registration_source: 'Self registration',
          consent_acknowledged: 'Yes'
        },
        summaryText: 'New patient registration. This prototype stores a patient code and portal codes instead of full identifying data.'
      }
    };
  }

  if (session.portalType === 'screening') {
    return {
      Patient_Checkin: {
        hiddenFields: ['patient_code', 'visit_purpose', 'reason_for_visit', 'appointment_code'],
        fixedValues: {
          visit_purpose: 'Digital self-screening',
          reason_for_visit: 'Self-screening / AI triage',
          appointment_code: ''
        },
        summaryText: 'Public screening portal for conference audiences, home use, and caregiver-assisted BPRS plus AI-supported triage.'
      }
    };
  }

  if (session.portalType === 'patient' || session.portalType === 'family') {
    const isPatient = session.portalType === 'patient';
    const informantType = isPatient ? 'Patient' : 'Family/Caregiver';
    const summaryText = (isPatient ? 'Patient signed in: ' : 'Family / caregiver signed in: ') +
      session.displayName + ' (' + session.patientCode + ')';
    return {
      Patient_Checkin: {
        hiddenFields: ['patient_code', 'informant_type'],
        fixedValues: {
          patient_code: session.patientCode,
          informant_type: informantType
        },
        summaryText: summaryText
      },
      Service_Followup: {
        hiddenFields: ['patient_code', 'requester_type'],
        fixedValues: {
          patient_code: session.patientCode,
          requester_type: informantType
        },
        hideCaseSelector: true,
        summaryText: summaryText
      }
    };
  }

  if (session.portalType === 'community') {
    return {
      Community_Referral: {
        hiddenFields: ['informant_name'],
        fixedValues: {
          informant_name: session.displayName
        },
        summaryText: 'Signed in as ' + session.displayName + (session.organization ? ' - ' + session.organization : '')
      }
    };
  }

  if (session.portalType === 'public') {
    return {
      Public_Coordination: {
        hiddenFields: ['agency_name'],
        fixedValues: {
          agency_name: session.organization || session.displayName
        },
        summaryText: 'Signed in as ' + (session.organization || session.displayName)
      }
    };
  }

  if (session.portalType === 'private') {
    return {
      Private_Coordination: {
        hiddenFields: ['organization_name'],
        fixedValues: {
          organization_name: session.organization || session.displayName
        },
        summaryText: 'Signed in as ' + (session.organization || session.displayName)
      }
    };
  }

  return {};
}

function sanitizeSaveResponseForSession_(session, result) {
  if (session.portalType === 'staff') {
    return result;
  }

  return {
    success: result.success,
    caseId: result.caseId || '',
    patientCode: result.patientCode || '',
    generatedCodes: result.generatedCodes || null,
    riskFlag: result.riskFlag || '',
    riskReasons: result.riskReasons || [],
    aiScreening: result.aiScreening || null,
    bprsScore: result.bprsScore || '',
    bprsInterpretation: result.bprsInterpretation || '',
    alertQueued: !!result.alertQueued,
    queuePriority: result.queuePriority || '',
    ecosystemHub: result.ecosystemHub || null,
    caseWorkspace: result.caseWorkspace || null,
    referralNetwork: result.referralNetwork || null,
    message: result.message || 'Saved successfully.'
  };
}

function preparePayloadForSession_(session, formKey, payload) {
  const prepared = mergeObjects_({}, payload);

  if (session.portalType === 'register') {
    if (formKey !== 'Patient_Registration') {
      throw new Error('This portal can only submit patient registration.');
    }
    prepared.registration_source = 'Self registration';
    prepared.consent_acknowledged = prepared.consent_acknowledged || 'Yes';
    return prepared;
  }

  if (session.portalType === 'screening') {
    if (formKey !== 'Patient_Checkin') {
      throw new Error('This portal can only submit public screening.');
    }
    prepared.patient_code = sanitizeText_(prepared.patient_code);
    prepared.visit_purpose = 'Digital self-screening';
    prepared.reason_for_visit = 'Self-screening / AI triage';
    prepared.appointment_code = '';
    prepared.case_id = prepared.case_id || createCaseId_();
    if (!sanitizeText_(prepared.visit_date)) {
      prepared.visit_date = new Date();
    }
    return prepared;
  }

  if (session.portalType === 'patient' || session.portalType === 'family') {
    if (['Patient_Checkin', 'Service_Followup'].indexOf(formKey) === -1) {
      throw new Error('This portal cannot access that form.');
    }

    prepared.patient_code = session.patientCode;
    if (formKey === 'Patient_Checkin') {
      prepared.informant_type = session.portalType === 'patient' ? 'Patient' : 'Family/Caregiver';
      prepared.case_id = findLatestCaseIdByPatientCode_(session.patientCode) || prepared.case_id || createCaseId_();
    }
    if (formKey === 'Service_Followup') {
      prepared.requester_type = session.portalType === 'patient' ? 'Patient' : 'Family/Caregiver';
      prepared.case_id = findLatestCaseIdByPatientCode_(session.patientCode) || prepared.case_id || createCaseId_();
    }
    return prepared;
  }

  if (session.portalType === 'community' && formKey === 'Community_Referral') {
    prepared.informant_name = session.displayName;
    return prepared;
  }

  if (session.portalType === 'public' && formKey === 'Public_Coordination') {
    prepared.agency_name = session.organization || session.displayName;
    return prepared;
  }

  if (session.portalType === 'private' && formKey === 'Private_Coordination') {
    prepared.organization_name = session.organization || session.displayName;
    return prepared;
  }

  return prepared;
}

function authorizeFormAccess_(session, formKey) {
  const allowedPages = getAllowedPagesForPortalType_(session.portalType);
  if (allowedPages.indexOf(formKey) === -1) {
    throw new Error('You do not have access to this form.');
  }
}

function validateUserPortalCredentials_(portalType, credentials) {
  const username = sanitizeText_(credentials.login_username).toLowerCase();
  const password = sanitizeText_(credentials.login_password);
  if (!username || !password) {
    throw new Error('Enter both username and password.');
  }

  const user = getSheetRecords_('Users').find(function(record) {
    return String(record.active).toLowerCase() === 'yes' &&
      normalizePortalType_(record.allowed_portal) === portalType &&
      sanitizeText_(record.login_username).toLowerCase() === username &&
      sanitizeText_(record.login_password) === password;
  });

  if (!user) {
    throw new Error('Login not recognized for this portal.');
  }

  return {
    portalType: portalType,
    displayName: sanitizeText_(user.display_name),
    profession: sanitizeText_(user.profession),
    organization: sanitizeText_(user.organization)
  };
}

function validatePortalAccessCredentials_(portalType, credentials) {
  const patientCode = sanitizeText_(credentials.patient_code).toUpperCase();
  const accessCode = sanitizeText_(credentials.access_code).toUpperCase();
  if (!patientCode || !accessCode) {
    throw new Error('Enter patient code and access code.');
  }

  const record = getSheetRecords_('Portal_Access').find(function(row) {
    return String(row.active).toLowerCase() === 'yes' &&
      normalizePortalType_(row.portal_type) === portalType &&
      sanitizeText_(row.patient_code).toUpperCase() === patientCode &&
      sanitizeText_(row.access_code).toUpperCase() === accessCode;
  });

  if (!record) {
    throw new Error('Portal login not recognized.');
  }

  return {
    portalType: portalType,
    displayName: sanitizeText_(record.display_name),
    patientCode: patientCode,
    profession: '',
    organization: ''
  };
}

function createSession_(profile) {
  const token = Utilities.getUuid();
  const session = {
    token: token,
    portalType: profile.portalType,
    displayName: profile.displayName,
    patientCode: profile.patientCode || '',
    profession: profile.profession || '',
    organization: profile.organization || '',
    createdAt: new Date().toISOString()
  };
  CacheService.getScriptCache().put(buildSessionCacheKey_(token), JSON.stringify(session), SESSION_TTL_SECONDS);
  return session;
}

function getSessionFromToken_(sessionToken) {
  const token = sanitizeText_(sessionToken);
  if (!token) {
    return null;
  }

  const payload = CacheService.getScriptCache().get(buildSessionCacheKey_(token));
  if (!payload) {
    return null;
  }

  try {
    const session = JSON.parse(payload);
    session.token = token;
    CacheService.getScriptCache().put(buildSessionCacheKey_(token), JSON.stringify(session), SESSION_TTL_SECONDS);
    return session;
  } catch (error) {
    CacheService.getScriptCache().remove(buildSessionCacheKey_(token));
    return null;
  }
}

function requireSession_(sessionToken) {
  const session = getSessionFromToken_(sessionToken);
  if (!session) {
    throw new Error('Your session has expired. Please sign in again.');
  }
  return session;
}

function buildSessionCacheKey_(token) {
  return 'portal-session:' + token;
}

function normalizePortalType_(value) {
  const normalized = sanitizeText_(value).toLowerCase();
  if (normalized === 'family/caregiver' || normalized === 'caregiver') {
    return 'family';
  }
  if (normalized === 'conference' || normalized === 'conference screening' || normalized === 'public screening' || normalized === 'qr screening' || normalized === 'self-screening' || normalized === 'screening') {
    return 'screening';
  }
  if (normalized === 'new patient' || normalized === 'registration') {
    return 'register';
  }
  if (normalized === 'public sector' || normalized === 'public sector network') {
    return 'public';
  }
  if (normalized === 'private / ngo' || normalized === 'private sector' || normalized === 'private sector network' || normalized === 'ngo') {
    return 'private';
  }
  return normalized;
}

function getDashboardData_() {
  const registrations = getSheetRecords_('Patient_Registration');
  const checkins = getSheetRecords_('Patient_Checkin');
  const serviceFollowups = getSheetRecords_('Service_Followup');
  const communityReferrals = getSheetRecords_('Community_Referral');
  const clinicalReviews = getSheetRecords_('Clinical_Review');
  const psychologicalReviews = getSheetRecords_('Psychological_Review');
  const psychosocialReviews = getSheetRecords_('Psychosocial_Review');
  const carePlans = getSheetRecords_('MDT_Care_Plan');
  const handoffs = getSheetRecords_('Minimum_Necessary_Handoff');
  const publicCoordination = getSheetRecords_('Public_Coordination');
  const privateCoordination = getSheetRecords_('Private_Coordination');
  const followUps = getSheetRecords_('Follow_Up');
  const alertQueue = getSheetRecords_('Alert_Queue');
  const aiLogs = getSheetRecords_('AI_Screening_Log');

  const latestCheckin = indexLatestByCase_(checkins, 'created_at');
  const latestService = indexLatestByCase_(serviceFollowups, 'requested_at');
  const latestCommunity = indexLatestByCase_(communityReferrals, 'referred_at');
  const latestClinical = indexLatestByCase_(clinicalReviews, 'reviewed_at');
  const latestPsychological = indexLatestByCase_(psychologicalReviews, 'reviewed_at');
  const latestPsychosocial = indexLatestByCase_(psychosocialReviews, 'reviewed_at');
  const latestCarePlan = indexLatestByCase_(carePlans, 'updated_at');
  const latestHandoff = indexLatestByCase_(handoffs, 'updated_at');
  const latestPublic = indexLatestByCase_(publicCoordination, 'updated_at');
  const latestPrivate = indexLatestByCase_(privateCoordination, 'updated_at');
  const latestFollowUp = indexLatestByCase_(followUps, 'updated_at');
  const latestAIScreening = indexLatestByCase_(aiLogs, 'screened_at');

  const caseIds = uniqueValues_(
    checkins.concat(
      serviceFollowups,
      communityReferrals,
      clinicalReviews,
      psychologicalReviews,
      psychosocialReviews,
      carePlans,
      handoffs,
      publicCoordination,
      privateCoordination,
      followUps
    )
      .map(function(record) { return sanitizeText_(record.case_id); })
      .filter(Boolean)
  );

  const caseSummaries = caseIds.map(function(caseId) {
    const related = [
      latestCheckin[caseId],
      latestService[caseId],
      latestCommunity[caseId],
      latestClinical[caseId],
      latestPsychological[caseId],
      latestPsychosocial[caseId],
      latestCarePlan[caseId],
      latestHandoff[caseId],
      latestFollowUp[caseId],
      latestAIScreening[caseId]
    ].filter(Boolean);
    const intake = latestCheckin[caseId] || latestService[caseId] || latestCommunity[caseId] || {};
    const latestDate = related.map(function(record) {
      return toComparableDate_(record.created_at || record.requested_at || record.referred_at || record.reviewed_at || record.updated_at);
    }).reduce(function(maxValue, value) {
      return Math.max(maxValue, value);
    }, 0);
    const flags = related.map(function(record) {
      return record.risk_flag || record.overall_risk_flag || '';
    }).filter(Boolean);
    const reasons = [];
    related.forEach(function(record) {
      reasons.push.apply(reasons, splitReasonList_(record.risk_reasons));
    });

    return {
      caseId: caseId,
      patientCode: sanitizeText_(intake.patient_code) || caseId,
      mainConcern: sanitizeText_(intake.main_concern || intake.reason_for_referral),
      riskFlag: maxRiskFlag_(flags),
      riskReasons: uniqueValues_(reasons),
      lastUpdated: latestDate ? new Date(latestDate) : '',
      visitPurpose: sanitizeText_((latestCheckin[caseId] || {}).visit_purpose),
      followUpStatus: sanitizeText_((latestFollowUp[caseId] || {}).follow_up_status),
      publicStatus: sanitizeText_((latestPublic[caseId] || {}).coordination_status),
      privateStatus: sanitizeText_((latestPrivate[caseId] || {}).coordination_status),
      handoffStatus: sanitizeText_((latestHandoff[caseId] || {}).handoff_ready),
      consentStatus: sanitizeText_((latestHandoff[caseId] || {}).consent_status)
    };
  });

  const riskFactorCounts = {};
  caseSummaries.forEach(function(summary) {
    summary.riskReasons.forEach(function(reason) {
      if (reason === 'No urgent risk') {
        return;
      }
      riskFactorCounts[reason] = (riskFactorCounts[reason] || 0) + 1;
    });
  });

  const immediateAlerts = alertQueue.filter(function(record) {
    return sanitizeText_(record.queue_priority) === 'Immediate' &&
      sanitizeText_(record.handled_status) !== 'Handled';
  }).length;

  const pendingFollowUp = caseSummaries.filter(function(summary) {
    return ['Pending', 'Scheduled', 'Missed', 'Escalated'].indexOf(summary.followUpStatus) !== -1;
  }).length;

  const pendingNetworkCoordination = caseSummaries.filter(function(summary) {
    return isOpenCoordinationStatus_(summary.publicStatus) || isOpenCoordinationStatus_(summary.privateStatus);
  }).length;
  const handoffReady = caseSummaries.filter(function(summary) {
    return ['Ready to send', 'Sent'].indexOf(summary.handoffStatus) !== -1;
  }).length;
  const consentPending = caseSummaries.filter(function(summary) {
    return ['Pending discussion', 'Emergency exception only', 'Not recorded'].indexOf(summary.consentStatus) !== -1;
  }).length;

  const walkInToday = checkins.filter(function(record) {
    return isSameDay_(record.created_at, new Date()) &&
      (matchesAny_(record.visit_purpose, ['Walk-in']) || matchesAny_(record.visit_purpose, ['ER urgent (ER ด่วน)']));
  }).length;

  const arrivalMixCounts = {
    scheduled: 0,
    walkin: 0,
    urgent: 0,
    community: 0
  };

  caseSummaries.forEach(function(summary) {
    if (matchesAny_(summary.visitPurpose, ['Scheduled appointment (มาตามนัด)'])) {
      arrivalMixCounts.scheduled += 1;
      return;
    }
    if (matchesAny_(summary.visitPurpose, ['Walk-in'])) {
      arrivalMixCounts.walkin += 1;
      return;
    }
    if (matchesAny_(summary.visitPurpose, ['ER urgent (ER ด่วน)'])) {
      arrivalMixCounts.urgent += 1;
      return;
    }
    if (summary.visitPurpose) {
      arrivalMixCounts.community += 1;
    }
  });

  const workflowCoverage = [
    { label: 'Check-in', value: distinctCaseCount_(checkins) },
    { label: 'Clinical review', value: distinctCaseCount_(clinicalReviews) },
    { label: 'Psychological review', value: distinctCaseCount_(psychologicalReviews) },
    { label: 'Psychosocial review', value: distinctCaseCount_(psychosocialReviews) },
    { label: 'MDT plan', value: distinctCaseCount_(carePlans) },
    { label: 'Safe handoff', value: distinctCaseCount_(handoffs) },
    { label: 'Follow-up', value: distinctCaseCount_(followUps) }
  ];

  const networkOverview = [
    { label: 'Community referrals', value: distinctCaseCount_(communityReferrals) },
    { label: 'Handoffs ready', value: handoffReady },
    { label: 'Consent pending', value: consentPending },
    { label: 'Public sector open', value: countLatestOpenStatus_(latestPublic) },
    { label: 'Private / NGO open', value: countLatestOpenStatus_(latestPrivate) }
  ];

  const aiLiveLogs = aiLogs.filter(function(record) {
    return sanitizeText_(record.screening_status) === 'live_openai';
  });
  const aiAgreementCount = aiLiveLogs.filter(function(record) {
    return sanitizeText_(record.agreement_status) === 'Match';
  }).length;
  const aiReviewCount = aiLogs.filter(function(record) {
    return sanitizeText_(record.human_review_required) === 'Yes';
  }).length;
  const aiAgreementRate = aiLiveLogs.length ? Math.round((aiAgreementCount / aiLiveLogs.length) * 100) : 0;
  const biasWatch = buildBiasWatchItems_(aiLogs);
  const aiMonitoring = [
    { label: 'AI screens logged', value: aiLogs.length },
    { label: 'Live AI calls', value: aiLiveLogs.length },
    { label: 'AI / local agreement', value: aiLiveLogs.length ? aiAgreementRate + '%' : '0%' },
    { label: 'Human review required', value: aiReviewCount },
    { label: 'Bias watch groups', value: biasWatch.length }
  ];

  const triageQueue = alertQueue.sort(function(left, right) {
    return toComparableDate_(right.queued_at) - toComparableDate_(left.queued_at);
  }).slice(0, 8).map(function(record) {
    return {
      caseId: sanitizeText_(record.case_id),
      patientCode: sanitizeText_(record.patient_code) || sanitizeText_(record.case_id),
      source: sanitizeText_(record.informant_type),
      visitPurpose: sanitizeText_(record.visit_purpose),
      queuePriority: sanitizeText_(record.queue_priority),
      riskFlag: sanitizeText_(record.risk_flag) || 'Green',
      telegramStatus: sanitizeText_(record.telegram_status) || 'Not sent',
      handledStatus: sanitizeText_(record.handled_status) || 'Pending',
      queuedAt: formatDateTime_(record.queued_at)
    };
  });

  const recentFlags = caseSummaries.filter(function(summary) {
    return summary.riskFlag !== 'Green';
  }).sort(function(left, right) {
    return toComparableDate_(right.lastUpdated) - toComparableDate_(left.lastUpdated);
  }).slice(0, 8).map(function(summary) {
    return {
      caseId: summary.caseId,
      patientCode: summary.patientCode,
      riskFlag: summary.riskFlag,
      lastUpdated: summary.lastUpdated ? formatDateTime_(summary.lastUpdated) : '',
      riskReasons: summary.riskReasons.join(', '),
      mainConcern: summary.mainConcern
    };
  });

  const commonRiskFactors = Object.keys(riskFactorCounts).map(function(key) {
    return {
      label: key,
      value: riskFactorCounts[key]
    };
  }).sort(function(left, right) {
    return right.value - left.value;
  }).slice(0, 10);

  return {
    summaryCards: [
      { label: 'Total cases', value: caseSummaries.length, tone: 'teal' },
      { label: 'Immediate alerts', value: immediateAlerts, tone: immediateAlerts > 0 ? 'red' : 'blue' },
      { label: 'Pending follow-up', value: pendingFollowUp, tone: pendingFollowUp > 0 ? 'orange' : 'teal' },
      { label: 'Network coordination open', value: pendingNetworkCoordination, tone: pendingNetworkCoordination > 0 ? 'blue' : 'teal' },
      { label: 'Walk-ins / ER today', value: walkInToday, tone: walkInToday > 0 ? 'yellow' : 'teal' },
      { label: 'Registered patients', value: registrations.length, tone: 'blue' }
    ],
    workflowCoverage: workflowCoverage,
    arrivalMix: [
      { label: 'Scheduled', value: arrivalMixCounts.scheduled },
      { label: 'Walk-in', value: arrivalMixCounts.walkin },
      { label: 'ER urgent', value: arrivalMixCounts.urgent },
      { label: 'Referral / community', value: arrivalMixCounts.community }
    ],
    networkOverview: networkOverview,
    aiMonitoring: aiMonitoring,
    biasWatch: biasWatch,
    commonRiskFactors: commonRiskFactors,
    triageQueue: triageQueue,
    recentFlags: recentFlags,
    lastUpdated: formatDateTime_(new Date())
  };
}

function getEcosystemHubData_() {
  const master = getSheetRecords_('Cases_Master').sort(function(left, right) {
    return toComparableDate_(right.last_touchpoint_at) - toComparableDate_(left.last_touchpoint_at);
  });
  const architectureLayers = [
    {
      step: '01',
      title: 'Access and Engagement',
      copy: 'Multilingual patient, family, and community entry pathways create low-friction access into care.',
      state: 'Live now'
    },
    {
      step: '02',
      title: 'AI Chatbot and Screening',
      copy: 'Phase 1 supports structured intake plus optional AI-assisted screening suggestions for human review.',
      state: 'Phase 1 assisted'
    },
    {
      step: '03',
      title: 'Intelligent Triage',
      copy: 'Rule-based queue prioritization helps the team identify urgent, walk-in, scheduled, and community cases early.',
      state: 'Live now'
    },
    {
      step: '04',
      title: 'Right Care, Right Time',
      copy: 'The workflow routes people into the right professional lens, service action, or escalation path.',
      state: 'Live now'
    },
    {
      step: '05',
      title: 'Multidisciplinary Care Team',
      copy: 'Shared case review and one care plan connect psychiatry, psychology, nursing, social work, and partners.',
      state: 'Live now'
    },
    {
      step: '06',
      title: 'Appointment and Follow-up',
      copy: 'Safe handoff summaries, reminders, and continuity tracking keep the post-visit path visible.',
      state: 'Live now'
    },
    {
      step: '07',
      title: 'Community Support and Recovery',
      copy: 'Public sector, NGO, and continuity loops extend support beyond the hospital through closed-loop coordination.',
      state: 'Demo-ready'
    },
    {
      step: '08',
      title: 'Data, Outcomes, and Research',
      copy: 'Dashboards and structured data create a learning loop for quality improvement, planning, and future research.',
      state: 'Live now'
    }
  ];
  const collaborationBackbone = [
    {
      label: 'WHO and UN agencies',
      value: 'Framework alignment for ethical, scalable mental health service transformation.'
    },
    {
      label: 'Universities and research',
      value: 'Supports validation, implementation learning, and future evidence generation.'
    },
    {
      label: 'Policy makers',
      value: 'Creates a pathway from service prototype to governance-ready digital model.'
    },
    {
      label: 'Training and capacity building',
      value: 'Makes the system useful for workforce strengthening, not only software deployment.'
    },
    {
      label: 'Knowledge sharing across countries',
      value: 'Positions the project as a transferable model rather than a single-site workflow.'
    }
  ];
  const phaseFocus = [
    {
      title: 'Tonight demo path',
      copy: 'Show one patient moving from intake to triage to multidisciplinary planning to safe follow-up.'
    },
    {
      title: 'What is already live',
      copy: 'Unified intake, review lenses, shared care plan, handoff summary, referral loops, follow-up tracking, and dashboards.'
    },
    {
      title: 'What stays future-phase',
      copy: 'Deeper chatbot automation, richer recovery services, and cross-country learning should scale only after validation.'
    }
  ];
  if (!master.length) {
    return Object.assign(buildEmptyEcosystemHub_(), {
      architectureLayers: architectureLayers,
      collaborationBackbone: collaborationBackbone,
      phaseFocus: phaseFocus,
      phaseStatus: 'Phase 1 MVP live',
      ecosystemLayerCount: architectureLayers.length,
      lastUpdated: formatDateTime_(new Date())
    });
  }

  const stageBuckets = {
    'Front Door': 0,
    'Shared Review': 0,
    'Shared Plan': 0,
    'Network Coordination': 0,
    'Continuity': 0
  };
  const entryMix = {};

  master.forEach(function(record) {
    const journeyStatus = sanitizeText_(record.journey_status);
    if (stageBuckets[journeyStatus] !== undefined) {
      stageBuckets[journeyStatus] += 1;
    }
    const entryPoint = sanitizeText_(record.entry_point) || 'Unspecified entry';
    entryMix[entryPoint] = (entryMix[entryPoint] || 0) + 1;
  });

  const networkOpen = master.filter(function(record) {
    return isOpenCoordinationStatus_(record.network_status);
  }).length;
  const continuityDue = master.filter(function(record) {
    return ['Pending', 'Scheduled', 'Missed', 'Escalated'].indexOf(sanitizeText_(record.follow_up_status)) !== -1;
  }).length;
  const handoffReadyCount = master.filter(function(record) {
    return ['Ready to send', 'Sent'].indexOf(sanitizeText_(record.handoff_status)) !== -1;
  }).length;
  const spotlight = master.filter(function(record) {
    return sanitizeText_(record.priority_flag) !== 'Green' || sanitizeText_(record.queue_priority) !== 'Routine';
  }).slice(0, 6).map(function(record) {
    return {
      caseId: sanitizeText_(record.case_id),
      patientCode: sanitizeText_(record.patient_code),
      stage: sanitizeText_(record.current_stage),
      journeyStatus: sanitizeText_(record.journey_status),
      priorityFlag: sanitizeText_(record.priority_flag) || 'Green',
      queuePriority: sanitizeText_(record.queue_priority) || 'Routine',
      nextAction: sanitizeText_(record.next_action),
      latestSummary: sanitizeText_(record.latest_summary),
      ownerTeam: sanitizeText_(record.owner_team)
    };
  });

  return {
    summaryCards: [
      { label: 'Shared cases', value: master.length, tone: 'blue' },
      { label: 'Front door active', value: stageBuckets['Front Door'], tone: 'teal' },
      { label: 'Shared reviews moving', value: stageBuckets['Shared Review'] + stageBuckets['Shared Plan'], tone: 'violet' },
      { label: 'Handoffs ready', value: handoffReadyCount, tone: handoffReadyCount > 0 ? 'blue' : 'teal' },
      { label: 'Network loops open', value: networkOpen, tone: networkOpen > 0 ? 'orange' : 'teal' },
      { label: 'Continuity due', value: continuityDue, tone: continuityDue > 0 ? 'red' : 'teal' }
    ],
    journeyRail: [
      { label: 'Front Door', value: stageBuckets['Front Door'] },
      { label: 'Shared Review', value: stageBuckets['Shared Review'] },
      { label: 'Shared Plan', value: stageBuckets['Shared Plan'] },
      { label: 'Network Coordination', value: stageBuckets['Network Coordination'] },
      { label: 'Continuity', value: stageBuckets['Continuity'] }
    ],
    frontDoorMix: Object.keys(entryMix).map(function(key) {
      return { label: key, value: entryMix[key] };
    }).sort(function(left, right) {
      return right.value - left.value;
    }).slice(0, 6),
    spotlight: spotlight,
    architectureLayers: architectureLayers,
    collaborationBackbone: collaborationBackbone,
    phaseFocus: phaseFocus,
    phaseStatus: 'Phase 1 MVP live',
    ecosystemLayerCount: architectureLayers.length,
    lastUpdated: formatDateTime_(new Date())
  };
}

function getCaseWorkspaceData_() {
  const master = getSheetRecords_('Cases_Master').sort(function(left, right) {
    return toComparableDate_(right.last_touchpoint_at) - toComparableDate_(left.last_touchpoint_at);
  });
  if (!master.length) {
    return buildEmptyCaseWorkspace_();
  }

  const timelineRecords = getSheetRecords_('Case_Timeline');
  const latestCheckin = indexLatestByCase_(getSheetRecords_('Patient_Checkin'), 'created_at');
  const latestClinical = indexLatestByCase_(getSheetRecords_('Clinical_Review'), 'reviewed_at');
  const latestPsychological = indexLatestByCase_(getSheetRecords_('Psychological_Review'), 'reviewed_at');
  const latestPsychosocial = indexLatestByCase_(getSheetRecords_('Psychosocial_Review'), 'reviewed_at');
  const latestPlan = indexLatestByCase_(getSheetRecords_('MDT_Care_Plan'), 'updated_at');
  const latestHandoff = indexLatestByCase_(getSheetRecords_('Minimum_Necessary_Handoff'), 'updated_at');
  const latestPublic = indexLatestByCase_(getSheetRecords_('Public_Coordination'), 'updated_at');
  const latestPrivate = indexLatestByCase_(getSheetRecords_('Private_Coordination'), 'updated_at');
  const latestFollowUp = indexLatestByCase_(getSheetRecords_('Follow_Up'), 'updated_at');

  return {
    cases: master.map(function(record) {
      const caseId = sanitizeText_(record.case_id);
      const timeline = timelineRecords.filter(function(event) {
        return sanitizeText_(event.case_id) === caseId;
      }).sort(function(left, right) {
        return toComparableDate_(right.event_at) - toComparableDate_(left.event_at);
      }).slice(0, 8).map(function(event) {
        return {
          eventAt: formatDateTime_(event.event_at),
          eventType: sanitizeText_(event.event_type),
          stage: sanitizeText_(event.stage),
          actor: sanitizeText_(event.actor),
          summary: sanitizeText_(event.summary),
          riskFlag: sanitizeText_(event.risk_flag) || 'Green',
          queuePriority: sanitizeText_(event.queue_priority)
        };
      });

      return {
        caseId: caseId,
        patientCode: sanitizeText_(record.patient_code),
        entryPoint: sanitizeText_(record.entry_point),
        currentStage: sanitizeText_(record.current_stage),
        journeyStatus: sanitizeText_(record.journey_status),
        priorityFlag: sanitizeText_(record.priority_flag) || 'Green',
        queuePriority: sanitizeText_(record.queue_priority) || 'Routine',
        ownerTeam: sanitizeText_(record.owner_team),
        nextAction: sanitizeText_(record.next_action),
        latestSummary: sanitizeText_(record.latest_summary),
        networkStatus: sanitizeText_(record.network_status),
        followUpStatus: sanitizeText_(record.follow_up_status),
        lastUpdated: formatDateTime_(record.last_touchpoint_at),
        careGoal: sanitizeText_((latestPlan[caseId] || {}).main_care_goal),
        clinicalReady: !!latestClinical[caseId],
        bprsScore: sanitizeText_((latestClinical[caseId] || {}).bprs_total_score || (latestCheckin[caseId] || {}).bprs_total_score),
        bprsInterpretation: sanitizeText_((latestClinical[caseId] || {}).bprs_interpretation || (latestCheckin[caseId] || {}).bprs_interpretation),
        psychologicalReady: !!latestPsychological[caseId],
        psychosocialReady: !!latestPsychosocial[caseId],
        carePlanReady: !!latestPlan[caseId],
        handoffStatus: sanitizeText_((latestHandoff[caseId] || {}).handoff_ready),
        consentStatus: sanitizeText_((latestHandoff[caseId] || {}).consent_status),
        handoffSummary: sanitizeText_((latestHandoff[caseId] || {}).minimum_necessary_summary),
        crisisSafetySummary: sanitizeText_((latestHandoff[caseId] || {}).crisis_safety_summary),
        doNotShare: sanitizeText_((latestHandoff[caseId] || {}).do_not_share),
        publicStatus: sanitizeText_((latestPublic[caseId] || {}).coordination_status),
        privateStatus: sanitizeText_((latestPrivate[caseId] || {}).coordination_status),
        followUpOwner: sanitizeText_((latestFollowUp[caseId] || {}).responsible_staff),
        timeline: timeline
      };
    }),
    lastUpdated: formatDateTime_(new Date())
  };
}

function getReferralNetworkData_() {
  const caseIndex = getSheetRecords_('Cases_Master').reduce(function(index, record) {
    index[sanitizeText_(record.case_id)] = record;
    return index;
  }, {});
  const latestHandoff = indexLatestByCase_(getSheetRecords_('Minimum_Necessary_Handoff'), 'updated_at');
  const latestPublic = indexLatestByCase_(getSheetRecords_('Public_Coordination'), 'updated_at');
  const latestPrivate = indexLatestByCase_(getSheetRecords_('Private_Coordination'), 'updated_at');
  const latestFollowUp = indexLatestByCase_(getSheetRecords_('Follow_Up'), 'updated_at');
  const openLoops = [];
  const handoffReadyCount = Object.keys(latestHandoff).filter(function(caseId) {
    return ['Ready to send', 'Sent'].indexOf(sanitizeText_((latestHandoff[caseId] || {}).handoff_ready)) !== -1;
  }).length;

  Object.keys(latestPublic).forEach(function(caseId) {
    const record = latestPublic[caseId];
    if (!isOpenCoordinationStatus_(record.coordination_status)) {
      return;
    }
    openLoops.push({
      caseId: caseId,
      patientCode: sanitizeText_((caseIndex[caseId] || {}).patient_code),
      lane: 'Public Sector',
      partner: sanitizeText_(record.agency_name),
      status: sanitizeText_(record.coordination_status),
      urgency: sanitizeText_(record.urgency_level),
      handoffStatus: sanitizeText_((latestHandoff[caseId] || {}).handoff_ready),
      nextAction: firstNonEmpty_(record.requested_action, record.referral_reason, 'Await partner confirmation'),
      updatedSortAt: record.updated_at,
      updatedAt: formatDateTime_(record.updated_at)
    });
  });

  Object.keys(latestPrivate).forEach(function(caseId) {
    const record = latestPrivate[caseId];
    if (!isOpenCoordinationStatus_(record.coordination_status)) {
      return;
    }
    openLoops.push({
      caseId: caseId,
      patientCode: sanitizeText_((caseIndex[caseId] || {}).patient_code),
      lane: 'Partner / NGO',
      partner: sanitizeText_(record.organization_name),
      status: sanitizeText_(record.coordination_status),
      urgency: sanitizeText_(record.urgency_level),
      handoffStatus: sanitizeText_((latestHandoff[caseId] || {}).handoff_ready),
      nextAction: firstNonEmpty_(record.requested_action, record.referral_reason, 'Await partner confirmation'),
      updatedSortAt: record.updated_at,
      updatedAt: formatDateTime_(record.updated_at)
    });
  });

  Object.keys(latestFollowUp).forEach(function(caseId) {
    const record = latestFollowUp[caseId];
    if (['Pending', 'Scheduled', 'Missed', 'Escalated'].indexOf(sanitizeText_(record.follow_up_status)) === -1) {
      return;
    }
    openLoops.push({
      caseId: caseId,
      patientCode: sanitizeText_((caseIndex[caseId] || {}).patient_code),
      lane: 'Continuity',
      partner: sanitizeText_(record.responsible_staff),
      status: sanitizeText_(record.follow_up_status),
      urgency: sanitizeText_(record.escalation_needed),
      handoffStatus: sanitizeText_((latestHandoff[caseId] || {}).handoff_ready),
      nextAction: firstNonEmpty_(record.follow_up_notes, record.referral_destination, 'Close follow-up loop'),
      updatedSortAt: record.updated_at,
      updatedAt: formatDateTime_(record.updated_at)
    });
  });

  const laneCounts = {
    'Public Sector': 0,
    'Partner / NGO': 0,
    'Continuity': 0
  };
  openLoops.forEach(function(item) {
    laneCounts[item.lane] += 1;
  });

  return {
    summaryCards: [
      { label: 'Open loops', value: openLoops.length, tone: openLoops.length ? 'orange' : 'teal' },
      { label: 'Handoffs ready', value: handoffReadyCount, tone: handoffReadyCount ? 'blue' : 'teal' },
      { label: 'Public sector', value: laneCounts['Public Sector'], tone: 'blue' },
      { label: 'Partner / NGO', value: laneCounts['Partner / NGO'], tone: 'violet' },
      { label: 'Continuity', value: laneCounts['Continuity'], tone: laneCounts['Continuity'] ? 'red' : 'teal' }
    ],
    lanes: Object.keys(laneCounts).map(function(key) {
      return { label: key, value: laneCounts[key] };
    }),
    openLoops: openLoops.sort(function(left, right) {
      return toComparableDate_(right.updatedSortAt) - toComparableDate_(left.updatedSortAt);
    }),
    lastUpdated: formatDateTime_(new Date())
  };
}

function refreshDashboardSheet_() {
  const dashboard = getDashboardData_();
  const sheet = getSheet_('Dashboard');
  const rows = [];
  const now = new Date();

  dashboard.summaryCards.forEach(function(card) {
    rows.push(['summary', card.label, card.value, now, card.tone || '']);
  });
  dashboard.workflowCoverage.forEach(function(item) {
    rows.push(['workflow_coverage', item.label, item.value, now, '']);
  });
  dashboard.arrivalMix.forEach(function(item) {
    rows.push(['arrival_mix', item.label, item.value, now, '']);
  });
  dashboard.networkOverview.forEach(function(item) {
    rows.push(['network_overview', item.label, item.value, now, '']);
  });
  dashboard.aiMonitoring.forEach(function(item) {
    rows.push(['ai_monitoring', item.label, item.value, now, '']);
  });
  dashboard.biasWatch.forEach(function(item) {
    rows.push(['bias_watch', item.label, item.value, now, item.notes || '']);
  });
  dashboard.commonRiskFactors.forEach(function(item) {
    rows.push(['common_risk_factors', item.label, item.value, now, '']);
  });
  dashboard.triageQueue.forEach(function(item) {
    rows.push(['triage_queue', item.patientCode, item.queuePriority, now, item.visitPurpose + ' | ' + item.telegramStatus]);
  });
  dashboard.recentFlags.forEach(function(item) {
    rows.push(['recent_flags', item.patientCode, item.riskFlag, now, item.riskReasons]);
  });

  sheet.clear();
  sheet.getRange(1, 1, 1, SHEET_SCHEMAS.Dashboard.length).setValues([SHEET_SCHEMAS.Dashboard]);
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, SHEET_SCHEMAS.Dashboard.length).setValues(rows);
  }
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, SHEET_SCHEMAS.Dashboard.length);
}

function getCaseOptions_() {
  const sourceRecords = getSheetRecords_('Patient_Checkin')
    .concat(getSheetRecords_('Service_Followup'))
    .concat(getSheetRecords_('Community_Referral'));

  return sourceRecords.sort(function(left, right) {
    return toComparableDate_(right.created_at || right.requested_at || right.referred_at) -
      toComparableDate_(left.created_at || left.requested_at || left.referred_at);
  }).map(function(record) {
    const patientCode = sanitizeText_(record.patient_code) || sanitizeText_(record.case_id);
    const summary = sanitizeText_(record.main_concern || record.reason_for_referral || record.service_type || 'Case');
    return {
      value: sanitizeText_(record.case_id),
      label: patientCode + ' - ' + summary
    };
  }).filter(function(option) {
    return !!option.value;
  }).filter(function(option, index, all) {
    return all.findIndex(function(item) {
      return item.value === option.value;
    }) === index;
  });
}

function getStaffOptions_() {
  return getSheetRecords_('Users').filter(function(record) {
    return String(record.active).toLowerCase() === 'yes' &&
      normalizePortalType_(record.allowed_portal) === 'staff';
  }).map(function(record) {
    return {
      value: sanitizeText_(record.display_name),
      label: sanitizeText_(record.display_name) + ' - ' + sanitizeText_(record.profession)
    };
  });
}

function getCurrentOverallRisk_(caseId) {
  const records = [
    indexLatestByCase_(getSheetRecords_('Patient_Checkin'), 'created_at')[caseId],
    indexLatestByCase_(getSheetRecords_('Service_Followup'), 'requested_at')[caseId],
    indexLatestByCase_(getSheetRecords_('Community_Referral'), 'referred_at')[caseId],
    indexLatestByCase_(getSheetRecords_('Clinical_Review'), 'reviewed_at')[caseId],
    indexLatestByCase_(getSheetRecords_('Psychological_Review'), 'reviewed_at')[caseId],
    indexLatestByCase_(getSheetRecords_('Psychosocial_Review'), 'reviewed_at')[caseId],
    indexLatestByCase_(getSheetRecords_('Follow_Up'), 'updated_at')[caseId]
  ].filter(Boolean);

  return maxRiskFlag_(records.map(function(record) {
    return record.risk_flag;
  }));
}

function queueAlertForRecord_(sourceLabel, sourceRecord) {
  const queuePriority = determineQueuePriority_(sourceRecord);
  const alertRecord = {
    queued_at: new Date(),
    case_id: sanitizeText_(sourceRecord.case_id),
    patient_code: sanitizeText_(sourceRecord.patient_code),
    informant_type: sanitizeText_(sourceRecord.informant_type || sourceRecord.requester_type || sourceRecord.informant_name || sourceLabel),
    visit_purpose: sanitizeText_(sourceRecord.visit_purpose || sourceRecord.service_type || sourceLabel),
    queue_priority: queuePriority,
    risk_flag: sanitizeText_(sourceRecord.risk_flag) || 'Green',
    triage_destination: sanitizeText_(sourceRecord.triage_destination || sourceRecord.recommended_service),
    triage_urgency: sanitizeText_(sourceRecord.triage_urgency || sourceRecord.urgency_level || queuePriority),
    bprs_total_score: sanitizeText_(sourceRecord.bprs_total_score),
    bprs_interpretation: sanitizeText_(sourceRecord.bprs_interpretation),
    summary: buildAlertSummary_(sourceLabel, sourceRecord),
    telegram_status: '',
    telegram_response: '',
    handled_status: 'Pending'
  };

  const telegramResult = sendTelegramAlert_(alertRecord);
  alertRecord.telegram_status = telegramResult.status;
  alertRecord.telegram_response = telegramResult.response;
  appendRecord_('Alert_Queue', alertRecord);

  return {
    queued: true,
    priority: queuePriority,
    telegramStatus: telegramResult.status,
    message: queuePriority === 'Immediate'
      ? sourceLabel + ' submitted and urgent alert queued.'
      : sourceLabel + ' submitted and routed to the staff triage queue.'
  };
}

function determineQueuePriority_(record) {
  if (sanitizeText_(record.risk_flag) === 'Red' ||
    matchesAny_(record.visit_purpose, ['ER urgent (ER ด่วน)']) ||
    matchesAny_(record.triage_urgency, ['Immediate']) ||
    matchesAny_(record.urgency_level, ['Immediate'])) {
    return 'Immediate';
  }

  if (sanitizeText_(record.risk_flag) === 'Orange' ||
    matchesAny_(record.triage_urgency, ['Priority']) ||
    matchesAny_(record.urgency_level, ['Priority']) ||
    matchesAny_(record.distress_level, ['High', 'Severe'])) {
    return 'Priority';
  }

  return 'Routine';
}

function buildAlertSummary_(sourceLabel, record) {
  const summaryParts = [
    sourceLabel,
    sanitizeText_(record.reason_for_visit || record.service_type || record.reason_for_referral),
    sanitizeText_(record.main_concern),
    sanitizeText_(record.current_symptoms),
    sanitizeText_(record.triage_destination),
    sanitizeText_(record.bprs_interpretation),
    sanitizeText_(record.risk_flag)
  ].filter(Boolean);
  return truncateText_(summaryParts.join(' | '), 280);
}

function sendTelegramAlert_(alertRecord) {
  if (!TELEGRAM_NOTIFICATIONS_ENABLED) {
    return {
      status: 'Disabled',
      response: 'Telegram notifications are not enabled in Code.gs.'
    };
  }

  if (!sanitizeText_(TELEGRAM_BOT_TOKEN) || !sanitizeText_(TELEGRAM_CHAT_ID)) {
    return {
      status: 'Config missing',
      response: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID.'
    };
  }

  const url = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage';
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: buildTelegramAlertMessage_(alertRecord)
  };

  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    const statusCode = response.getResponseCode();
    const body = truncateText_(response.getContentText(), 500);
    return {
      status: statusCode >= 200 && statusCode < 300 ? 'Sent' : 'Failed',
      response: 'HTTP ' + statusCode + ': ' + body
    };
  } catch (error) {
    return {
      status: 'Error',
      response: truncateText_(error && error.message ? error.message : String(error), 500)
    };
  }
}

function buildTelegramAlertMessage_(alertRecord) {
  const bprsSummary = [
    sanitizeText_(alertRecord.bprs_total_score),
    sanitizeText_(alertRecord.bprs_interpretation)
  ].filter(Boolean).join(' - ') || 'Not recorded';
  const lines = [
    'Mental Health Coordination Alert',
    'Priority: ' + sanitizeText_(alertRecord.queue_priority),
    'Patient code: ' + sanitizeText_(alertRecord.patient_code),
    'Case ID: ' + sanitizeText_(alertRecord.case_id),
    'Source: ' + sanitizeText_(alertRecord.informant_type),
    'Route: ' + sanitizeText_(alertRecord.visit_purpose),
    'Risk flag: ' + sanitizeText_(alertRecord.risk_flag),
    'BPRS: ' + bprsSummary,
    'Matched service: ' + sanitizeText_(alertRecord.triage_destination),
    'Triage urgency: ' + sanitizeText_(alertRecord.triage_urgency),
    'Summary: ' + sanitizeText_(alertRecord.summary),
    'Queued at: ' + formatDateTime_(alertRecord.queued_at)
  ];
  return lines.join('\n');
}

function runAIAssistedScreening_(formKey, payload, caseId, patientCode, ruleEvaluation) {
  const sourceSummary = buildAIInputSummary_(formKey, payload);
  let screeningStatus = 'disabled';
  let aiResult = buildLocalFallbackAIScreening_(payload, ruleEvaluation, 'AI disabled; local validation only.');

  if (AI_ASSIST_ENABLED) {
    const apiKey = getAIAPIKey_();
    if (!apiKey) {
      screeningStatus = 'missing_api_key';
      aiResult = buildLocalFallbackAIScreening_(payload, ruleEvaluation, 'AI key missing; local validation only.');
    } else {
      try {
        aiResult = callOpenAIAssistedScreening_(apiKey, formKey, payload, ruleEvaluation);
        screeningStatus = 'live_openai';
      } catch (error) {
        screeningStatus = 'api_error';
        aiResult = buildLocalFallbackAIScreening_(payload, ruleEvaluation, 'AI call failed; local validation only.');
        aiResult.rawOutput = truncateText_(error && error.message ? error.message : String(error), 500);
      }
    }
  }

  const aiPriorityFlag = normalizePriorityFlag_(aiResult.aiPriorityFlag || ruleEvaluation.flag);
  const priorityForReview = maxRiskFlag_([ruleEvaluation.flag, aiPriorityFlag]);
  const agreementStatus = aiPriorityFlag === ruleEvaluation.flag
    ? 'Match'
    : getRiskRank_(aiPriorityFlag) > getRiskRank_(ruleEvaluation.flag)
      ? 'AI higher'
      : 'Rule higher';
  const humanReviewRequired = (priorityForReview !== 'Green' || agreementStatus !== 'Match') ? 'Yes' : 'No';
  const monitorGroup = buildBiasMonitorGroup_(formKey, payload);
  const biasWatchStatus = determineBiasWatchStatus_(screeningStatus, agreementStatus);
  const validationStatus = screeningStatus === 'live_openai'
    ? 'AI suggested and locally validated'
    : screeningStatus === 'api_error'
      ? 'AI error; local validation fallback'
      : screeningStatus === 'missing_api_key'
        ? 'AI key missing; local validation fallback'
        : 'Local validation only';

  const logRecord = {
    screened_at: new Date(),
    case_id: caseId,
    patient_code: patientCode,
    source_form: formKey,
    screening_status: screeningStatus,
    ai_provider: AI_PROVIDER,
    ai_model: AI_MODEL,
    local_rule_flag: ruleEvaluation.flag,
    ai_priority_flag: aiPriorityFlag,
    priority_for_review: priorityForReview,
    agreement_status: agreementStatus,
    ai_confidence: normalizeAIConfidence_(aiResult.aiConfidence),
    human_review_required: humanReviewRequired,
    monitor_group: monitorGroup,
    bias_watch_status: biasWatchStatus,
    ai_summary: truncateText_(aiResult.aiSummary || sourceSummary, 280),
    ai_reasons: uniqueValues_(aiResult.aiReasons || []).join(', '),
    triage_destination: sanitizeText_(aiResult.triageDestination),
    recommended_service: sanitizeText_(aiResult.recommendedService),
    triage_urgency: sanitizeText_(aiResult.triageUrgency),
    emergency_action: truncateText_(aiResult.emergencyAction, 280),
    raw_output: truncateText_(aiResult.rawOutput || sourceSummary, 500)
  };
  appendRecord_('AI_Screening_Log', logRecord);

  return {
    screeningStatus: screeningStatus,
    aiProvider: AI_PROVIDER,
    aiModel: AI_MODEL,
    aiPriorityFlag: aiPriorityFlag,
    aiConfidence: normalizeAIConfidence_(aiResult.aiConfidence),
    aiSummary: logRecord.ai_summary,
    aiReasons: uniqueValues_(aiResult.aiReasons || []),
    triageDestination: sanitizeText_(aiResult.triageDestination),
    recommendedService: sanitizeText_(aiResult.recommendedService),
    triageUrgency: sanitizeText_(aiResult.triageUrgency),
    emergencyAction: sanitizeText_(aiResult.emergencyAction),
    selfHelpGuidance: sanitizeText_(aiResult.selfHelpGuidance),
    mdtFocus: sanitizeText_(aiResult.mdtFocus),
    communitySupportSignal: sanitizeText_(aiResult.communitySupportSignal),
    followUpWindow: sanitizeText_(aiResult.followUpWindow),
    priorityForReview: priorityForReview,
    agreementStatus: agreementStatus,
    humanReviewRequired: humanReviewRequired,
    biasWatchStatus: biasWatchStatus,
    validationStatus: validationStatus
  };
}

function callOpenAIAssistedScreening_(apiKey, formKey, payload, ruleEvaluation) {
  const developerInstruction = [
    'You are an assistive screening model for mental health intake coordination.',
    'You do not diagnose, and you do not make automatic clinical decisions.',
    'Return only a JSON object with keys ai_priority_flag, ai_confidence, ai_summary, ai_reasons, bias_watch_note, triage_destination, recommended_service, triage_urgency, emergency_action, self_help_guidance, mdt_focus, community_support_signal, follow_up_window.',
    'Allowed ai_priority_flag values: Green, Yellow, Orange, Red.',
    'Allowed ai_confidence values: Low, Moderate, High.',
    'Allowed triage_urgency values: Routine, Priority, Immediate.',
    'ai_reasons must be an array of short strings.',
    'triage_destination should be one of: Emergency services, Psychiatrist, Psychologist, GP / Primary care, MDT social support, Community recovery support.',
    'recommended_service should be a short service match sentence.',
    'emergency_action should be a short actionable crisis instruction.',
    'self_help_guidance should be a short psychoeducation or self-help message in the preferred language if provided.',
    'mdt_focus should be a short phrase describing the multidisciplinary team priority.',
    'community_support_signal should be Yes or No.',
    'follow_up_window should be a short timing phrase such as Same day, Within 24 hours, Within 72 hours, or Routine follow-up.',
    'If there are suicide, self-harm, violence, abuse, or acute safety signals, be conservative in the priority suggestion.'
  ].join(' ');
  const userInput = [
    'Form: ' + formKey,
    'Local rule flag: ' + ruleEvaluation.flag,
    'Local rule reasons: ' + ruleEvaluation.reasons.join(', '),
    'Structured case data:',
    buildAIInputSummary_(formKey, payload)
  ].join('\n');

  const response = UrlFetchApp.fetch('https://api.openai.com/v1/responses', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + apiKey
    },
    payload: JSON.stringify({
      model: AI_MODEL,
      input: [
        { role: 'developer', content: developerInstruction },
        { role: 'user', content: userInput }
      ]
    }),
    muteHttpExceptions: true
  });

  const statusCode = response.getResponseCode();
  const body = response.getContentText();
  if (statusCode < 200 || statusCode >= 300) {
    throw new Error('OpenAI screening request failed with HTTP ' + statusCode + ': ' + truncateText_(body, 300));
  }

  const parsedResponse = JSON.parse(body);
  const outputText = extractResponseOutputText_(parsedResponse);
  const jsonText = extractJsonBlock_(outputText);
  const aiPayload = JSON.parse(jsonText);

  return {
    aiPriorityFlag: normalizePriorityFlag_(aiPayload.ai_priority_flag),
    aiConfidence: normalizeAIConfidence_(aiPayload.ai_confidence),
    aiSummary: sanitizeText_(aiPayload.ai_summary),
    aiReasons: normalizeReasonArray_(aiPayload.ai_reasons),
    triageDestination: sanitizeText_(aiPayload.triage_destination),
    recommendedService: sanitizeText_(aiPayload.recommended_service),
    triageUrgency: normalizeTriageUrgency_(aiPayload.triage_urgency),
    emergencyAction: sanitizeText_(aiPayload.emergency_action),
    selfHelpGuidance: sanitizeText_(aiPayload.self_help_guidance),
    mdtFocus: sanitizeText_(aiPayload.mdt_focus),
    communitySupportSignal: normalizeYesNo_(aiPayload.community_support_signal),
    followUpWindow: sanitizeText_(aiPayload.follow_up_window),
    rawOutput: truncateText_(outputText, 500),
    biasWatchNote: sanitizeText_(aiPayload.bias_watch_note)
  };
}

function buildLocalFallbackAIScreening_(payload, ruleEvaluation, summaryText) {
  const reasons = uniqueValues_(ruleEvaluation.reasons.concat(buildKeywordScreeningReasons_(payload)));
  const triageDecision = buildLocalTriageDecision_(payload, ruleEvaluation.flag);
  return {
    aiPriorityFlag: ruleEvaluation.flag,
    aiConfidence: ruleEvaluation.flag === 'Green' ? 'Low' : 'Moderate',
    aiSummary: summaryText,
    aiReasons: reasons.length ? reasons : ['Local validation only'],
    triageDestination: triageDecision.triageDestination,
    recommendedService: triageDecision.recommendedService,
    triageUrgency: triageDecision.triageUrgency,
    emergencyAction: triageDecision.emergencyAction,
    selfHelpGuidance: triageDecision.selfHelpGuidance,
    mdtFocus: triageDecision.mdtFocus,
    communitySupportSignal: triageDecision.communitySupportSignal,
    followUpWindow: triageDecision.followUpWindow,
    rawOutput: summaryText
  };
}

function buildKeywordScreeningReasons_(payload) {
  const text = [
    payload.main_concern,
    payload.current_symptoms,
    payload.chatbot_transcript,
    payload.additional_notes,
    payload.reason_for_referral,
    payload.observed_behavior,
    payload.caregiver_concern,
    payload.social_problem
  ].map(function(item) {
    return sanitizeText_(item).toLowerCase();
  }).join(' ');
  const reasons = [];
  if (text.indexOf('suicide') !== -1 || text.indexOf('self-harm') !== -1) {
    reasons.push('Narrative self-harm concern');
  }
  if (text.indexOf('violent') !== -1 || text.indexOf('aggressive') !== -1) {
    reasons.push('Narrative violence concern');
  }
  if (text.indexOf('abuse') !== -1) {
    reasons.push('Narrative abuse concern');
  }
  if (text.indexOf('housing') !== -1 || text.indexOf('homeless') !== -1) {
    reasons.push('Narrative housing concern');
  }
  if (text.indexOf('debt') !== -1 || text.indexOf('financial') !== -1) {
    reasons.push('Narrative financial stress');
  }
  if (text.indexOf('relapse') !== -1 || text.indexOf('stopped medication') !== -1 || text.indexOf('not taking medication') !== -1) {
    reasons.push('Narrative relapse concern');
  }
  return reasons;
}

function toClientAIScreening_(aiScreening) {
  return {
    screeningStatus: aiScreening.screeningStatus,
    aiProvider: aiScreening.aiProvider,
    aiModel: aiScreening.aiModel,
    aiPriorityFlag: aiScreening.aiPriorityFlag,
    aiConfidence: aiScreening.aiConfidence,
    aiSummary: aiScreening.aiSummary,
    aiReasons: aiScreening.aiReasons,
    triageDestination: aiScreening.triageDestination,
    recommendedService: aiScreening.recommendedService,
    triageUrgency: aiScreening.triageUrgency,
    emergencyAction: aiScreening.emergencyAction,
    selfHelpGuidance: aiScreening.selfHelpGuidance,
    mdtFocus: aiScreening.mdtFocus,
    communitySupportSignal: aiScreening.communitySupportSignal,
    followUpWindow: aiScreening.followUpWindow,
    priorityForReview: aiScreening.priorityForReview,
    agreementStatus: aiScreening.agreementStatus,
    humanReviewRequired: aiScreening.humanReviewRequired,
    biasWatchStatus: aiScreening.biasWatchStatus,
    validationStatus: aiScreening.validationStatus
  };
}

function buildAIInputSummary_(formKey, payload) {
  const allowedFields = Object.keys(payload || {}).reduce(function(result, key) {
    const value = sanitizeText_(payload[key]);
    if (value) {
      result[key] = value;
    }
    return result;
  }, {});
  return JSON.stringify({
    source_form: formKey,
    structured_fields: allowedFields
  });
}

function buildBiasMonitorGroup_(formKey, payload) {
  const parts = [
    formKey,
    'informant=' + sanitizeText_(payload.informant_type || payload.requester_type || payload.relationship_to_patient || 'n/a'),
    'visit=' + sanitizeText_(payload.visit_purpose || payload.service_type || 'n/a'),
    'coverage=' + sanitizeText_(payload.payment_coverage || 'n/a'),
    'support=' + sanitizeText_(payload.family_caregiver_support || 'n/a')
  ];
  return parts.join(' | ');
}

function determineBiasWatchStatus_(screeningStatus, agreementStatus) {
  if (screeningStatus !== 'live_openai') {
    return 'Local monitor';
  }
  if (agreementStatus !== 'Match') {
    return 'Watch';
  }
  return 'Routine';
}

function buildBiasWatchItems_(aiLogs) {
  const grouped = {};
  aiLogs.filter(function(record) {
    return sanitizeText_(record.agreement_status) !== 'Match';
  }).forEach(function(record) {
    const key = sanitizeText_(record.monitor_group) || 'Unspecified group';
    if (!grouped[key]) {
      grouped[key] = { total: 0, live: 0, disagreements: 0 };
    }
    grouped[key].total += 1;
    if (sanitizeText_(record.screening_status) === 'live_openai') {
      grouped[key].live += 1;
    }
    grouped[key].disagreements += 1;
  });

  return Object.keys(grouped).map(function(key) {
    return {
      label: key,
      value: grouped[key].disagreements,
      notes: 'Disagreements logged: ' + grouped[key].disagreements + ', live AI calls: ' + grouped[key].live
    };
  }).sort(function(left, right) {
    return right.value - left.value;
  }).slice(0, 4);
}

function getAIAPIKey_() {
  return sanitizeText_(PropertiesService.getScriptProperties().getProperty(AI_API_KEY_PROPERTY));
}

function extractResponseOutputText_(responseJson) {
  if (sanitizeText_(responseJson.output_text)) {
    return sanitizeText_(responseJson.output_text);
  }
  const output = responseJson.output || [];
  for (var i = 0; i < output.length; i += 1) {
    const content = output[i].content || [];
    for (var j = 0; j < content.length; j += 1) {
      if (content[j].type === 'output_text' && sanitizeText_(content[j].text)) {
        return sanitizeText_(content[j].text);
      }
    }
  }
  throw new Error('OpenAI response did not include output text.');
}

function extractJsonBlock_(value) {
  const text = sanitizeText_(value);
  const matched = text.match(/\{[\s\S]*\}/);
  if (!matched) {
    throw new Error('AI output was not valid JSON.');
  }
  return matched[0];
}

function normalizePriorityFlag_(value) {
  const normalized = sanitizeText_(value).toLowerCase();
  if (normalized === 'red') {
    return 'Red';
  }
  if (normalized === 'orange') {
    return 'Orange';
  }
  if (normalized === 'yellow') {
    return 'Yellow';
  }
  return 'Green';
}

function normalizeAIConfidence_(value) {
  const normalized = sanitizeText_(value).toLowerCase();
  if (normalized === 'high') {
    return 'High';
  }
  if (normalized === 'moderate') {
    return 'Moderate';
  }
  return 'Low';
}

function normalizeTriageUrgency_(value) {
  const normalized = sanitizeText_(value).toLowerCase();
  if (normalized === 'immediate' || normalized === 'urgent') {
    return 'Immediate';
  }
  if (normalized === 'priority' || normalized === 'within 24 hours') {
    return 'Priority';
  }
  return 'Routine';
}

function normalizeYesNo_(value) {
  return sanitizeText_(value).toLowerCase() === 'yes' ? 'Yes' : 'No';
}

function normalizeReasonArray_(value) {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.map(function(item) {
      return sanitizeText_(item);
    }).filter(Boolean);
  }
  return splitReasonList_(value);
}

function mergeScreeningReasons_(ruleReasons, aiReasons) {
  const merged = uniqueValues_((ruleReasons || []).concat(aiReasons || []).filter(Boolean));
  return merged.length > 1
    ? merged.filter(function(item) { return item !== 'No urgent risk'; })
    : merged;
}

function findLatestCaseIdByPatientCode_(patientCode) {
  const target = sanitizeText_(patientCode).toUpperCase();
  const sourceRecords = getSheetRecords_('Patient_Checkin')
    .concat(getSheetRecords_('Service_Followup'))
    .concat(getSheetRecords_('Community_Referral'));

  const match = sourceRecords.sort(function(left, right) {
    return toComparableDate_(right.created_at || right.requested_at || right.referred_at) -
      toComparableDate_(left.created_at || left.requested_at || left.referred_at);
  }).find(function(record) {
    return sanitizeText_(record.patient_code).toUpperCase() === target;
  });
  return match ? sanitizeText_(match.case_id) : '';
}

function getPreferredLanguage_(payload) {
  const preferredLanguage = sanitizeText_(payload.preferred_language);
  return preferredLanguage || 'English';
}

function buildLocalizedSupportMessage_(preferredLanguage, severity) {
  const language = sanitizeText_(preferredLanguage).toLowerCase();
  if (language === 'thai') {
    return severity === 'high'
      ? 'กรุณาอย่าอยู่ลำพัง ติดต่อผู้ดูแลหรือหน่วยฉุกเฉินใกล้ที่สุดทันที และนำข้อมูลนี้ไปพบทีมสุขภาพจิตโดยเร็ว'
      : 'โปรดพักผ่อน หายใจช้า ๆ ติดต่อคนที่ไว้ใจได้ และนัดติดตามกับทีมสุขภาพจิตหรือบริการใกล้บ้านตามความเหมาะสม';
  }
  if (language === 'chinese (simplified)') {
    return severity === 'high'
      ? '请不要独处，立即联系照护者或最近的急诊服务，并尽快把这份结果交给精神健康团队处理。'
      : '请先休息，缓慢呼吸，联系可信赖的人，并按需要预约精神健康或社区服务随访。';
  }
  if (language === 'hindi') {
    return severity === 'high'
      ? 'कृपया अकेले न रहें, तुरंत अपने देखभालकर्ता या निकटतम आपात सेवा से संपर्क करें, और यह परिणाम मानसिक स्वास्थ्य टीम को तुरंत दिखाएँ।'
      : 'कृपया आराम करें, धीरे-धीरे साँस लें, किसी विश्वसनीय व्यक्ति से संपर्क करें, और जरूरत के अनुसार मानसिक स्वास्थ्य फॉलो-अप लें।';
  }
  if (language === 'urdu') {
    return severity === 'high'
      ? 'براہ کرم اکیلے نہ رہیں، فوراً اپنے نگہداشت کرنے والے یا قریبی ہنگامی سروس سے رابطہ کریں، اور یہ نتیجہ ذہنی صحت کی ٹیم کو فوری دکھائیں۔'
      : 'براہ کرم آرام کریں، آہستہ سانس لیں، کسی قابلِ اعتماد فرد سے رابطہ کریں، اور ضرورت کے مطابق ذہنی صحت فالو اپ لیں۔';
  }
  return severity === 'high'
    ? 'Please do not stay alone. Contact a caregiver or local emergency service now and bring this screening result to a mental health professional immediately.'
    : 'Take a pause, use slow breathing, contact a trusted person, and arrange mental health follow-up or community support based on this screening result.';
}

function buildLocalizedEmergencyMessage_(preferredLanguage) {
  const language = sanitizeText_(preferredLanguage).toLowerCase();
  if (language === 'thai') {
    return 'หากมีความเสี่ยงฆ่าตัวตาย ทำร้ายตนเอง หรือความรุนแรง ให้ไปห้องฉุกเฉินหรือโทรขอความช่วยเหลือฉุกเฉินทันที';
  }
  if (language === 'chinese (simplified)') {
    return '如存在自杀、自伤或暴力风险，请立即前往急诊或联系当地急救服务。';
  }
  if (language === 'hindi') {
    return 'यदि आत्महत्या, स्वयं को नुकसान पहुँचाने या हिंसा का जोखिम हो तो तुरंत आपात विभाग जाएँ या स्थानीय आपात सेवा को कॉल करें।';
  }
  if (language === 'urdu') {
    return 'اگر خودکشی، خود کو نقصان پہنچانے یا تشدد کا خطرہ ہو تو فوراً ایمرجنسی میں جائیں یا مقامی ہنگامی سروس سے رابطہ کریں۔';
  }
  return 'If there is suicide, self-harm, or violence risk, go to the nearest emergency service or contact local emergency responders immediately.';
}

function buildLocalTriageDecision_(payload, priorityFlag) {
  const preferredLanguage = getPreferredLanguage_(payload);
  const bprsScore = normalizeOptionalIntegerInRange_(payload.bprs_total_score, 18, 126, 'BPRS 18-item total score');
  if (priorityFlag === 'Red') {
    return {
      triageDestination: 'Emergency services',
      recommendedService: 'Immediate emergency mental health review and psychiatrist notification',
      triageUrgency: 'Immediate',
      emergencyAction: buildLocalizedEmergencyMessage_(preferredLanguage),
      selfHelpGuidance: buildLocalizedSupportMessage_(preferredLanguage, 'high'),
      mdtFocus: 'Psychiatrist, nurse, psychologist, and crisis social support',
      communitySupportSignal: 'Yes',
      followUpWindow: 'Same day'
    };
  }
  if (priorityFlag === 'Orange' || bprsScore > 40) {
    return {
      triageDestination: matchesAny_(payload.reason_for_visit, ['See psychologist']) ? 'Psychologist' : 'Psychiatrist',
      recommendedService: 'Priority specialist review with shared MDT planning',
      triageUrgency: 'Priority',
      emergencyAction: 'Escalate if safety risk increases before the appointment.',
      selfHelpGuidance: buildLocalizedSupportMessage_(preferredLanguage, 'medium'),
      mdtFocus: matchesAny_(payload.barrier_to_care, ['Housing', 'Cost', 'Stigma']) ? 'Psychiatrist plus social work support' : 'Psychiatrist plus psychological review',
      communitySupportSignal: matchesAny_(payload.barrier_to_care, ['Housing', 'Cost', 'Stigma']) ? 'Yes' : 'No',
      followUpWindow: 'Within 24 hours'
    };
  }
  if (matchesAny_(payload.reason_for_visit, ['See psychologist'])) {
    return {
      triageDestination: 'Psychologist',
      recommendedService: 'Psychological assessment, therapy triage, and psychoeducation',
      triageUrgency: 'Routine',
      emergencyAction: 'Seek urgent help if self-harm, violence, or severe deterioration appears.',
      selfHelpGuidance: buildLocalizedSupportMessage_(preferredLanguage, 'low'),
      mdtFocus: 'Psychology-led support with MDT escalation if risk changes',
      communitySupportSignal: 'No',
      followUpWindow: 'Within 72 hours'
    };
  }
  if (matchesAny_(payload.barrier_to_care, ['Housing', 'Cost', 'Stigma']) || matchesAny_(payload.family_caregiver_support, ['No caregiver available'])) {
    return {
      triageDestination: 'MDT social support',
      recommendedService: 'Psychiatric social work and community support coordination',
      triageUrgency: priorityFlag === 'Yellow' ? 'Priority' : 'Routine',
      emergencyAction: 'Escalate to emergency care if safety concerns become active.',
      selfHelpGuidance: buildLocalizedSupportMessage_(preferredLanguage, 'low'),
      mdtFocus: 'Social worker, peer support, and community recovery linkage',
      communitySupportSignal: 'Yes',
      followUpWindow: priorityFlag === 'Yellow' ? 'Within 24 hours' : 'Within 72 hours'
    };
  }
  return {
    triageDestination: 'GP / Primary care',
    recommendedService: 'Routine mental health review with psychoeducation and follow-up',
    triageUrgency: priorityFlag === 'Yellow' ? 'Priority' : 'Routine',
    emergencyAction: 'Seek urgent review if symptoms escalate or safety changes.',
    selfHelpGuidance: buildLocalizedSupportMessage_(preferredLanguage, 'low'),
    mdtFocus: 'Primary care with MDT backup if new risks appear',
    communitySupportSignal: 'No',
    followUpWindow: priorityFlag === 'Yellow' ? 'Within 24 hours' : 'Routine follow-up'
  };
}

function evaluateRiskFlag_(formKey, payload) {
  const reasons = { red: [], orange: [], yellow: [] };

  if (formKey === 'Patient_Checkin') {
    const bprsScore = normalizeOptionalIntegerInRange_(payload.bprs_total_score, 18, 126, 'BPRS 18-item total score');
    if (matchesAny_(payload.visit_purpose, ['ER urgent (ER ด่วน)'])) {
      reasons.red.push('ER urgent presentation');
    }
    if (matchesAny_(payload.safety_concern, ['Urgent', 'Suicide/Self-harm concern']) ||
      containsKeyword_(payload.current_symptoms, ['suicide', 'self-harm', 'attempt']) ||
      containsKeyword_(payload.chatbot_transcript, ['suicide', 'self-harm', 'attempt'])) {
      reasons.red.push('Suicide/self-harm concern');
    }
    if (containsKeyword_(payload.current_symptoms, ['violent', 'aggressive']) ||
      containsKeyword_(payload.chatbot_transcript, ['violent', 'aggressive', 'attack'])) {
      reasons.red.push('Violence concern');
    }
    if (bprsScore > 60) {
      reasons.red.push('Very severe BPRS symptom burden');
    }
    if (matchesAny_(payload.family_caregiver_support, ['No caregiver available'])) {
      reasons.orange.push('No caregiver support');
    }
    if (matchesAny_(payload.barrier_to_care, ['Housing'])) {
      reasons.orange.push('Housing problem');
    }
    if (matchesAny_(payload.distress_level, ['High', 'Severe'])) {
      reasons.orange.push('High distress level');
    }
    if (bprsScore > 40 && bprsScore <= 60) {
      reasons.orange.push('Moderate to severe BPRS symptom burden');
    }
    if (matchesAny_(payload.barrier_to_care, ['Transportation', 'Cost', 'Stigma'])) {
      reasons.yellow.push(sanitizeText_(payload.barrier_to_care) + ' barrier to care');
    }
    if (bprsScore >= 31 && bprsScore <= 40) {
      reasons.yellow.push('Mild to moderate BPRS clinical significance');
    }
  }

  if (formKey === 'Service_Followup') {
    if (matchesAny_(payload.urgency_level, ['Immediate'])) {
      reasons.red.push('Immediate service review needed');
    }
    if (containsKeyword_(payload.current_symptoms, ['suicide', 'self-harm', 'violent'])) {
      reasons.red.push('Acute symptom concern');
    }
    if (matchesAny_(payload.medication_need, ['Out of medication'])) {
      reasons.orange.push('Out of medication');
    }
    if (matchesAny_(payload.today_support_needed, ['Urgent review'])) {
      reasons.orange.push('Urgent clinical review requested');
    }
    if (containsKeyword_(payload.social_problem, ['debt', 'housing', 'abuse'])) {
      reasons.orange.push('Active social problem');
    }
    if (matchesAny_(payload.urgency_level, ['Priority'])) {
      reasons.yellow.push('Priority follow-up request');
    }
  }

  if (formKey === 'Community_Referral') {
    if (matchesAny_(payload.safety_concern, ['Urgent', 'Suicide/Self-harm concern']) ||
      containsKeyword_(payload.observed_behavior, ['suicide', 'violent', 'aggressive']) ||
      containsKeyword_(payload.current_symptoms, ['suicide', 'violent', 'aggressive'])) {
      reasons.red.push('High-risk community referral');
    }
    if (matchesAny_(payload.family_caregiver_support, ['No caregiver available'])) {
      reasons.orange.push('No caregiver support');
    }
    if (matchesAny_(payload.barrier_to_care, ['Housing'])) {
      reasons.orange.push('Housing problem');
    }
    if (matchesAny_(payload.barrier_to_care, ['Transportation', 'Cost', 'Stigma'])) {
      reasons.yellow.push(sanitizeText_(payload.barrier_to_care) + ' barrier to care');
    }
  }

  if (formKey === 'Clinical_Review') {
    if (matchesAny_(payload.suicide_self_harm_concern, ['Active concern', 'Immediate risk'])) {
      reasons.red.push('Suicide/self-harm concern');
    }
    if (matchesAny_(payload.violence_risk, ['High'])) {
      reasons.red.push('Violence risk');
    }
    if (matchesAny_(payload.relapse_warning_signs, ['Severe'])) {
      reasons.red.push('Severe relapse warning');
    }
    if (matchesAny_(payload.relapse_warning_signs, ['Moderate'])) {
      reasons.orange.push('Moderate relapse warning');
    }
    if (matchesAny_(payload.substance_use_concern, ['Active concern'])) {
      reasons.orange.push('Substance use concern');
    }
    if (matchesAny_(payload.medication_adherence, ['Not adherent'])) {
      reasons.orange.push('Medication non-adherence');
    }
  }

  if (formKey === 'Psychological_Review') {
    if (matchesAny_(payload.therapy_need, ['Urgent'])) {
      reasons.orange.push('Urgent psychological review');
    }
    if (matchesAny_(payload.stress_level, ['Severe'])) {
      reasons.orange.push('Severe stress');
    }
    if (matchesAny_(payload.coping_ability, ['Poor'])) {
      reasons.orange.push('Low coping ability');
    }
    if (matchesAny_(payload.sleep_problem, ['Moderate', 'Severe'])) {
      reasons.yellow.push('Sleep problem');
    }
    if (matchesAny_(payload.emotional_regulation, ['Significant difficulty'])) {
      reasons.yellow.push('Emotional regulation difficulty');
    }
  }

  if (formKey === 'Psychosocial_Review') {
    if (matchesAny_(payload.violence_abuse, ['Current concern', 'Immediate danger'])) {
      reasons.red.push('Violence or abuse concern');
    }
    if (matchesAny_(payload.housing_problem, ['Unsafe', 'Homeless risk'])) {
      reasons.orange.push('Housing problem');
    }
    if (matchesAny_(payload.debt_financial_stress, ['Severe'])) {
      reasons.orange.push('Severe debt/financial stress');
    }
    if (matchesAny_(payload.caregiver_support, ['No caregiver available'])) {
      reasons.orange.push('No caregiver support');
    }
    if (matchesAny_(payload.community_support, ['Limited', 'None'])) {
      reasons.yellow.push('Low community support');
    }
    if (matchesAny_(payload.family_conflict, ['Moderate', 'Severe'])) {
      reasons.yellow.push('Family conflict');
    }
  }

  if (formKey === 'Follow_Up') {
    if (matchesAny_(payload.escalation_needed, ['Yes - urgent'])) {
      reasons.red.push('Urgent escalation needed');
    }
    if (matchesAny_(payload.barrier_after_discharge, ['Housing', 'Family support'])) {
      reasons.orange.push(sanitizeText_(payload.barrier_after_discharge) + ' after discharge');
    }
    if (matchesAny_(payload.follow_up_status, ['Missed', 'Escalated'])) {
      reasons.yellow.push('Missed or escalated follow-up');
    }
    if (matchesAny_(payload.barrier_after_discharge, ['Transportation', 'Medication access', 'Cost', 'Stigma'])) {
      reasons.yellow.push(sanitizeText_(payload.barrier_after_discharge) + ' after discharge');
    }
  }

  if (reasons.red.length > 0) {
    return { flag: 'Red', reasons: uniqueValues_(reasons.red.concat(reasons.orange, reasons.yellow)) };
  }
  if (reasons.orange.length > 0) {
    return { flag: 'Orange', reasons: uniqueValues_(reasons.orange.concat(reasons.yellow)) };
  }
  if (reasons.yellow.length > 0) {
    return { flag: 'Yellow', reasons: uniqueValues_(reasons.yellow) };
  }
  return { flag: 'Green', reasons: ['No urgent risk'] };
}

function getSheetRecords_(sheetName) {
  const sheet = getSheet_(sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return [];
  }
  const headers = values[0];
  return values.slice(1).filter(function(row) {
    return row.some(function(cell) {
      return cell !== '';
    });
  }).map(function(row) {
    return headers.reduce(function(record, header, index) {
      record[header] = row[index];
      return record;
    }, {});
  });
}

function getSheet_(sheetName) {
  const sheet = getSpreadsheet_().getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Missing sheet: ' + sheetName);
  }
  return sheet;
}

function getSpreadsheet_() {
  const propertyStore = PropertiesService.getScriptProperties();
  const spreadsheetId = propertyStore.getProperty('SPREADSHEET_ID');
  if (spreadsheetId) {
    try {
      return SpreadsheetApp.openById(spreadsheetId);
    } catch (error) {
      propertyStore.deleteProperty('SPREADSHEET_ID');
    }
  }

  const configuredSpreadsheetId = extractSpreadsheetId_(SPREADSHEET_LINK_OR_ID);
  if (configuredSpreadsheetId) {
    try {
      const configuredSpreadsheet = SpreadsheetApp.openById(configuredSpreadsheetId);
      propertyStore.setProperty('SPREADSHEET_ID', configuredSpreadsheetId);
      return configuredSpreadsheet;
    } catch (error) {
      throw new Error('Unable to open the configured Google Sheet. Check SPREADSHEET_LINK_OR_ID in Code.gs.');
    }
  }

  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) {
    propertyStore.setProperty('SPREADSHEET_ID', active.getId());
    return active;
  }

  const created = SpreadsheetApp.create(APP_TITLE + ' Database');
  propertyStore.setProperty('SPREADSHEET_ID', created.getId());
  return created;
}

function extractSpreadsheetId_(value) {
  const text = sanitizeText_(value);
  if (!text) {
    return '';
  }

  const matched = text.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (matched && matched[1]) {
    return matched[1];
  }

  if (/^[a-zA-Z0-9-_]{20,}$/.test(text)) {
    return text;
  }

  return '';
}

function indexLatestByCase_(records, timestampField) {
  return records.reduce(function(index, record) {
    const caseId = sanitizeText_(record.case_id);
    if (!caseId) {
      return index;
    }
    const existing = index[caseId];
    if (!existing || toComparableDate_(record[timestampField]) > toComparableDate_(existing[timestampField])) {
      index[caseId] = record;
    }
    return index;
  }, {});
}

function distinctCaseCount_(records) {
  return uniqueValues_(records.map(function(record) {
    return sanitizeText_(record.case_id);
  }).filter(Boolean)).length;
}

function maxRiskFlag_(flags) {
  const rank = { Green: 0, Yellow: 1, Orange: 2, Red: 3 };
  if (!flags || !flags.length) {
    return 'Green';
  }
  return flags.reduce(function(current, candidate) {
    return rank[candidate] > rank[current] ? candidate : current;
  }, 'Green');
}

function getRiskRank_(flag) {
  return { Green: 0, Yellow: 1, Orange: 2, Red: 3 }[sanitizeText_(flag)] || 0;
}

function splitReasonList_(value) {
  if (!value) {
    return [];
  }
  return String(value).split(',').map(function(item) {
    return item.trim();
  }).filter(Boolean);
}

function uniqueValues_(items) {
  return items.filter(function(item, index, all) {
    return all.indexOf(item) === index;
  });
}

function truncateText_(value, maxLength) {
  const text = sanitizeText_(value);
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.slice(0, Math.max(0, maxLength - 3)) + '...';
}

function mergeObjects_(left, right) {
  const merged = {};
  Object.keys(left || {}).forEach(function(key) {
    merged[key] = left[key];
  });
  Object.keys(right || {}).forEach(function(key) {
    merged[key] = right[key];
  });
  return merged;
}

function createCaseId_() {
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
  const suffix = Math.floor(100 + Math.random() * 900);
  return 'CASE-' + timestamp + '-' + suffix;
}

function createPatientCode_() {
  const codes = getSheetRecords_('Patient_Registration')
    .concat(getSheetRecords_('Portal_Access'))
    .concat(getSheetRecords_('Patient_Checkin'))
    .map(function(record) {
      const match = sanitizeText_(record.patient_code).match(/^MH-(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    });
  const nextValue = (codes.length ? Math.max.apply(null, codes) : 0) + 1;
  return 'MH-' + ('000' + nextValue).slice(-3);
}

function createPortalCode_(prefix) {
  const compact = Utilities.getUuid().replace(/-/g, '').slice(0, 6).toUpperCase();
  return prefix + compact;
}

function requireCaseId_(payload) {
  const caseId = sanitizeText_(payload.case_id);
  if (!caseId) {
    throw new Error('Select a case before saving this record.');
  }
  return caseId;
}

function normalizeOptionalIntegerInRange_(value, min, max, label) {
  const text = sanitizeText_(value);
  if (!text) {
    return '';
  }
  if (!/^\d+$/.test(text)) {
    throw new Error(label + ' must be a whole number between ' + min + ' and ' + max + '.');
  }
  const parsed = parseInt(text, 10);
  if (parsed < min || parsed > max) {
    throw new Error(label + ' must be between ' + min + ' and ' + max + '.');
  }
  return parsed;
}

function interpretBPRS18Total_(score) {
  if (score === '' || score === undefined || score === null) {
    return '';
  }
  if (score > 60) {
    return 'Very severe psychiatric symptom burden';
  }
  if (score > 40) {
    return 'Moderate to severe psychopathology';
  }
  if (score >= 31) {
    return 'Mild to moderate clinical significance';
  }
  return 'Minimal to mild symptoms';
}

function sanitizeText_(value) {
  return value === undefined || value === null ? '' : String(value).trim();
}

function parseDateValue_(value) {
  if (!value) {
    return '';
  }
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return value;
  }
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? '' : parsed;
}

function formatDateTime_(value) {
  const date = parseDateValue_(value);
  if (!date) {
    return '';
  }
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd MMM yyyy HH:mm');
}

function toComparableDate_(value) {
  const date = parseDateValue_(value);
  return date ? date.getTime() : 0;
}

function matchesAny_(value, choices) {
  const normalized = sanitizeText_(value).toLowerCase();
  return choices.some(function(choice) {
    return normalized === String(choice).toLowerCase();
  });
}

function containsKeyword_(value, keywords) {
  const normalized = sanitizeText_(value).toLowerCase();
  if (!normalized) {
    return false;
  }
  return keywords.some(function(keyword) {
    return normalized.indexOf(String(keyword).toLowerCase()) !== -1;
  });
}

function isSameDay_(left, right) {
  const leftDate = parseDateValue_(left);
  const rightDate = parseDateValue_(right);
  if (!leftDate || !rightDate) {
    return false;
  }
  return Utilities.formatDate(leftDate, Session.getScriptTimeZone(), 'yyyyMMdd') ===
    Utilities.formatDate(rightDate, Session.getScriptTimeZone(), 'yyyyMMdd');
}

function isOpenCoordinationStatus_(value) {
  return ['Draft', 'Requested', 'Accepted', 'In progress'].indexOf(sanitizeText_(value)) !== -1;
}

function countLatestOpenStatus_(index) {
  return Object.keys(index || {}).filter(function(caseId) {
    return isOpenCoordinationStatus_(index[caseId].coordination_status);
  }).length;
}
