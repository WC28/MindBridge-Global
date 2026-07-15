# Google Apps Script Copy-Paste Bundle

## appsscript.json

```json
{
  "timeZone": "Asia/Bangkok",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}

```

## Code.gs

```javascript
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

```

## Index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <?!= include('Styles'); ?>
    <script>
      window.__INITIAL_PORTAL__ = <?!= JSON.stringify(initialPortal || '') ?>;
    </script>
  </head>
  <body>
    <div id="auth-shell" class="auth-shell">
      <div class="auth-card">
        <div class="auth-brand">
          <div class="eyebrow">MindBridge Global</div>
          <h1 id="auth-app-title">Integrated Mental Health Check-in &amp; Care Coordination Web App</h1>
          <p id="auth-app-subtitle"></p>
        </div>

        <div id="auth-banner" class="banner hidden" role="status" aria-live="polite"></div>

        <section class="auth-section">
          <div class="panel-header">
            <h2>Access Portals</h2>
            <p>Select the pathway that matches the current user role.</p>
          </div>
          <div id="portal-picker" class="portal-picker"></div>
        </section>

        <section class="login-panel">
          <div class="panel-header">
            <h2 id="login-title">Portal Sign In</h2>
            <p id="login-subtitle"></p>
          </div>
          <form id="login-form" class="login-form"></form>
        </section>
      </div>
    </div>

    <div id="app-shell" class="shell hidden">
      <aside class="sidebar">
        <div class="brand-block">
          <div class="eyebrow">MindBridge Global</div>
          <h1 id="app-title">Integrated Mental Health Check-in &amp; Care Coordination Web App</h1>
          <p id="app-subtitle"></p>
        </div>

        <div id="sidebar-user" class="user-chip hidden"></div>

        <nav id="nav-list" class="nav-list"></nav>

        <div class="sidebar-actions">
          <button id="refresh-button" class="ghost-button sidebar-button" type="button">Refresh dashboard</button>
          <button id="seed-button" class="ghost-button sidebar-button" type="button">Seed demo data</button>
        </div>
      </aside>

      <main class="main-panel">
        <header class="topbar">
          <div>
            <div class="topbar-label">Integrated AI-Powered Global Mental Health Ecosystem</div>
            <div id="last-updated" class="topbar-value"></div>
          </div>

          <div class="topbar-actions">
            <div id="message-banner" class="banner hidden" role="status" aria-live="polite"></div>
            <div class="topbar-user-actions">
              <div id="topbar-user" class="user-chip hidden"></div>
              <button id="logout-button" class="ghost-button" type="button">Log out</button>
            </div>
          </div>
        </header>

        <section id="page-dashboard" class="page active">
          <div class="page-header">
            <div>
              <h2>Operational Dashboard</h2>
              <p>Command view across front door entry, shared case work, referral loops, and continuity of care.</p>
              <p id="sheet-link-wrap" class="sheet-link-wrap hidden">
                Prototype database:
                <a id="sheet-link" href="#" target="_blank" rel="noopener noreferrer">Open Google Sheet</a>
              </p>
            </div>
            <div class="callout">
              <span class="callout-label">One-Service Prototype Note</span>
              <p id="proposal-note"></p>
            </div>
          </div>

          <div id="summary-cards" class="summary-grid"></div>

          <div class="dashboard-grid dashboard-grid-3">
            <section class="panel">
              <div class="panel-header">
                <h3>Workflow Coverage</h3>
                <p>Cases that have moved through each core team step.</p>
              </div>
              <div id="workflow-coverage" class="bars-list"></div>
            </section>

            <section class="panel">
              <div class="panel-header">
                <h3>Arrival Mix</h3>
                <p>Current intake pattern across scheduled, walk-in, urgent, and referral pathways.</p>
              </div>
              <div id="arrival-mix" class="bars-list"></div>
            </section>

            <section class="panel">
              <div class="panel-header">
                <h3>Network Overview</h3>
                <p>External coordination workload by partner pathway.</p>
              </div>
              <div id="network-overview" class="metric-list"></div>
            </section>

            <section class="panel">
              <div class="panel-header">
                <h3>AI Validation</h3>
                <p>Optional AI-assisted screening compared against local flags and bias watch signals.</p>
              </div>
              <div id="ai-monitoring" class="metric-list"></div>
              <div class="subpanel-header">
                <h4>Bias Watch</h4>
              </div>
              <div id="bias-watch" class="metric-list compact"></div>
            </section>
          </div>

          <section class="panel">
            <div class="panel-header">
              <h3>Common Risk Factors</h3>
              <p>Most frequent rule-based concerns across active cases.</p>
            </div>
            <div id="risk-factors" class="tag-cloud"></div>
          </section>

          <section class="panel">
            <div class="panel-header">
              <h3>Live Triage Queue</h3>
              <p>Recent check-ins and requests routed into the coordination queue.</p>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Case</th>
                    <th>Source</th>
                    <th>Priority</th>
                    <th>Risk</th>
                    <th>Telegram</th>
                    <th>Queued</th>
                  </tr>
                </thead>
                <tbody id="triage-queue-table"></tbody>
              </table>
            </div>
          </section>

          <section class="panel">
            <div class="panel-header">
              <h3>Recent Flagged Cases</h3>
              <p>Highest-signal cases for rapid multidisciplinary review.</p>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Case</th>
                    <th>Risk flag</th>
                    <th>Main concern</th>
                    <th>Risk factors</th>
                    <th>Last updated</th>
                  </tr>
                </thead>
                <tbody id="recent-flags-table"></tbody>
              </table>
            </div>
          </section>
        </section>

        <section id="dynamic-pages"></section>
      </main>
    </div>

    <?!= include('JavaScript'); ?>
  </body>
</html>

```

## Styles.html

```html
<style>
  :root {
    --bg: #edf4fb;
    --bg-soft: #dfeaf4;
    --panel: rgba(255, 255, 255, 0.88);
    --panel-soft: rgba(246, 250, 255, 0.9);
    --border: #c9d7e6;
    --border-strong: #aebfd3;
    --text: #0f2431;
    --muted: #5d7387;
    --sidebar: #07131c;
    --sidebar-border: #163041;
    --sidebar-text: #ecf7ff;
    --accent: #10c7aa;
    --accent-strong: #099b86;
    --accent-blue: #3e74ff;
    --accent-violet: #7b61ff;
    --accent-coral: #ff6d7c;
    --success-bg: #dff6ef;
    --success-text: #11624f;
    --warning-bg: #fff1d6;
    --warning-text: #8a5b0f;
    --danger-bg: #fde1e6;
    --danger-text: #8a2443;
    --info-bg: #e5efff;
    --info-text: #234e9d;
    --shadow: 0 22px 50px rgba(18, 38, 58, 0.12);
    --radius: 8px;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    min-height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: Arial, Helvetica, sans-serif;
  }

  body {
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    background:
      linear-gradient(180deg, #091720 0, #0d1f2c 240px, var(--bg) 240px, var(--bg) 100%);
  }

  body::before,
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  body::before {
    background:
      linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.85), transparent 72%);
  }

  body::after {
    background: linear-gradient(115deg, transparent 0%, rgba(62, 116, 255, 0.08) 38%, rgba(16, 199, 170, 0.08) 52%, transparent 78%);
    transform: translateX(-35%);
    animation: ambientSweep 14s linear infinite;
  }

  h1,
  h2,
  h3,
  p {
    margin: 0;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  a {
    color: inherit;
  }

  .hidden {
    display: none !important;
  }

  .auth-shell {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 28px 18px;
  }

  .auth-card {
    width: min(1120px, 100%);
    display: grid;
    gap: 22px;
    padding: 28px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--panel);
    box-shadow: var(--shadow);
    backdrop-filter: blur(18px);
    position: relative;
    z-index: 1;
  }

  .auth-brand,
  .brand-block {
    display: grid;
    gap: 8px;
  }

  .auth-section {
    display: grid;
    gap: 14px;
  }

  .eyebrow,
  .topbar-label,
  .field-help,
  .callout-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0;
    color: var(--muted);
  }

  #auth-app-title,
  #app-title {
    font-size: 30px;
    line-height: 1.15;
  }

  #auth-app-subtitle,
  #app-subtitle {
    color: var(--muted);
    line-height: 1.55;
  }

  .portal-picker {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }

  .portal-card,
  .nav-button {
    appearance: none;
    width: 100%;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--panel-soft);
    text-align: left;
    padding: 14px;
    color: var(--text);
    cursor: pointer;
    display: grid;
    gap: 6px;
    transition: border-color 180ms ease, transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
  }

  .portal-card:hover,
  .portal-card:focus-visible,
  .nav-button:hover,
  .nav-button:focus-visible {
    border-color: var(--accent);
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(12, 157, 140, 0.08);
    outline: none;
  }

  .portal-card.active {
    background: linear-gradient(180deg, rgba(16, 199, 170, 0.13), rgba(62, 116, 255, 0.08));
    border-color: var(--accent);
    box-shadow: 0 10px 24px rgba(12, 157, 140, 0.1);
  }

  .portal-card-title,
  .nav-button-title {
    font-weight: 700;
  }

  .portal-card-subtitle,
  .nav-button-subtitle {
    color: var(--muted);
    font-size: 13px;
    line-height: 1.4;
  }

  .login-panel,
  .panel,
  .form-shell,
  .summary-card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    backdrop-filter: blur(16px);
  }

  .login-panel,
  .panel,
  .form-shell {
    padding: 22px;
  }

  .panel-header {
    margin-bottom: 16px;
  }

  .panel-header p,
  .form-shell p {
    color: var(--muted);
    line-height: 1.55;
    margin-top: 8px;
  }

  .login-form,
  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .field {
    display: grid;
    gap: 8px;
  }

  .field.span-2 {
    grid-column: span 2;
  }

  .field label {
    font-weight: 600;
  }

  .field-help {
    line-height: 1.4;
  }

  .field input,
  .field select,
  .field textarea {
    width: 100%;
    padding: 11px 12px;
    border-radius: 6px;
    border: 1px solid var(--border-strong);
    background: #ffffff;
    color: var(--text);
  }

  .field textarea {
    min-height: 104px;
    resize: vertical;
  }

  .field input:focus-visible,
  .field select:focus-visible,
  .field textarea:focus-visible,
  .portal-card:focus-visible,
  .nav-button:focus-visible,
  .ghost-button:focus-visible,
  .primary-button:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .portal-summary,
  .status-pill,
  .user-chip {
    min-height: 36px;
    padding: 8px 12px;
    border-radius: 999px;
    border: 1px solid #cde1e5;
    background: #eff7f8;
    color: var(--muted);
    display: inline-flex;
    align-items: center;
  }

  .portal-summary {
    margin-top: 12px;
    line-height: 1.45;
  }

  .form-footer {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 12px;
  }

  .button-group,
  .topbar-user-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }

  .ghost-button,
  .primary-button {
    border-radius: 6px;
    padding: 11px 14px;
    cursor: pointer;
    border: 1px solid transparent;
    min-height: 42px;
  }

  .ghost-button {
    background: transparent;
    border-color: var(--border-strong);
    color: var(--text);
  }

  .sidebar-button {
    color: var(--sidebar-text);
    border-color: rgba(237, 247, 248, 0.18);
  }

  .primary-button {
    background: var(--accent);
    color: #ffffff;
  }

  .primary-button:hover,
  .primary-button:focus-visible {
    background: var(--accent-strong);
  }

  .banner {
    min-height: 42px;
    padding: 10px 14px;
    border-radius: var(--radius);
    background: var(--success-bg);
    color: var(--success-text);
    border: 1px solid #bfe6db;
    line-height: 1.45;
  }

  .banner.error {
    background: var(--danger-bg);
    color: var(--danger-text);
    border-color: #f0b9c7;
  }

  .shell {
    display: grid;
    grid-template-columns: 310px minmax(0, 1fr);
    min-height: 100vh;
    position: relative;
    z-index: 1;
  }

  .sidebar {
    padding: 28px 22px;
    border-right: 1px solid var(--sidebar-border);
    background:
      linear-gradient(180deg, rgba(8, 22, 31, 0.96), rgba(8, 22, 31, 0.88)),
      linear-gradient(135deg, rgba(16, 199, 170, 0.06), rgba(123, 97, 255, 0.08));
    color: var(--sidebar-text);
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
  }

  .sidebar .eyebrow,
  .sidebar #app-subtitle,
  .sidebar .nav-button-subtitle,
  .sidebar .user-chip {
    color: rgba(237, 247, 248, 0.78);
  }

  .sidebar .user-chip {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .nav-list,
  .sidebar-actions {
    display: grid;
    gap: 8px;
  }

  .nav-section {
    display: grid;
    gap: 8px;
  }

  .nav-section-label {
    padding: 10px 12px 2px;
    color: rgba(236, 247, 255, 0.58);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .nav-button {
    background: transparent;
    border-color: rgba(237, 247, 248, 0.08);
    color: var(--sidebar-text);
  }

  .nav-button:hover,
  .nav-button:focus-visible {
    border-color: rgba(12, 157, 140, 0.75);
    background: rgba(255, 255, 255, 0.04);
  }

  .nav-button.active {
    background: linear-gradient(135deg, rgba(16, 199, 170, 0.2), rgba(62, 116, 255, 0.18));
    border-color: rgba(62, 116, 255, 0.72);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  .sidebar-actions {
    margin-top: auto;
  }

  .main-panel {
    padding: 26px 30px 42px;
    display: grid;
    gap: 22px;
    position: relative;
  }

  .topbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .topbar-value {
    margin-top: 4px;
    font-size: 15px;
    color: var(--muted);
  }

  .topbar-actions {
    display: grid;
    gap: 10px;
    justify-items: end;
  }

  .page {
    display: none;
    gap: 22px;
  }

  .page.active {
    display: grid;
  }

  #dynamic-pages {
    display: grid;
    gap: 22px;
  }

  .page-header {
    display: grid;
    gap: 16px;
    grid-template-columns: minmax(0, 1fr) 360px;
    align-items: start;
  }

  .page-header p {
    color: var(--muted);
    line-height: 1.55;
    margin-top: 8px;
  }

  .sheet-link-wrap a {
    color: var(--accent-strong);
    font-weight: 700;
  }

  .callout {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--panel);
    padding: 16px;
    box-shadow: var(--shadow);
  }

  .callout p {
    margin-top: 8px;
    color: var(--text);
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 14px;
  }

  .summary-card {
    padding: 18px;
    display: grid;
    gap: 10px;
    min-height: 116px;
    position: relative;
    overflow: hidden;
  }

  .summary-card::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    background: var(--accent);
  }

  .summary-card::after {
    content: '';
    position: absolute;
    inset: auto -20% -45% auto;
    width: 160px;
    height: 160px;
    background: linear-gradient(180deg, rgba(62, 116, 255, 0.12), rgba(16, 199, 170, 0.04));
    transform: rotate(32deg);
  }

  .summary-card.tone-red::before {
    background: #d63d67;
  }

  .summary-card.tone-orange::before {
    background: #d38917;
  }

  .summary-card.tone-yellow::before {
    background: #c5a11d;
  }

  .summary-card.tone-blue::before {
    background: var(--accent-blue);
  }

  .summary-card.tone-violet::before {
    background: var(--accent-violet);
  }

  .summary-card.tone-teal::before {
    background: var(--accent);
  }

  .summary-card-label {
    color: var(--muted);
    font-size: 14px;
  }

  .summary-card-value {
    font-size: 34px;
    font-weight: 700;
  }

  .dashboard-grid {
    display: grid;
    gap: 16px;
  }

  .dashboard-grid-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .dashboard-grid-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .bars-list {
    display: grid;
    gap: 14px;
  }

  .bar-row {
    display: grid;
    gap: 8px;
  }

  .bar-meta {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 14px;
  }

  .bar-track {
    width: 100%;
    height: 10px;
    border-radius: 999px;
    background: var(--bg-soft);
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--accent), var(--accent-blue));
    transition: width 380ms ease;
  }

  .metric-list {
    display: grid;
    gap: 12px;
  }

  .metric-list.compact {
    gap: 10px;
  }

  .metric-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--panel-soft);
  }

  .metric-row-stack {
    align-items: flex-start;
    flex-direction: column;
  }

  .metric-note {
    color: var(--muted);
    font-size: 12px;
    line-height: 1.45;
  }

  .subpanel-header {
    margin-top: 18px;
    margin-bottom: 10px;
  }

  .subpanel-header h4 {
    margin: 0;
    font-size: 14px;
  }

  .tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .tag {
    border-radius: 999px;
    padding: 9px 12px;
    background: #eff7f8;
    border: 1px solid #cfe3e7;
    display: inline-flex;
    gap: 8px;
    align-items: center;
    line-height: 1.25;
  }

  .tag-count {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 2px 8px;
    font-size: 12px;
  }

  .table-wrap {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  tbody tr {
    transition: background 160ms ease;
  }

  tbody tr:hover {
    background: rgba(62, 116, 255, 0.04);
  }

  th,
  td {
    text-align: left;
    padding: 12px 10px;
    border-bottom: 1px solid #e3ecef;
    vertical-align: top;
    font-size: 14px;
    line-height: 1.45;
  }

  th {
    color: var(--muted);
    font-weight: 600;
  }

  .flag,
  .priority-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 72px;
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid transparent;
    font-weight: 700;
    font-size: 13px;
  }

  .flag-red {
    background: var(--danger-bg);
    color: var(--danger-text);
    border-color: #efb5c4;
  }

  .flag-orange {
    background: var(--warning-bg);
    color: var(--warning-text);
    border-color: #f0d39a;
  }

  .flag-yellow {
    background: #fff8d7;
    color: #7d6812;
    border-color: #eadb8f;
  }

  .flag-green {
    background: var(--success-bg);
    color: var(--success-text);
    border-color: #bde7d9;
  }

  .priority-immediate {
    background: var(--danger-bg);
    color: var(--danger-text);
    border-color: #efb5c4;
  }

  .priority-priority {
    background: var(--warning-bg);
    color: var(--warning-text);
    border-color: #f0d39a;
  }

  .priority-routine {
    background: var(--info-bg);
    color: var(--info-text);
    border-color: #c4d8ff;
  }

  .inline-flag-text {
    margin-left: 10px;
    color: var(--muted);
  }

  .result-box {
    margin-top: 16px;
    padding: 14px;
    border-radius: 6px;
    border: 1px solid #cfe3e7;
    background: #eff7f8;
    display: grid;
    gap: 12px;
  }

  .result-title {
    font-weight: 700;
  }

  .result-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .mini-chip {
    padding: 6px 10px;
    border-radius: 999px;
    background: #ffffff;
    border: 1px solid var(--border);
    font-size: 13px;
  }

  .code-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  .code-chip {
    padding: 12px;
    border-radius: 6px;
    background: #ffffff;
    border: 1px solid var(--border);
    display: grid;
    gap: 6px;
  }

  .code-chip span {
    color: var(--muted);
    font-size: 12px;
  }

  .code-chip strong {
    font-size: 18px;
  }

  .result-text {
    line-height: 1.5;
  }

  .empty-state {
    color: var(--muted);
    line-height: 1.55;
  }

  .experience-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 18px;
    padding: 24px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: var(--radius);
    background:
      linear-gradient(135deg, rgba(7, 19, 28, 0.92), rgba(18, 41, 59, 0.88)),
      linear-gradient(120deg, rgba(16, 199, 170, 0.12), rgba(123, 97, 255, 0.12));
    color: #f2fbff;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow);
  }

  .experience-hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.06) 46%, transparent 64%);
    transform: translateX(-55%);
    animation: heroSweep 8s ease-in-out infinite;
  }

  .experience-hero.compact {
    padding: 20px 24px;
  }

  .experience-copy {
    display: grid;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  .experience-copy p {
    color: rgba(242, 251, 255, 0.8);
    line-height: 1.6;
  }

  .hero-status-stack,
  .hero-action-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-end;
    position: relative;
    z-index: 1;
  }

  .hero-status-tile {
    min-width: 150px;
    padding: 14px 16px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.06);
    display: grid;
    gap: 6px;
  }

  .hero-status-tile span {
    color: rgba(242, 251, 255, 0.68);
    font-size: 12px;
    text-transform: uppercase;
  }

  .hero-status-tile strong {
    font-size: 18px;
    font-weight: 700;
  }

  .panel-accent {
    position: relative;
    overflow: hidden;
  }

  .panel-accent::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(90deg, var(--accent), var(--accent-blue));
  }

  .panel-blue::before {
    background: linear-gradient(90deg, var(--accent-blue), #79a2ff);
  }

  .panel-violet::before {
    background: linear-gradient(90deg, var(--accent-violet), #ae88ff);
  }

  .panel-red::before {
    background: linear-gradient(90deg, var(--accent-coral), #ff8aa6);
  }

  .panel-teal::before {
    background: linear-gradient(90deg, var(--accent), #60e6d2);
  }

  .spotlight-stack,
  .spotlight-grid,
  .loop-card-grid {
    display: grid;
    gap: 12px;
  }

  .spotlight-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .ecosystem-layer-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .spotlight-card,
  .loop-card,
  .workspace-case-card,
  .workspace-signal-card {
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--panel-soft);
    padding: 14px;
    display: grid;
    gap: 8px;
    transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  }

  .spotlight-card:hover,
  .loop-card:hover,
  .workspace-case-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 36px rgba(17, 36, 56, 0.08);
    border-color: rgba(62, 116, 255, 0.28);
  }

  .spotlight-top,
  .loop-card-top,
  .workspace-case-top,
  .timeline-title-row,
  .workspace-detail-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .spotlight-stage,
  .loop-card-partner,
  .workspace-case-stage {
    font-weight: 700;
  }

  .spotlight-text,
  .loop-card-text,
  .workspace-case-meta,
  .timeline-text {
    color: var(--muted);
    line-height: 1.55;
  }

  .spotlight-meta,
  .loop-card-footer {
    color: var(--muted);
    font-size: 13px;
  }

  .loop-card-status-row,
  .workspace-chip-row,
  .quick-action-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }

  .loop-status {
    font-weight: 700;
    color: var(--text);
  }

  .workspace-switcher {
    display: grid;
    gap: 6px;
    min-width: 240px;
  }

  .workspace-switcher label {
    color: rgba(242, 251, 255, 0.68);
    font-size: 12px;
    text-transform: uppercase;
  }

  .workspace-switcher select {
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.08);
    color: #f2fbff;
    padding: 11px 12px;
  }

  .workspace-grid {
    display: grid;
    grid-template-columns: 320px minmax(0, 1fr);
    gap: 16px;
  }

  .workspace-list-panel,
  .workspace-detail {
    display: grid;
    gap: 16px;
  }

  .workspace-case-list {
    display: grid;
    gap: 10px;
  }

  .workspace-case-card {
    text-align: left;
    appearance: none;
    width: 100%;
    cursor: pointer;
  }

  .workspace-case-card.active {
    border-color: rgba(62, 116, 255, 0.45);
    background: linear-gradient(180deg, rgba(62, 116, 255, 0.08), rgba(16, 199, 170, 0.08));
    box-shadow: 0 18px 36px rgba(17, 36, 56, 0.08);
  }

  .workspace-status-stack {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .workspace-signal-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
  }

  .workspace-signal-card span,
  .workspace-care-goal span {
    color: var(--muted);
    font-size: 12px;
    text-transform: uppercase;
  }

  .workspace-signal-card strong,
  .workspace-care-goal strong {
    font-size: 15px;
    line-height: 1.45;
  }

  .workspace-care-goal p {
    margin: 0;
    color: var(--text);
    line-height: 1.6;
  }

  .lens-chip {
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(93, 115, 135, 0.08);
    border: 1px solid rgba(93, 115, 135, 0.18);
    color: var(--muted);
    font-size: 13px;
  }

  .lens-chip.ready {
    background: rgba(16, 199, 170, 0.1);
    border-color: rgba(16, 199, 170, 0.3);
    color: var(--success-text);
  }

  .workspace-care-goal {
    padding: 14px;
    border-radius: 8px;
    background: linear-gradient(180deg, rgba(62, 116, 255, 0.06), rgba(16, 199, 170, 0.04));
    border: 1px solid rgba(62, 116, 255, 0.16);
    display: grid;
    gap: 6px;
  }

  .timeline-stack {
    position: relative;
    display: grid;
    gap: 12px;
  }

  .timeline-stack::before {
    content: '';
    position: absolute;
    left: 12px;
    top: 4px;
    bottom: 4px;
    width: 1px;
    background: linear-gradient(180deg, rgba(16, 199, 170, 0.5), rgba(62, 116, 255, 0.4));
  }

  .timeline-item {
    position: relative;
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr);
    gap: 12px;
  }

  .timeline-dot {
    width: 24px;
    height: 24px;
    border-radius: 999px;
    border: 4px solid rgba(16, 199, 170, 0.2);
    background: #ffffff;
    position: relative;
    z-index: 1;
    margin-top: 4px;
  }

  .timeline-content {
    padding: 14px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--panel-soft);
    display: grid;
    gap: 8px;
  }

  .timeline-meta {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    color: var(--muted);
    font-size: 12px;
    flex-wrap: wrap;
  }

  .span-2 {
    grid-column: span 2;
  }

  .page.active > * {
    animation: pageRise 360ms ease both;
  }

  .page.active > *:nth-child(2) {
    animation-delay: 40ms;
  }

  .page.active > *:nth-child(3) {
    animation-delay: 80ms;
  }

  @keyframes ambientSweep {
    0% { transform: translateX(-40%); }
    100% { transform: translateX(35%); }
  }

  @keyframes heroSweep {
    0%, 100% { transform: translateX(-55%); }
    50% { transform: translateX(55%); }
  }

  @keyframes pageRise {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1240px) {
    .summary-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .dashboard-grid-3,
    .dashboard-grid-2,
    .spotlight-grid,
    .ecosystem-layer-grid,
    .portal-picker {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .workspace-signal-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 1040px) {
    .shell {
      grid-template-columns: 1fr;
    }

    .sidebar {
      border-right: 0;
      border-bottom: 1px solid var(--sidebar-border);
    }

    .page-header {
      grid-template-columns: 1fr;
    }

    .experience-hero,
    .workspace-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 820px) {
    .main-panel,
    .auth-card,
    .login-panel,
    .panel,
    .form-shell {
      padding: 20px 18px;
    }

    .summary-grid,
    .dashboard-grid-3,
    .dashboard-grid-2,
    .portal-picker,
    .form-grid,
    .login-form,
    .code-grid,
    .spotlight-grid,
    .ecosystem-layer-grid,
    .workspace-signal-grid {
      grid-template-columns: 1fr;
    }

    .field.span-2 {
      grid-column: span 1;
    }

    #auth-app-title,
    #app-title {
      font-size: 24px;
    }

    .topbar,
    .form-footer,
    .experience-hero {
      flex-direction: column;
      align-items: stretch;
    }

    .topbar-actions {
      justify-items: stretch;
    }

    .hero-status-stack,
    .hero-action-row,
    .workspace-status-stack {
      justify-content: flex-start;
    }
  }
</style>

```

## JavaScript.html

```html
<script>
  const SESSION_STORAGE_KEY = 'imhcc-session-token';

  const PAGE_DEFINITIONS = [
    { id: 'ecosystem_hub', title: 'MindBridge Global Ecosystem', subtitle: 'Phase 1 MVP proving the 8-layer mental health ecosystem' },
    { id: 'dashboard', title: 'Operational Dashboard', subtitle: 'Live triage, workflow, and coordination command view' },
    { id: 'triage_hub', title: 'Triage Command', subtitle: 'Arrival routing, priority queue, and first-response signals' },
    { id: 'Patient_Registration', title: 'Front Door Registration', subtitle: 'Create a privacy-preserving identity and portal access' },
    { id: 'Patient_Checkin', title: 'Unified Intake', subtitle: 'Structured intake for patient, family, or staff entry' },
    { id: 'Service_Followup', title: 'Same-Day Service', subtitle: 'Medication, appointment, or urgent support requests' },
    { id: 'Community_Referral', title: 'Community Entry', subtitle: 'Community concern reporting and referral initiation' },
    { id: 'case_workspace', title: 'Shared Case Workspace', subtitle: 'Shared timeline, lenses, plan, and next actions for one case' },
    { id: 'Clinical_Review', title: 'Clinical Lens', subtitle: 'Doctor and nurse risk and treatment review' },
    { id: 'Psychological_Review', title: 'Psychological Lens', subtitle: 'Stress, coping, therapy, and sleep review' },
    { id: 'Psychosocial_Review', title: 'Psychosocial Lens', subtitle: 'Family, welfare, housing, stigma, and support review' },
    { id: 'MDT_Care_Plan', title: 'Shared Care Plan', subtitle: 'Integrated multidisciplinary planning and readiness review' },
    { id: 'Minimum_Necessary_Handoff', title: 'Safe Handoff Summary', subtitle: 'Minimum necessary summary for external coordination and follow-up' },
    { id: 'referral_network', title: 'Referral Network', subtitle: 'Closed-loop public, partner, and continuity coordination' },
    { id: 'Public_Coordination', title: 'Public Sector Loop', subtitle: 'Interagency coordination with public sector partners' },
    { id: 'Private_Coordination', title: 'Partner / NGO Loop', subtitle: 'External coordination with NGO and private support partners' },
    { id: 'Follow_Up', title: 'Continuity Tracker', subtitle: 'Discharge, outreach, and community follow-up continuity' }
  ];

  const NAVIGATION_SECTIONS = [
    { title: 'Overview', pages: ['ecosystem_hub', 'dashboard', 'triage_hub'] },
    { title: 'Front Door', pages: ['Patient_Registration', 'Patient_Checkin', 'Service_Followup', 'Community_Referral'] },
    { title: 'Shared Case', pages: ['case_workspace', 'Clinical_Review', 'Psychological_Review', 'Psychosocial_Review', 'MDT_Care_Plan', 'Minimum_Necessary_Handoff'] },
    { title: 'Network & Continuity', pages: ['referral_network', 'Public_Coordination', 'Private_Coordination', 'Follow_Up'] }
  ];

  const FORM_DEFINITIONS = {
    Patient_Registration: {
      description: 'Register a new patient using a patient code and minimal identifying data for Phase 1 workflow access.',
      fields: [
        { name: 'patient_label', label: 'Patient label / alias', type: 'text', placeholder: 'e.g. Patient A', help: 'Use a label or alias instead of full identifying information.' },
        { name: 'contact_phone', label: 'Contact phone', type: 'text', placeholder: 'Phone number' },
        { name: 'emergency_contact', label: 'Emergency contact', type: 'text', placeholder: 'Name or role' },
        { name: 'caregiver_name', label: 'Caregiver name', type: 'text', placeholder: 'Family member or caregiver' },
        { name: 'health_coverage', label: 'Health coverage', type: 'select', optionsKey: 'paymentCoverage' },
        { name: 'consent_acknowledged', label: 'Consent acknowledged', type: 'select', optionsKey: 'consentOptions' },
        { name: 'registration_source', label: 'Registration source', type: 'select', optionsKey: 'registrationSource' },
        { name: 'reason_for_first_visit', label: 'Reason for first visit', type: 'textarea', span: 2 }
      ]
    },
    Patient_Checkin: {
      description: 'Structured intake before review, including visit purpose, symptom burden, support context, and safety concerns.',
      fields: [
        { name: 'patient_code', label: 'Patient code', type: 'text', placeholder: 'e.g. MH-001' },
        { name: 'respondent_name', label: 'Name or alias', type: 'text', placeholder: 'Patient, caregiver, or attendee name' },
        { name: 'informant_type', label: 'Submitted by', type: 'select', optionsKey: 'informantType' },
        { name: 'preferred_language', label: 'Preferred language', type: 'select', optionsKey: 'preferredLanguage' },
        { name: 'visit_date', label: 'Visit date', type: 'date' },
        { name: 'visit_purpose', label: 'Purpose of visit', type: 'select', optionsKey: 'visitPurpose' },
        { name: 'reason_for_visit', label: 'Reason for visit', type: 'select', optionsKey: 'reasonForVisit' },
        { name: 'appointment_code', label: 'Appointment / queue code', type: 'text', placeholder: 'Optional' },
        { name: 'accompanying_person', label: 'Accompanying person', type: 'text', placeholder: 'Optional' },
        { name: 'payment_coverage', label: 'Payment coverage', type: 'select', optionsKey: 'paymentCoverage' },
        { name: 'distress_level', label: 'Distress level', type: 'select', optionsKey: 'distressLevel' },
        {
          name: 'bprs_total_score',
          label: 'BPRS 18-item total score',
          type: 'number',
          placeholder: '18-126',
          min: 18,
          max: 126,
          step: 1,
          help: 'Enter the total BPRS score if available. The app will interpret severity automatically and include it in the triage result.'
        },
        { name: 'safety_concern', label: 'Safety concern', type: 'select', optionsKey: 'safetyConcern' },
        { name: 'family_caregiver_support', label: 'Family / caregiver support', type: 'select', optionsKey: 'familySupport' },
        { name: 'barrier_to_care', label: 'Barrier to care', type: 'select', optionsKey: 'barrierToCare' },
        { name: 'chatbot_transcript', label: 'AI chatbot conversation / story in own words', type: 'textarea', span: 2, help: 'Patients or caregivers can describe symptoms, risks, relapse, social needs, and what is happening right now in their own words.' },
        { name: 'main_concern', label: 'Main concern', type: 'textarea', span: 2 },
        { name: 'current_symptoms', label: 'Current symptoms', type: 'textarea', span: 2 },
        { name: 'additional_notes', label: 'Additional notes', type: 'textarea', span: 2 }
      ]
    },
    Service_Followup: {
      description: 'Structured follow-up request for appointment review, medication refill, or same-day support needs.',
      caseSelector: true,
      fields: [
        { name: 'patient_code', label: 'Patient code', type: 'text', placeholder: 'e.g. MH-001' },
        { name: 'requester_type', label: 'Requested by', type: 'select', optionsKey: 'requesterType' },
        { name: 'service_type', label: 'Service type', type: 'select', optionsKey: 'serviceType' },
        { name: 'appointment_code', label: 'Appointment code', type: 'text', placeholder: 'Optional' },
        { name: 'medication_need', label: 'Medication need', type: 'select', optionsKey: 'medicationNeed' },
        { name: 'payment_coverage', label: 'Payment coverage', type: 'select', optionsKey: 'paymentCoverage' },
        { name: 'today_support_needed', label: 'Today support needed', type: 'select', optionsKey: 'supportNeed' },
        { name: 'urgency_level', label: 'Urgency level', type: 'select', optionsKey: 'urgencyLevel' },
        { name: 'main_concern', label: 'Main concern', type: 'textarea', span: 2 },
        { name: 'current_symptoms', label: 'Current symptoms', type: 'textarea', span: 2 },
        { name: 'caregiver_concern', label: 'Caregiver concern', type: 'textarea', span: 2 },
        { name: 'social_problem', label: 'Social problem', type: 'textarea', span: 2 }
      ]
    },
    Community_Referral: {
      description: 'Community-assisted referral for patients who may need check-in, outreach, or urgent professional review.',
      fields: [
        { name: 'patient_code', label: 'Patient code (if known)', type: 'text', placeholder: 'Optional' },
        { name: 'informant_name', label: 'Informant name', type: 'text', placeholder: 'Community contact' },
        { name: 'relationship_to_patient', label: 'Relationship to patient', type: 'select', optionsKey: 'relationshipType' },
        { name: 'contact_phone', label: 'Contact phone', type: 'text', placeholder: 'Phone number' },
        { name: 'visit_purpose', label: 'Referral pathway', type: 'select', optionsKey: 'visitPurpose' },
        { name: 'safety_concern', label: 'Safety concern', type: 'select', optionsKey: 'safetyConcern' },
        { name: 'family_caregiver_support', label: 'Family / caregiver support', type: 'select', optionsKey: 'familySupport' },
        { name: 'barrier_to_care', label: 'Barrier to care', type: 'select', optionsKey: 'barrierToCare' },
        { name: 'reason_for_referral', label: 'Reason for referral', type: 'textarea', span: 2 },
        { name: 'observed_behavior', label: 'Observed behavior', type: 'textarea', span: 2 },
        { name: 'main_concern', label: 'Main concern', type: 'textarea', span: 2 },
        { name: 'current_symptoms', label: 'Current symptoms', type: 'textarea', span: 2 },
        { name: 'additional_notes', label: 'Additional notes', type: 'textarea', span: 2 }
      ]
    },
    Clinical_Review: {
      description: 'Clinical review for diagnosis, adherence, relapse warning, suicide risk, violence, and substance concerns.',
      caseSelector: true,
      fields: [
        { name: 'reviewer_name', label: 'Reviewer name', type: 'text', placeholder: 'Doctor or nurse' },
        { name: 'diagnosis_group', label: 'Diagnosis group', type: 'select', optionsKey: 'diagnosisGroup' },
        {
          name: 'bprs_total_score',
          label: 'BPRS 18-item total score',
          type: 'number',
          placeholder: '18-126',
          min: 18,
          max: 126,
          step: 1,
          help: 'Optional severity tracker. Total 18-126: 18-30 minimal to mild, 31-40 mild to moderate, above 40 moderate to severe, above 60 very severe. Use for clinical severity tracking, not automatic triage.'
        },
        { name: 'medication_adherence', label: 'Medication adherence', type: 'select', optionsKey: 'medicationAdherence' },
        { name: 'relapse_warning_signs', label: 'Relapse warning signs', type: 'select', optionsKey: 'relapseWarning' },
        { name: 'suicide_self_harm_concern', label: 'Suicide / self-harm concern', type: 'select', optionsKey: 'suicideConcern' },
        { name: 'violence_risk', label: 'Violence risk', type: 'select', optionsKey: 'violenceRisk' },
        { name: 'substance_use_concern', label: 'Substance use concern', type: 'select', optionsKey: 'substanceConcern' },
        { name: 'clinical_notes', label: 'Clinical notes', type: 'textarea', span: 2 }
      ]
    },
    Psychological_Review: {
      description: 'Psychological review for stress burden, coping, trauma, sleep, and therapy urgency.',
      caseSelector: true,
      fields: [
        { name: 'reviewer_name', label: 'Reviewer name', type: 'text', placeholder: 'Psychologist' },
        { name: 'stress_level', label: 'Stress level', type: 'select', optionsKey: 'stressLevel' },
        { name: 'coping_ability', label: 'Coping ability', type: 'select', optionsKey: 'copingAbility' },
        { name: 'trauma_grief_concern', label: 'Trauma / grief concern', type: 'select', optionsKey: 'traumaConcern' },
        { name: 'therapy_need', label: 'Therapy need', type: 'select', optionsKey: 'therapyNeed' },
        { name: 'sleep_problem', label: 'Sleep problem', type: 'select', optionsKey: 'sleepProblem' },
        { name: 'emotional_regulation', label: 'Emotional regulation', type: 'select', optionsKey: 'emotionalRegulation' },
        { name: 'psychological_notes', label: 'Psychological notes', type: 'textarea', span: 2 }
      ]
    },
    Psychosocial_Review: {
      description: 'Psychosocial review for family conflict, debt, housing, stigma, welfare, violence, and community supports.',
      caseSelector: true,
      fields: [
        { name: 'reviewer_name', label: 'Reviewer name', type: 'text', placeholder: 'Social worker' },
        { name: 'family_conflict', label: 'Family conflict', type: 'select', optionsKey: 'familyConflict' },
        { name: 'debt_financial_stress', label: 'Debt / financial stress', type: 'select', optionsKey: 'debtStress' },
        { name: 'housing_problem', label: 'Housing problem', type: 'select', optionsKey: 'housingProblem' },
        { name: 'caregiver_support', label: 'Caregiver support', type: 'select', optionsKey: 'caregiverSupport' },
        { name: 'welfare_need', label: 'Welfare need', type: 'select', optionsKey: 'welfareNeed' },
        { name: 'stigma', label: 'Stigma', type: 'select', optionsKey: 'stigma' },
        { name: 'violence_abuse', label: 'Violence / abuse', type: 'select', optionsKey: 'violenceAbuse' },
        { name: 'community_support', label: 'Community support', type: 'select', optionsKey: 'communitySupport' },
        { name: 'psychosocial_notes', label: 'Psychosocial notes', type: 'textarea', span: 2 }
      ]
    },
    MDT_Care_Plan: {
      description: 'Shared team planning for clinical, psychological, social, rehabilitation, referral, and discharge actions.',
      caseSelector: true,
      fields: [
        { name: 'meeting_date', label: 'Meeting date', type: 'date' },
        { name: 'discharge_readiness', label: 'Discharge readiness', type: 'select', optionsKey: 'dischargeReadiness' },
        { name: 'team_members', label: 'Team members', type: 'text', placeholder: 'Doctor, Nurse, Psychologist, Social Worker, OT' },
        { name: 'main_care_goal', label: 'Main care goal', type: 'textarea', span: 2 },
        { name: 'clinical_plan', label: 'Clinical plan', type: 'textarea', span: 2 },
        { name: 'psychological_plan', label: 'Psychological plan', type: 'textarea', span: 2 },
        { name: 'social_intervention_plan', label: 'Social intervention plan', type: 'textarea', span: 2 },
        { name: 'rehabilitation_plan', label: 'Rehabilitation plan', type: 'textarea', span: 2 },
        { name: 'referral_plan', label: 'Referral plan', type: 'textarea', span: 2 }
      ]
    },
    Minimum_Necessary_Handoff: {
      description: 'Prepare a safe continuity summary for external coordination. This page is for minimum necessary sharing only, not a full hospital record.',
      caseSelector: true,
      fields: [
        { name: 'reviewed_by', label: 'Reviewed by', type: 'text', placeholder: 'Staff member preparing the handoff' },
        { name: 'consent_status', label: 'Consent status', type: 'select', optionsKey: 'consentStatus' },
        { name: 'caregiver_involvement', label: 'Caregiver involvement', type: 'select', optionsKey: 'caregiverInvolvement' },
        { name: 'handoff_ready', label: 'Handoff readiness', type: 'select', optionsKey: 'handoffReady' },
        { name: 'next_step_owner', label: 'Next step owner', type: 'text', placeholder: 'Who accepts the next action' },
        { name: 'next_contact_window', label: 'Next contact window', type: 'select', optionsKey: 'nextContactWindow' },
        { name: 'public_sector_share', label: 'Public sector sharing', type: 'select', optionsKey: 'shareBoundary' },
        { name: 'private_partner_share', label: 'Private / NGO sharing', type: 'select', optionsKey: 'shareBoundary' },
        { name: 'community_follow_up_share', label: 'Community follow-up sharing', type: 'select', optionsKey: 'shareBoundary' },
        { name: 'minimum_necessary_summary', label: 'Minimum necessary summary', type: 'textarea', span: 2, help: 'Write only the information needed for continuity, follow-up, and safe coordination.' },
        { name: 'crisis_safety_summary', label: 'Crisis / safety summary', type: 'textarea', span: 2, help: 'Add only actionable safety information relevant to the receiving team.' },
        { name: 'do_not_share', label: 'Do not share / keep in hospital record', type: 'textarea', span: 2, help: 'List sensitive details that should remain inside the hospital record.' }
      ]
    },
    Public_Coordination: {
      description: 'Interagency coordination for public sector partners such as community hospitals, district offices, welfare, legal, or school systems.',
      caseSelector: true,
      fields: [
        { name: 'agency_name', label: 'Agency name', type: 'text', placeholder: 'Agency or department' },
        { name: 'coordination_type', label: 'Coordination type', type: 'select', optionsKey: 'coordinationType' },
        { name: 'urgency_level', label: 'Urgency level', type: 'select', optionsKey: 'urgencyLevel' },
        { name: 'meeting_date', label: 'Meeting date', type: 'date' },
        { name: 'coordination_status', label: 'Coordination status', type: 'select', optionsKey: 'coordinationStatus' },
        { name: 'referral_reason', label: 'Referral reason', type: 'textarea', span: 2 },
        { name: 'shared_information', label: 'Shared information', type: 'textarea', span: 2 },
        { name: 'requested_action', label: 'Requested action', type: 'textarea', span: 2 },
        { name: 'notes', label: 'Notes', type: 'textarea', span: 2 }
      ]
    },
    Private_Coordination: {
      description: 'External coordination for private hospitals, clinics, employers, foundations, NGOs, and rehabilitation partners.',
      caseSelector: true,
      fields: [
        { name: 'organization_name', label: 'Organization name', type: 'text', placeholder: 'Partner organization' },
        { name: 'support_domain', label: 'Support domain', type: 'select', optionsKey: 'supportDomain' },
        { name: 'urgency_level', label: 'Urgency level', type: 'select', optionsKey: 'urgencyLevel' },
        { name: 'meeting_date', label: 'Meeting date', type: 'date' },
        { name: 'coordination_status', label: 'Coordination status', type: 'select', optionsKey: 'coordinationStatus' },
        { name: 'referral_reason', label: 'Referral reason', type: 'textarea', span: 2 },
        { name: 'support_needs', label: 'Support needs', type: 'textarea', span: 2 },
        { name: 'requested_action', label: 'Requested action', type: 'textarea', span: 2 },
        { name: 'notes', label: 'Notes', type: 'textarea', span: 2 }
      ]
    },
    Follow_Up: {
      description: 'Track discharge and community follow-up responsibilities, barriers, outcomes, and escalation.',
      caseSelector: true,
      fields: [
        { name: 'follow_up_due_date', label: 'Follow-up due date', type: 'date' },
        { name: 'responsible_staff', label: 'Responsible staff', type: 'text', placeholder: 'Case manager or team' },
        { name: 'referral_destination', label: 'Referral destination', type: 'text', placeholder: 'Clinic, welfare office, community team' },
        { name: 'follow_up_status', label: 'Follow-up status', type: 'select', optionsKey: 'followUpStatus' },
        { name: 'barrier_after_discharge', label: 'Barrier after discharge', type: 'select', optionsKey: 'barrierAfterDischarge' },
        { name: 'escalation_needed', label: 'Escalation needed', type: 'select', optionsKey: 'escalationNeeded' },
        { name: 'outcome', label: 'Outcome', type: 'textarea', span: 2 },
        { name: 'follow_up_notes', label: 'Follow-up notes', type: 'textarea', span: 2 }
      ]
    }
  };

  const state = {
    bootstrap: null,
    activePage: 'dashboard',
    selectedPortal: window.__INITIAL_PORTAL__ || 'register',
    selectedWorkspaceCaseId: '',
    screeningAutoLaunchTried: false
  };

  document.addEventListener('DOMContentLoaded', initializeApp);

  function initializeApp() {
    const savedToken = getStoredSessionToken();
    showBanner('Loading prototype data...');
    runServer('getAppBootstrap', [savedToken], function(bootstrap) {
      state.bootstrap = bootstrap;
      if (!bootstrap.authenticated) {
        clearStoredSessionToken();
      }
      hydrateApp();
      hideBanner();
    }, function(error) {
      showBanner(error.message || 'Unable to load app data.', true);
    });
  }

  function hydrateApp() {
    renderTitles();
    document.body.setAttribute('data-portal', state.bootstrap.authenticated && state.bootstrap.currentUser
      ? state.bootstrap.currentUser.portalType
      : 'auth');
    state.selectedPortal = getSafePortalSelection();
    if (state.bootstrap.authenticated) {
      storeSessionToken(state.bootstrap.sessionToken);
      showAppShell();
      renderCurrentUser();
      renderNavigation();
      renderFormPages();
      bindGlobalActions();
      renderSpreadsheetLink();
      renderDashboard();
      refreshCaseSelectors();
      refreshPageVisibility();
      toggleStaffControls();
    } else {
      showAuthShell();
      renderPortalPicker();
      renderLoginForm();
      maybeAutoLaunchPublicScreening();
    }
  }

  function getSafePortalSelection() {
    const portalOptions = (state.bootstrap && state.bootstrap.portalOptions) || [];
    if (!portalOptions.length) {
      return 'register';
    }
    const exists = portalOptions.some(function(portal) {
      return portal.id === state.selectedPortal;
    });
    return exists ? state.selectedPortal : portalOptions[0].id;
  }

  function renderTitles() {
    const title = state.bootstrap.appTitle || 'MindBridge Global';
    const subtitle = state.bootstrap.subtitle || '';
    document.getElementById('auth-app-title').textContent = title;
    document.getElementById('app-title').textContent = title;
    document.getElementById('auth-app-subtitle').textContent = subtitle;
    document.getElementById('app-subtitle').textContent = subtitle;
    document.getElementById('proposal-note').textContent = state.bootstrap.proposalNote || '';
  }

  function showAuthShell() {
    document.getElementById('auth-shell').classList.remove('hidden');
    document.getElementById('app-shell').classList.add('hidden');
  }

  function showAppShell() {
    document.getElementById('auth-shell').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    const defaultPage = state.bootstrap.defaultPage || 'dashboard';
    const availablePages = getAvailablePages();
    state.activePage = availablePages.some(function(page) {
      return page.id === defaultPage;
    }) ? defaultPage : (availablePages[0] ? availablePages[0].id : 'dashboard');
  }

  function renderPortalPicker() {
    const portals = state.bootstrap.portalOptions || [];
    const picker = document.getElementById('portal-picker');
    picker.innerHTML = portals.map(function(portal) {
      return [
        '<button class="portal-card',
        portal.id === state.selectedPortal ? ' active' : '',
        '" type="button" data-portal="',
        escapeHtml(portal.id),
        '">',
        '<span class="portal-card-title">',
        escapeHtml(portal.title),
        '</span>',
        '<span class="portal-card-subtitle">',
        escapeHtml(portal.subtitle),
        '</span>',
        '</button>'
      ].join('');
    }).join('');

    picker.querySelectorAll('[data-portal]').forEach(function(button) {
      button.addEventListener('click', function() {
        state.selectedPortal = button.getAttribute('data-portal');
        renderPortalPicker();
        renderLoginForm();
      });
    });
  }

  function renderLoginForm() {
    const config = getLoginConfig();
    document.getElementById('login-title').textContent = config.title;
    document.getElementById('login-subtitle').textContent = config.subtitle;

    const form = document.getElementById('login-form');
    form.innerHTML = [
      config.fields.map(function(field) {
        return [
          '<div class="field',
          field.span === 2 ? ' span-2' : '',
          '">',
          '<label>',
          escapeHtml(field.label),
          '</label>',
          '<input type="',
          escapeHtml(field.type),
          '" name="',
          escapeHtml(field.name),
          '"',
          field.placeholder ? ' placeholder="' + escapeHtml(field.placeholder) + '"' : '',
          field.autocomplete ? ' autocomplete="' + escapeHtml(field.autocomplete) + '"' : '',
          '>',
          field.help ? '<div class="field-help">' + escapeHtml(field.help) + '</div>' : '',
          '</div>'
        ].join('');
      }).join(''),
      '<div class="field span-2">',
      '<div class="button-group">',
      '<button class="primary-button" type="submit">',
      escapeHtml(config.buttonLabel),
      '</button>',
      '</div>',
      '</div>'
    ].join('');

    form.onsubmit = function(event) {
      event.preventDefault();
      submitLogin(form);
    };
  }

  function maybeAutoLaunchPublicScreening() {
    if (state.bootstrap.authenticated || state.selectedPortal !== 'screening' || state.screeningAutoLaunchTried) {
      return;
    }
    state.screeningAutoLaunchTried = true;
    const form = document.getElementById('login-form');
    if (form) {
      submitLogin(form);
    }
  }

  function getLoginConfig() {
    switch (state.selectedPortal) {
      case 'register':
        return {
          title: 'New Patient Registration',
          subtitle: 'Open the registration workspace to create a patient code and portal access codes.',
          buttonLabel: 'Open registration portal',
          fields: []
        };
      case 'patient':
        return {
          title: 'Patient Sign In',
          subtitle: 'Use patient code and portal access code to submit check-in or follow-up requests.',
          buttonLabel: 'Sign in to patient portal',
          fields: [
            { name: 'patient_code', label: 'Patient code', type: 'text', placeholder: 'e.g. MH-001' },
            { name: 'access_code', label: 'Access code', type: 'password' }
          ]
        };
      case 'screening':
        return {
          title: 'Conference QR Screening',
          subtitle: 'Start a public BPRS plus AI-supported self-screening for patients, family members, or caregivers. This same link can be used from home 24/7.',
          buttonLabel: 'Start screening now',
          fields: []
        };
      case 'family':
        return {
          title: 'Family / Caregiver Sign In',
          subtitle: 'Use patient code and family access code to support check-in and follow-up requests.',
          buttonLabel: 'Sign in to family portal',
          fields: [
            { name: 'patient_code', label: 'Patient code', type: 'text', placeholder: 'e.g. MH-001' },
            { name: 'access_code', label: 'Access code', type: 'password' }
          ]
        };
      case 'community':
        return {
          title: 'Community Referral Sign In',
          subtitle: 'Community members or volunteers can submit structured referral information from this portal.',
          buttonLabel: 'Sign in to community portal',
          fields: [
            { name: 'login_username', label: 'Username', type: 'text', autocomplete: 'username' },
            { name: 'login_password', label: 'Password', type: 'password', autocomplete: 'current-password' }
          ]
        };
      case 'public':
        return {
          title: 'Public Sector Network Sign In',
          subtitle: 'Use a partner account for interagency coordination updates and action tracking.',
          buttonLabel: 'Sign in to public sector portal',
          fields: [
            { name: 'login_username', label: 'Username', type: 'text', autocomplete: 'username' },
            { name: 'login_password', label: 'Password', type: 'password', autocomplete: 'current-password' }
          ]
        };
      case 'private':
        return {
          title: 'Private / NGO Network Sign In',
          subtitle: 'Use a partner account to coordinate external support, rehabilitation, or welfare actions.',
          buttonLabel: 'Sign in to private / NGO portal',
          fields: [
            { name: 'login_username', label: 'Username', type: 'text', autocomplete: 'username' },
            { name: 'login_password', label: 'Password', type: 'password', autocomplete: 'current-password' }
          ]
        };
      default:
        return {
          title: 'Hospital Staff Sign In',
          subtitle: 'Access the dashboard, multidisciplinary reviews, shared care planning, and follow-up workflow.',
          buttonLabel: 'Sign in to staff portal',
          fields: [
            { name: 'login_username', label: 'Username', type: 'text', autocomplete: 'username' },
            { name: 'login_password', label: 'Password', type: 'password', autocomplete: 'current-password' }
          ]
        };
    }
  }

  function submitLogin(form) {
    const credentials = serializeForm(form);
    showBanner('Signing in...');
    runServer('loginPortal', [state.selectedPortal, credentials], function(bootstrap) {
      state.bootstrap = bootstrap;
      hydrateApp();
      hideBanner();
    }, function(error) {
      showBanner(error.message || 'Unable to sign in.', true);
    });
  }

  function renderCurrentUser() {
    const user = state.bootstrap.currentUser || {};
    const label = buildCurrentUserLabel(user);
    const sidebarUser = document.getElementById('sidebar-user');
    const topbarUser = document.getElementById('topbar-user');

    if (!label) {
      sidebarUser.classList.add('hidden');
      topbarUser.classList.add('hidden');
      return;
    }

    sidebarUser.textContent = label;
    topbarUser.textContent = label;
    sidebarUser.classList.remove('hidden');
    topbarUser.classList.remove('hidden');
  }

  function buildCurrentUserLabel(user) {
    if (!user || !user.portalType) {
      return '';
    }
    if (user.portalType === 'patient' || user.portalType === 'family') {
      return [user.displayName, user.patientCode].filter(Boolean).join(' - ');
    }
    return [user.displayName, user.organization || user.profession || user.roleLabel].filter(Boolean).join(' - ');
  }

  function getAvailablePages() {
    const allowed = state.bootstrap.allowedPages || [];
    return PAGE_DEFINITIONS.filter(function(page) {
      return allowed.indexOf(page.id) !== -1;
    });
  }

  function getNavigationSections() {
    const pageMap = getAvailablePages().reduce(function(index, page) {
      index[page.id] = page;
      return index;
    }, {});

    const sections = NAVIGATION_SECTIONS.map(function(section) {
      return {
        title: section.title,
        pages: section.pages.map(function(pageId) {
          return pageMap[pageId];
        }).filter(Boolean)
      };
    }).filter(function(section) {
      return section.pages.length > 0;
    });

    if (sections.length) {
      return sections;
    }

    return [{
      title: 'Workspace',
      pages: getAvailablePages()
    }];
  }

  function renderNavigation() {
    const nav = document.getElementById('nav-list');
    const sections = getNavigationSections();

    nav.innerHTML = sections.map(function(section) {
      return [
        '<div class="nav-section">',
        '<div class="nav-section-label">',
        escapeHtml(section.title),
        '</div>',
        section.pages.map(function(page) {
          return [
            '<button class="nav-button',
            page.id === state.activePage ? ' active' : '',
            '" type="button" data-page="',
            escapeHtml(page.id),
            '">',
            '<span class="nav-button-title">',
            escapeHtml(page.title),
            '</span>',
            '<span class="nav-button-subtitle">',
            escapeHtml(page.subtitle),
            '</span>',
            '</button>'
          ].join('');
        }).join(''),
        '</div>'
      ].join('');
    }).join('');

    nav.querySelectorAll('[data-page]').forEach(function(button) {
      button.onclick = function() {
        state.activePage = button.getAttribute('data-page');
        if (isCustomPage(state.activePage)) {
          renderFormPages();
        }
        renderNavigation();
        refreshPageVisibility();
      };
    });
  }

  function isCustomPage(pageId) {
    return ['ecosystem_hub', 'triage_hub', 'case_workspace', 'referral_network'].indexOf(pageId) !== -1;
  }

  function renderFormPages() {
    const container = document.getElementById('dynamic-pages');
    const availablePages = getAvailablePages().filter(function(page) {
      return page.id !== 'dashboard';
    });

    container.innerHTML = availablePages.map(function(page) {
      if (isCustomPage(page.id)) {
        return renderCustomPage(page);
      }

      const definition = FORM_DEFINITIONS[page.id];
      const context = getFormContext(page.id);
      const showCaseSelector = !!definition.caseSelector && !context.hideCaseSelector;

      return [
        '<section id="page-',
        escapeHtml(page.id),
        '" class="page">',
        '<div class="form-shell">',
        '<div class="panel-header">',
        '<h2>',
        escapeHtml(page.title),
        '</h2>',
        '<p>',
        escapeHtml(definition.description),
        '</p>',
        context.summaryText ? '<div class="portal-summary">' + escapeHtml(context.summaryText) + '</div>' : '',
        '</div>',
        '<form data-form-key="',
        escapeHtml(page.id),
        '">',
        showCaseSelector ? renderCaseSelector(page.id) : '',
        '<div class="form-grid">',
        definition.fields.map(function(field) {
          return renderField(page.id, field);
        }).join(''),
        '</div>',
        '<div id="result-',
        escapeHtml(page.id),
        '" class="result-box hidden"></div>',
        '<div class="form-footer">',
        '<div class="status-pill" id="status-',
        escapeHtml(page.id),
        '">Ready</div>',
        '<div class="button-group">',
        '<button class="ghost-button" type="reset">Clear</button>',
        '<button class="primary-button" type="submit">Save</button>',
        '</div>',
        '</div>',
        '</form>',
        '</div>',
        '</section>'
      ].join('');
    }).join('');

    container.querySelectorAll('form[data-form-key]').forEach(function(form) {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        submitForm(form);
      });
      form.addEventListener('reset', function() {
        window.setTimeout(function() {
          clearResultBox(form.getAttribute('data-form-key'));
          applyFormContext(form);
          const selector = form.querySelector('.case-selector');
          if (selector && selector.value) {
            applyCaseLinkedDefaults(form, selector.value);
          }
          const status = document.getElementById('status-' + form.getAttribute('data-form-key'));
          if (status) {
            status.textContent = 'Ready';
          }
        }, 0);
      });
      applyFormContext(form);
    });

    bindCustomPageInteractions();
    animateCountersIn(container);
  }

  function renderCustomPage(page) {
    switch (page.id) {
      case 'ecosystem_hub':
        return renderEcosystemHubPage(page);
      case 'triage_hub':
        return renderTriageHubPage(page);
      case 'case_workspace':
        return renderCaseWorkspacePage(page);
      case 'referral_network':
        return renderReferralNetworkPage(page);
      default:
        return '';
    }
  }

  function renderEcosystemHubPage(page) {
    const hub = state.bootstrap.ecosystemHub || {
      summaryCards: [],
      journeyRail: [],
      frontDoorMix: [],
      spotlight: [],
      architectureLayers: [],
      collaborationBackbone: [],
      phaseFocus: [],
      phaseStatus: '',
      ecosystemLayerCount: 0
    };
    return [
      '<section id="page-',
      escapeHtml(page.id),
      '" class="page">',
      '<div class="experience-hero">',
      '<div class="experience-copy">',
      '<div class="eyebrow">MindBridge Global Phase 1</div>',
      '<h2>',
      escapeHtml(page.title),
      '</h2>',
      '<p>One front door, one shared case spine, and one coordinated journey that proves the larger 8-layer ecosystem from access and screening to continuity and research learning.</p>',
      '</div>',
      '<div class="hero-status-stack">',
      '<div class="hero-status-tile"><span>Phase status</span><strong>',
      escapeHtml(hub.phaseStatus || 'Phase 1 MVP'),
      '</strong></div>',
      '<div class="hero-status-tile"><span>Workflow layers aligned</span><strong>',
      escapeHtml(String(hub.ecosystemLayerCount || 8)),
      '</strong></div>',
      '<div class="hero-status-tile"><span>Last refresh</span><strong>',
      escapeHtml(hub.lastUpdated || 'Now'),
      '</strong></div>',
      '</div>',
      '</div>',
      renderSummaryCardsHtml(hub.summaryCards),
      '<div class="dashboard-grid dashboard-grid-3">',
      '<section class="panel panel-accent panel-teal">',
      '<div class="panel-header"><h3>Journey Rail</h3><p>How cases are moving across the one-service pathway right now.</p></div>',
      '<div class="bars-list">',
      renderBarRowsHtml(hub.journeyRail, 'No journey movement yet.'),
      '</div>',
      '</section>',
      '<section class="panel panel-accent panel-blue">',
      '<div class="panel-header"><h3>Front Door Mix</h3><p>Which entry pathways are most active in the ecosystem.</p></div>',
      '<div class="bars-list">',
      renderBarRowsHtml(hub.frontDoorMix, 'No intake pathways recorded yet.'),
      '</div>',
      '</section>',
      '<section class="panel panel-accent panel-violet">',
      '<div class="panel-header"><h3>Case Spotlight</h3><p>High-signal cases and handoffs that deserve team attention.</p></div>',
      '<div class="spotlight-stack">',
      renderSpotlightItemsHtml(hub.spotlight),
      '</div>',
      '</section>',
      '</div>',
      '<div class="dashboard-grid dashboard-grid-2">',
      '<section class="panel panel-accent panel-blue">',
      '<div class="panel-header"><h3>Integrated 8-Layer Workflow</h3><p>How tonight&#39;s MVP maps to the full global ecosystem concept.</p></div>',
      renderEcosystemLayerCardsHtml(hub.architectureLayers),
      '</section>',
      '<section class="panel panel-accent panel-teal">',
      '<div class="panel-header"><h3>Global Backbone and Demo Focus</h3><p>The wider collaboration and delivery story that makes the concept presentation-ready.</p></div>',
      '<div class="metric-list">',
      renderInsightRowsHtml(hub.collaborationBackbone, 'No collaboration anchors configured yet.'),
      '</div>',
      '<div class="subpanel-header"><h4>Phase 1 demo focus</h4></div>',
      '<div class="spotlight-stack">',
      renderFocusCardsHtml(hub.phaseFocus),
      '</div>',
      '</section>',
      '</div>',
      '</section>'
    ].join('');
  }

  function renderTriageHubPage(page) {
    const dashboard = state.bootstrap.dashboard || buildEmptyDashboardState();
    return [
      '<section id="page-',
      escapeHtml(page.id),
      '" class="page">',
      '<div class="experience-hero compact">',
      '<div class="experience-copy">',
      '<div class="eyebrow">Arrival Routing</div>',
      '<h2>',
      escapeHtml(page.title),
      '</h2>',
      '<p>Live triage queue for walk-in, urgent, scheduled, and community entry pathways.</p>',
      '</div>',
      '<div class="hero-action-row">',
      '<button class="ghost-button" type="button" data-open-page="Patient_Checkin">Open unified intake</button>',
      '<button class="ghost-button" type="button" data-open-page="Service_Followup">Open same-day service</button>',
      '</div>',
      '</div>',
      '<div class="dashboard-grid dashboard-grid-3">',
      '<section class="panel panel-accent panel-red">',
      '<div class="panel-header"><h3>Queue Pulse</h3><p>Top operational signals from the current triage board.</p></div>',
      renderSummaryCardsHtml((dashboard.summaryCards || []).slice(0, 4)),
      '</section>',
      '<section class="panel panel-accent panel-blue span-2">',
      '<div class="panel-header"><h3>Live Triage Queue</h3><p>Recent activity routed into the first-response workflow.</p></div>',
      '<div class="table-wrap"><table><thead><tr><th>Case</th><th>Source</th><th>Priority</th><th>Risk</th><th>Telegram</th><th>Queued</th></tr></thead><tbody>',
      (dashboard.triageQueue || []).length
        ? dashboard.triageQueue.map(function(item) {
            return [
              '<tr>',
              '<td>', escapeHtml(item.patientCode), '</td>',
              '<td>', escapeHtml(item.source || '-'), '</td>',
              '<td>', renderPriority(item.queuePriority), '</td>',
              '<td>', renderFlag(item.riskFlag), '</td>',
              '<td>', escapeHtml(item.telegramStatus || ''), '</td>',
              '<td>', escapeHtml(item.queuedAt || ''), '</td>',
              '</tr>'
            ].join('');
          }).join('')
        : '<tr><td colspan="6" class="empty-state">No triage queue activity yet.</td></tr>',
      '</tbody></table></div>',
      '</section>',
      '</div>',
      '<section class="panel">',
      '<div class="panel-header"><h3>Recent Flagged Cases</h3><p>Cases that are likely to benefit from rapid multidisciplinary attention.</p></div>',
      '<div class="spotlight-grid">',
      renderFlaggedCardsHtml(dashboard.recentFlags || []),
      '</div>',
      '</section>',
      '</section>'
    ].join('');
  }

  function renderCaseWorkspacePage(page) {
    const workspace = state.bootstrap.caseWorkspace || { cases: [] };
    const selectedCase = getSelectedWorkspaceCase();
    return [
      '<section id="page-',
      escapeHtml(page.id),
      '" class="page">',
      '<div class="experience-hero">',
      '<div class="experience-copy">',
      '<div class="eyebrow">Shared Case Spine</div>',
      '<h2>',
      escapeHtml(page.title),
      '</h2>',
      '<p>One shared workspace for case context, integrated lenses, planning, referral loops, and continuity actions.</p>',
      '</div>',
      '<div class="workspace-switcher">',
      '<label for="workspace-case-select">Active case</label>',
      '<select id="workspace-case-select" data-workspace-case-select="true">',
      workspace.cases.map(function(item) {
        const selected = selectedCase && item.caseId === selectedCase.caseId ? ' selected' : '';
        return '<option value="' + escapeHtml(item.caseId) + '"' + selected + '>' + escapeHtml(item.patientCode + ' - ' + item.caseId) + '</option>';
      }).join(''),
      '</select>',
      '</div>',
      '</div>',
      selectedCase
        ? [
            '<div class="workspace-grid">',
            '<section class="panel workspace-list-panel">',
            '<div class="panel-header"><h3>Active Cases</h3><p>Jump between shared case workspaces without losing the one-service view.</p></div>',
            '<div class="workspace-case-list">',
            workspace.cases.map(function(item) {
              return [
                '<button class="workspace-case-card',
                item.caseId === selectedCase.caseId ? ' active' : '',
                '" type="button" data-workspace-case="',
                escapeHtml(item.caseId),
                '">',
                '<div class="workspace-case-top"><strong>',
                escapeHtml(item.patientCode),
                '</strong>',
                renderFlag(item.priorityFlag),
                '</div>',
                '<div class="workspace-case-stage">',
                escapeHtml(item.currentStage),
                '</div>',
                '<div class="workspace-case-meta">',
                escapeHtml(item.nextAction || ''),
                '</div>',
                '</button>'
              ].join('');
            }).join(''),
            '</div>',
            '</section>',
            '<section class="workspace-detail">',
            '<div class="panel panel-accent panel-blue">',
            '<div class="workspace-detail-header">',
            '<div><div class="eyebrow">Current case</div><h3>',
            escapeHtml(selectedCase.patientCode + ' - ' + selectedCase.caseId),
            '</h3><p>',
            escapeHtml(selectedCase.latestSummary || ''),
            '</p></div>',
            '<div class="workspace-status-stack">',
            renderPriority(selectedCase.queuePriority),
            renderFlag(selectedCase.priorityFlag),
            '</div>',
            '</div>',
            '<div class="workspace-signal-grid">',
            renderWorkspaceSignalCard('Journey stage', selectedCase.journeyStatus),
            renderWorkspaceSignalCard('Current lens', selectedCase.currentStage),
            renderWorkspaceSignalCard('Owner', selectedCase.ownerTeam || 'Care coordination'),
            renderWorkspaceSignalCard('Next action', selectedCase.nextAction || 'Continue shared review'),
            renderWorkspaceSignalCard('Latest BPRS', selectedCase.bprsScore || 'Not recorded'),
            renderWorkspaceSignalCard('Clinical severity', selectedCase.bprsInterpretation || 'Not recorded'),
            '</div>',
            '<div class="workspace-chip-row">',
            renderLensChip('Clinical', selectedCase.clinicalReady),
            renderLensChip('Psychological', selectedCase.psychologicalReady),
            renderLensChip('Psychosocial', selectedCase.psychosocialReady),
            renderLensChip('Care plan', selectedCase.carePlanReady),
            '</div>',
            selectedCase.careGoal ? '<div class="workspace-care-goal"><span>Care goal</span><strong>' + escapeHtml(selectedCase.careGoal) + '</strong></div>' : '',
            '</div>',
            '<div class="dashboard-grid dashboard-grid-2">',
            '<section class="panel panel-accent panel-violet">',
            '<div class="panel-header"><h3>Shared Timeline</h3><p>Everything important that has happened in this case, in one ordered stream.</p></div>',
            '<div class="timeline-stack">',
            renderTimelineHtml(selectedCase.timeline || []),
            '</div>',
            '</section>',
            '<section class="panel panel-accent panel-teal">',
            '<div class="panel-header"><h3>Network & Continuity</h3><p>Where the case sits across partner handoffs and follow-up continuity.</p></div>',
            '<div class="metric-list">',
            renderMetricRowHtml('Safe handoff', selectedCase.handoffStatus || 'Not started'),
            renderMetricRowHtml('Consent boundary', selectedCase.consentStatus || 'Not recorded'),
            renderMetricRowHtml('Public sector loop', selectedCase.publicStatus || 'Not started'),
            renderMetricRowHtml('Partner / NGO loop', selectedCase.privateStatus || 'Not started'),
            renderMetricRowHtml('Follow-up status', selectedCase.followUpStatus || 'Not started'),
            renderMetricRowHtml('Follow-up owner', selectedCase.followUpOwner || 'Not assigned'),
            '</div>',
            '<div class="quick-action-row">',
            '<button class="ghost-button" type="button" data-open-case-page="Clinical_Review" data-case-id="', escapeHtml(selectedCase.caseId), '">Clinical lens</button>',
            '<button class="ghost-button" type="button" data-open-case-page="Psychological_Review" data-case-id="', escapeHtml(selectedCase.caseId), '">Psychological lens</button>',
            '<button class="ghost-button" type="button" data-open-case-page="Psychosocial_Review" data-case-id="', escapeHtml(selectedCase.caseId), '">Psychosocial lens</button>',
            '<button class="ghost-button" type="button" data-open-case-page="MDT_Care_Plan" data-case-id="', escapeHtml(selectedCase.caseId), '">Shared care plan</button>',
            '<button class="ghost-button" type="button" data-open-case-page="Minimum_Necessary_Handoff" data-case-id="', escapeHtml(selectedCase.caseId), '">Safe handoff</button>',
            '<button class="ghost-button" type="button" data-open-case-page="Follow_Up" data-case-id="', escapeHtml(selectedCase.caseId), '">Continuity</button>',
            '</div>',
            selectedCase.handoffSummary
              ? '<div class="workspace-care-goal"><span>Minimum necessary handoff summary</span><p>' + escapeHtml(selectedCase.handoffSummary) + '</p></div>'
              : '<div class="portal-summary">No safe handoff summary recorded yet. Complete Safe Handoff Summary before external coordination.</div>',
            selectedCase.crisisSafetySummary
              ? '<div class="workspace-care-goal"><span>Crisis / safety summary</span><p>' + escapeHtml(selectedCase.crisisSafetySummary) + '</p></div>'
              : '',
            selectedCase.doNotShare
              ? '<div class="portal-summary">Do not share: ' + escapeHtml(selectedCase.doNotShare) + '</div>'
              : '',
            '</section>',
            '</div>',
            '</section>',
            '</div>'
          ].join('')
        : '<section class="panel"><div class="empty-state">No shared cases yet. Start from Unified Intake, Same-Day Service, or Community Entry.</div></section>',
      '</section>'
    ].join('');
  }

  function renderReferralNetworkPage(page) {
    const network = state.bootstrap.referralNetwork || { summaryCards: [], lanes: [], openLoops: [] };
    return [
      '<section id="page-',
      escapeHtml(page.id),
      '" class="page">',
      '<div class="experience-hero">',
      '<div class="experience-copy">',
      '<div class="eyebrow">Closed-Loop Coordination</div>',
      '<h2>',
      escapeHtml(page.title),
      '</h2>',
      '<p>Track public sector, partner, and follow-up loops until actions are accepted, delivered, and closed.</p>',
      '</div>',
      '<div class="hero-status-stack">',
      '<div class="hero-status-tile"><span>Open loops</span><strong>',
      escapeHtml(String((network.openLoops || []).length)),
      '</strong></div>',
      '<div class="hero-status-tile"><span>Last refresh</span><strong>',
      escapeHtml(network.lastUpdated || 'Now'),
      '</strong></div>',
      '</div>',
      '</div>',
      renderSummaryCardsHtml(network.summaryCards),
      '<div class="dashboard-grid dashboard-grid-3">',
      '<section class="panel panel-accent panel-blue">',
      '<div class="panel-header"><h3>Lane Balance</h3><p>Open workload by public, partner, and continuity lane.</p></div>',
      '<div class="metric-list">',
      (network.lanes || []).length
        ? network.lanes.map(function(item) {
            return renderMetricRowHtml(item.label, String(item.value));
          }).join('')
        : '<div class="empty-state">No network activity yet.</div>',
      '</div>',
      '</section>',
      '<section class="panel panel-accent panel-violet span-2">',
      '<div class="panel-header"><h3>Open Loop Board</h3><p>Each coordination item should move to accepted, delivered, and closed.</p></div>',
      '<div class="loop-card-grid">',
      renderReferralLoopCardsHtml(network.openLoops || []),
      '</div>',
      '</section>',
      '</div>',
      '</section>'
    ].join('');
  }

  function bindCustomPageInteractions() {
    document.querySelectorAll('[data-workspace-case]').forEach(function(button) {
      button.onclick = function() {
        state.selectedWorkspaceCaseId = button.getAttribute('data-workspace-case');
        renderFormPages();
        refreshPageVisibility();
      };
    });

    const caseSelect = document.getElementById('workspace-case-select');
    if (caseSelect) {
      caseSelect.onchange = function() {
        state.selectedWorkspaceCaseId = caseSelect.value;
        renderFormPages();
        refreshPageVisibility();
      };
    }

    document.querySelectorAll('[data-open-case-page]').forEach(function(button) {
      button.onclick = function() {
        openWorkflowPage(button.getAttribute('data-open-case-page'), button.getAttribute('data-case-id'));
      };
    });

    document.querySelectorAll('[data-open-page]').forEach(function(button) {
      button.onclick = function() {
        openWorkflowPage(button.getAttribute('data-open-page'));
      };
    });
  }

  function getSelectedWorkspaceCase() {
    const cases = (state.bootstrap.caseWorkspace && state.bootstrap.caseWorkspace.cases) || [];
    if (!cases.length) {
      state.selectedWorkspaceCaseId = '';
      return null;
    }
    const selected = cases.find(function(item) {
      return item.caseId === state.selectedWorkspaceCaseId;
    });
    if (selected) {
      return selected;
    }
    state.selectedWorkspaceCaseId = cases[0].caseId;
    return cases[0];
  }

  function openWorkflowPage(pageId, caseId) {
    state.activePage = pageId;
    renderNavigation();
    refreshPageVisibility();
    if (!caseId) {
      return;
    }
    const targetForm = document.querySelector('form[data-form-key="' + pageId + '"]');
    if (!targetForm) {
      return;
    }
    const selector = targetForm.querySelector('.case-selector');
    if (selector) {
      selector.value = caseId;
      applyCaseLinkedDefaults(targetForm, caseId);
    }
    const hiddenCaseField = targetForm.elements.case_id;
    if (hiddenCaseField && hiddenCaseField.tagName !== 'SELECT') {
      hiddenCaseField.value = caseId;
    }
  }

  function renderSummaryCardsHtml(cards) {
    if (!cards || !cards.length) {
      return '<div class="empty-state">No summary signals available yet.</div>';
    }
    return [
      '<div class="summary-grid">',
      cards.map(function(card) {
        return [
          '<article class="summary-card tone-',
          escapeHtml(card.tone || 'teal'),
          '">',
          '<div class="summary-card-label">',
          escapeHtml(card.label),
          '</div>',
          '<div class="summary-card-value" data-counter-value="',
          escapeHtml(String(card.value)),
          '">',
          escapeHtml(String(card.value)),
          '</div>',
          '</article>'
        ].join('');
      }).join(''),
      '</div>'
    ].join('');
  }

  function renderBarRowsHtml(items, emptyText) {
    if (!items || !items.length) {
      return '<div class="empty-state">' + escapeHtml(emptyText) + '</div>';
    }
    const maxValue = Math.max.apply(null, items.map(function(item) {
      return item.value;
    }).concat([1]));
    return items.map(function(item) {
      const width = Math.max(8, Math.round((item.value / maxValue) * 100));
      return [
        '<div class="bar-row">',
        '<div class="bar-meta"><span>',
        escapeHtml(item.label),
        '</span><strong>',
        escapeHtml(String(item.value)),
        '</strong></div>',
        '<div class="bar-track"><div class="bar-fill" style="width:',
        width,
        '%"></div></div>',
        '</div>'
      ].join('');
    }).join('');
  }

  function renderSpotlightItemsHtml(items) {
    if (!items || !items.length) {
      return '<div class="empty-state">No spotlight cases yet.</div>';
    }
    return items.map(function(item) {
      return [
        '<article class="spotlight-card">',
        '<div class="spotlight-top"><strong>',
        escapeHtml(item.patientCode || item.caseId),
        '</strong>',
        renderFlag(item.priorityFlag),
        '</div>',
        '<div class="spotlight-stage">',
        escapeHtml(item.stage || item.journeyStatus || ''),
        '</div>',
        '<div class="spotlight-text">',
        escapeHtml(item.latestSummary || item.nextAction || ''),
        '</div>',
        '<div class="spotlight-meta">',
        escapeHtml(item.ownerTeam || ''),
        '</div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function renderEcosystemLayerCardsHtml(items) {
    if (!items || !items.length) {
      return '<div class="empty-state">No ecosystem layer map available yet.</div>';
    }
    return [
      '<div class="spotlight-grid ecosystem-layer-grid">',
      items.map(function(item) {
        return [
          '<article class="spotlight-card ecosystem-layer-card">',
          '<div class="spotlight-top"><strong>',
          escapeHtml(item.step + '. ' + item.title),
          '</strong>',
          item.state ? '<span class="mini-chip">' + escapeHtml(item.state) + '</span>' : '',
          '</div>',
          '<div class="spotlight-text">',
          escapeHtml(item.copy || ''),
          '</div>',
          '</article>'
        ].join('');
      }).join(''),
      '</div>'
    ].join('');
  }

  function renderInsightRowsHtml(items, emptyText) {
    if (!items || !items.length) {
      return '<div class="empty-state">' + escapeHtml(emptyText) + '</div>';
    }
    return items.map(function(item) {
      return [
        '<div class="metric-row metric-row-stack">',
        '<strong>',
        escapeHtml(item.label || ''),
        '</strong>',
        '<div class="metric-note">',
        escapeHtml(item.value || ''),
        '</div>',
        '</div>'
      ].join('');
    }).join('');
  }

  function renderFocusCardsHtml(items) {
    if (!items || !items.length) {
      return '<div class="empty-state">No phase focus notes yet.</div>';
    }
    return items.map(function(item) {
      return [
        '<article class="spotlight-card">',
        '<div class="spotlight-top"><strong>',
        escapeHtml(item.title || ''),
        '</strong></div>',
        '<div class="spotlight-text">',
        escapeHtml(item.copy || ''),
        '</div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function renderFlaggedCardsHtml(items) {
    if (!items || !items.length) {
      return '<div class="empty-state">No flagged cases yet.</div>';
    }
    return items.map(function(item) {
      return [
        '<article class="spotlight-card">',
        '<div class="spotlight-top"><strong>',
        escapeHtml(item.patientCode || item.caseId),
        '</strong>',
        renderFlag(item.riskFlag),
        '</div>',
        '<div class="spotlight-stage">',
        escapeHtml(item.lastUpdated || ''),
        '</div>',
        '<div class="spotlight-text">',
        escapeHtml(item.mainConcern || ''),
        '</div>',
        '<div class="spotlight-meta">',
        escapeHtml(item.riskReasons || ''),
        '</div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function renderWorkspaceSignalCard(label, value) {
    return [
      '<div class="workspace-signal-card">',
      '<span>',
      escapeHtml(label),
      '</span>',
      '<strong>',
      escapeHtml(value || '-'),
      '</strong>',
      '</div>'
    ].join('');
  }

  function renderLensChip(label, isReady) {
    return '<span class="lens-chip' + (isReady ? ' ready' : '') + '">' + escapeHtml(label) + '</span>';
  }

  function renderTimelineHtml(items) {
    if (!items || !items.length) {
      return '<div class="empty-state">No shared timeline events yet.</div>';
    }
    return items.map(function(item) {
      return [
        '<article class="timeline-item">',
        '<div class="timeline-dot"></div>',
        '<div class="timeline-content">',
        '<div class="timeline-meta"><span>',
        escapeHtml(item.eventAt || ''),
        '</span><span>',
        escapeHtml(item.actor || item.stage || ''),
        '</span></div>',
        '<div class="timeline-title-row"><strong>',
        escapeHtml(item.eventType || ''),
        '</strong>',
        item.queuePriority ? renderPriority(item.queuePriority) : renderFlag(item.riskFlag),
        '</div>',
        '<div class="timeline-text">',
        escapeHtml(item.summary || ''),
        '</div>',
        '</div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function renderMetricRowHtml(label, value) {
    return [
      '<div class="metric-row">',
      '<span>',
      escapeHtml(label),
      '</span>',
      '<strong>',
      escapeHtml(value || '-'),
      '</strong>',
      '</div>'
    ].join('');
  }

  function renderReferralLoopCardsHtml(items) {
    if (!items || !items.length) {
      return '<div class="empty-state">No open coordination loops right now.</div>';
    }
    return items.map(function(item) {
      var targetPage = item.lane === 'Public Sector'
        ? 'Public_Coordination'
        : item.lane === 'Partner / NGO'
          ? 'Private_Coordination'
          : 'Follow_Up';
      return [
        '<article class="loop-card">',
        '<div class="loop-card-top"><strong>',
        escapeHtml(item.patientCode || item.caseId),
        '</strong><span class="mini-chip">',
        escapeHtml(item.lane),
        '</span></div>',
        '<div class="loop-card-status-row">',
        '<span class="loop-status">',
        escapeHtml(item.status || 'Open'),
        '</span>',
        item.urgency ? '<span class="mini-chip">' + escapeHtml(item.urgency) + '</span>' : '',
        item.handoffStatus ? '<span class="mini-chip">Handoff: ' + escapeHtml(item.handoffStatus) + '</span>' : '',
        '</div>',
        '<div class="loop-card-partner">',
        escapeHtml(item.partner || ''),
        '</div>',
        '<div class="loop-card-text">',
        escapeHtml(item.nextAction || ''),
        '</div>',
        '<div class="loop-card-footer">',
        '<span>',
        escapeHtml(item.updatedAt || ''),
        '</span>',
        '<button class="ghost-button" type="button" data-open-case-page="',
        escapeHtml(targetPage),
        '" data-case-id="',
        escapeHtml(item.caseId),
        '">Open loop</button>',
        '</div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function getFormContext(formKey) {
    return (state.bootstrap.formContext && state.bootstrap.formContext[formKey]) || {};
  }

  function renderCaseSelector(formKey) {
    return [
      '<div class="form-grid case-selector-wrap">',
      '<div class="field span-2">',
      '<label>Case</label>',
      '<select name="case_id" class="case-selector" data-form-key="',
      escapeHtml(formKey),
      '">',
      '<option value="">Select case</option>',
      '</select>',
      '<div class="field-help">Use the case created from check-in or a previously opened case workflow.</div>',
      '</div>',
      '</div>'
    ].join('');
  }

  function renderField(formKey, field) {
    const context = getFormContext(formKey);
    const hiddenFields = context.hiddenFields || [];
    const fixedValues = context.fixedValues || {};
    const fixedValue = fixedValues[field.name] || '';

    if (hiddenFields.indexOf(field.name) !== -1) {
      return '<input type="hidden" name="' + escapeHtml(field.name) + '" value="' + escapeHtml(fixedValue) + '">';
    }

    const fieldClass = field.span === 2 ? 'field span-2' : 'field';
    let inputHtml = '';

    if (field.type === 'textarea') {
      inputHtml = [
        '<textarea name="',
        escapeHtml(field.name),
        '"',
        field.placeholder ? ' placeholder="' + escapeHtml(field.placeholder) + '"' : '',
        '>',
        escapeHtml(fixedValue),
        '</textarea>'
      ].join('');
    } else if (field.type === 'select') {
      inputHtml = [
        '<select name="',
        escapeHtml(field.name),
        '">',
        '<option value="">Select</option>',
        renderOptions(field.optionsKey),
        '</select>'
      ].join('');
    } else {
      inputHtml = [
        '<input type="',
        escapeHtml(field.type),
        '" name="',
        escapeHtml(field.name),
        '"',
        field.min !== undefined ? ' min="' + escapeHtml(String(field.min)) + '"' : '',
        field.max !== undefined ? ' max="' + escapeHtml(String(field.max)) + '"' : '',
        field.step !== undefined ? ' step="' + escapeHtml(String(field.step)) + '"' : '',
        field.placeholder ? ' placeholder="' + escapeHtml(field.placeholder) + '"' : '',
        fixedValue ? ' value="' + escapeHtml(fixedValue) + '"' : '',
        '>'
      ].join('');
    }

    return [
      '<div class="',
      fieldClass,
      '">',
      '<label>',
      escapeHtml(field.label),
      '</label>',
      inputHtml,
      field.help ? '<div class="field-help">' + escapeHtml(field.help) + '</div>' : '',
      '</div>'
    ].join('');
  }

  function renderOptions(optionsKey) {
    if (!state.bootstrap.optionSets || !state.bootstrap.optionSets[optionsKey]) {
      return '';
    }
    return state.bootstrap.optionSets[optionsKey].map(function(option) {
      return '<option value="' + escapeHtml(option) + '">' + escapeHtml(option) + '</option>';
    }).join('');
  }

  function applyFormContext(form) {
    const formKey = form.getAttribute('data-form-key');
    const context = getFormContext(formKey);
    const fixedValues = context.fixedValues || {};

    Object.keys(fixedValues).forEach(function(key) {
      const field = form.elements[key];
      if (field) {
        field.value = fixedValues[key];
      }
    });

    ['visit_date', 'meeting_date'].forEach(function(fieldName) {
      const field = form.elements[fieldName];
      if (field && !field.value) {
        field.value = new Date().toISOString().slice(0, 10);
      }
    });

    const preferredLanguageField = form.elements.preferred_language;
    if (preferredLanguageField && !preferredLanguageField.value) {
      preferredLanguageField.value = 'English';
    }

    const followUpField = form.elements.follow_up_due_date;
    if (followUpField && !followUpField.value) {
      followUpField.value = new Date().toISOString().slice(0, 10);
    }

    const reviewedByField = form.elements.reviewed_by;
    if (reviewedByField && !reviewedByField.value && state.bootstrap.currentUser) {
      reviewedByField.value = state.bootstrap.currentUser.displayName || '';
    }

    const consentField = form.elements.consent_acknowledged;
    if (consentField && !consentField.value) {
      consentField.value = 'Yes';
    }
  }

  function renderSpreadsheetLink() {
    const wrap = document.getElementById('sheet-link-wrap');
    const link = document.getElementById('sheet-link');
    if (!state.bootstrap.spreadsheetUrl) {
      wrap.classList.add('hidden');
      return;
    }
    wrap.classList.remove('hidden');
    link.href = state.bootstrap.spreadsheetUrl;
    link.textContent = state.bootstrap.spreadsheetName || 'Open Google Sheet';
  }

  function renderDashboard() {
    const dashboard = state.bootstrap.dashboard || buildEmptyDashboardState();
    document.getElementById('last-updated').textContent = dashboard.lastUpdated ? 'Dashboard updated ' + dashboard.lastUpdated : '';

    document.getElementById('summary-cards').innerHTML = dashboard.summaryCards.length
      ? dashboard.summaryCards.map(function(card) {
          return [
            '<article class="summary-card tone-',
            escapeHtml(card.tone || 'teal'),
            '">',
            '<div class="summary-card-label">',
            escapeHtml(card.label),
            '</div>',
            '<div class="summary-card-value" data-counter-value="',
            escapeHtml(String(card.value)),
            '">',
            escapeHtml(String(card.value)),
            '</div>',
            '</article>'
          ].join('');
        }).join('')
      : '<div class="empty-state">No dashboard data available yet.</div>';
    animateCountersIn(document.getElementById('summary-cards'));

    renderBarCollection('workflow-coverage', dashboard.workflowCoverage, 'No workflow activity yet.');
    renderBarCollection('arrival-mix', dashboard.arrivalMix, 'No intake pattern available yet.');

    document.getElementById('network-overview').innerHTML = dashboard.networkOverview.length
      ? dashboard.networkOverview.map(function(item) {
          return [
            '<div class="metric-row">',
            '<span>',
            escapeHtml(item.label),
            '</span>',
            '<strong>',
            escapeHtml(String(item.value)),
            '</strong>',
            '</div>'
          ].join('');
        }).join('')
      : '<div class="empty-state">No coordination data yet.</div>';

    document.getElementById('ai-monitoring').innerHTML = dashboard.aiMonitoring.length
      ? dashboard.aiMonitoring.map(function(item) {
          return [
            '<div class="metric-row">',
            '<span>',
            escapeHtml(item.label),
            '</span>',
            '<strong>',
            escapeHtml(String(item.value)),
            '</strong>',
            '</div>'
          ].join('');
        }).join('')
      : '<div class="empty-state">AI monitoring is not active yet.</div>';

    document.getElementById('bias-watch').innerHTML = dashboard.biasWatch.length
      ? dashboard.biasWatch.map(function(item) {
          return [
            '<div class="metric-row metric-row-stack">',
            '<span>',
            escapeHtml(item.label),
            '</span>',
            '<strong>',
            escapeHtml(String(item.value)),
            '</strong>',
            item.notes ? '<div class="metric-note">' + escapeHtml(item.notes) + '</div>' : '',
            '</div>'
          ].join('');
        }).join('')
      : '<div class="empty-state">No disagreement clusters detected yet.</div>';

    document.getElementById('risk-factors').innerHTML = dashboard.commonRiskFactors.length
      ? dashboard.commonRiskFactors.map(function(item) {
          return [
            '<div class="tag"><span>',
            escapeHtml(item.label),
            '</span><span class="tag-count">',
            escapeHtml(String(item.value)),
            '</span></div>'
          ].join('');
        }).join('')
      : '<div class="empty-state">No risk factors recorded yet.</div>';

    document.getElementById('triage-queue-table').innerHTML = dashboard.triageQueue.length
      ? dashboard.triageQueue.map(function(item) {
          return [
            '<tr>',
            '<td>',
            escapeHtml(item.patientCode),
            '</td>',
            '<td>',
            escapeHtml(item.source || '-'),
            '</td>',
            '<td>',
            renderPriority(item.queuePriority),
            '</td>',
            '<td>',
            renderFlag(item.riskFlag),
            '</td>',
            '<td>',
            escapeHtml(item.telegramStatus || ''),
            '</td>',
            '<td>',
            escapeHtml(item.queuedAt || ''),
            '</td>',
            '</tr>'
          ].join('');
        }).join('')
      : '<tr><td colspan="6" class="empty-state">No triage queue activity yet.</td></tr>';

    document.getElementById('recent-flags-table').innerHTML = dashboard.recentFlags.length
      ? dashboard.recentFlags.map(function(item) {
          return [
            '<tr>',
            '<td>',
            escapeHtml(item.patientCode),
            '</td>',
            '<td>',
            renderFlag(item.riskFlag),
            '</td>',
            '<td>',
            escapeHtml(item.mainConcern || ''),
            '</td>',
            '<td>',
            escapeHtml(item.riskReasons || ''),
            '</td>',
            '<td>',
            escapeHtml(item.lastUpdated || ''),
            '</td>',
            '</tr>'
          ].join('');
        }).join('')
      : '<tr><td colspan="5" class="empty-state">No flagged case activity yet.</td></tr>';
  }

  function renderBarCollection(targetId, items, emptyText) {
    const target = document.getElementById(targetId);
    if (!items || !items.length) {
      target.innerHTML = '<div class="empty-state">' + escapeHtml(emptyText) + '</div>';
      return;
    }

    const maxValue = Math.max.apply(null, items.map(function(item) {
      return item.value;
    }).concat([1]));

    target.innerHTML = items.map(function(item) {
      const width = Math.max(8, Math.round((item.value / maxValue) * 100));
      return [
        '<div class="bar-row">',
        '<div class="bar-meta"><span>',
        escapeHtml(item.label),
        '</span><strong>',
        escapeHtml(String(item.value)),
        '</strong></div>',
        '<div class="bar-track"><div class="bar-fill" style="width:',
        width,
        '%"></div></div>',
        '</div>'
      ].join('');
    }).join('');
  }

  function buildEmptyDashboardState() {
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

  function refreshCaseSelectors() {
    const options = state.bootstrap.caseOptions || [];
    document.querySelectorAll('.case-selector').forEach(function(select) {
      const currentValue = select.value;
      select.innerHTML = '<option value="">Select case</option>' + options.map(function(option) {
        return '<option value="' + escapeHtml(option.value) + '">' + escapeHtml(option.label) + '</option>';
      }).join('');
      if (currentValue) {
        select.value = currentValue;
        applyCaseLinkedDefaults(select.form, currentValue);
      }
      select.onchange = function() {
        applyCaseLinkedDefaults(select.form, select.value);
      };
    });
  }

  function getWorkspaceCaseById(caseId) {
    const cases = (state.bootstrap.caseWorkspace && state.bootstrap.caseWorkspace.cases) || [];
    return cases.find(function(item) {
      return item.caseId === caseId;
    }) || null;
  }

  function applyCaseLinkedDefaults(form, caseId) {
    if (!form || !caseId || !state.bootstrap.currentUser || state.bootstrap.currentUser.portalType !== 'staff') {
      return;
    }

    const formKey = form.getAttribute('data-form-key');
    const caseItem = getWorkspaceCaseById(caseId);
    if (!caseItem) {
      return;
    }

    if (formKey === 'Minimum_Necessary_Handoff') {
      if (form.elements.minimum_necessary_summary && !form.elements.minimum_necessary_summary.value && caseItem.latestSummary) {
        form.elements.minimum_necessary_summary.value = caseItem.latestSummary;
      }
      if (form.elements.crisis_safety_summary && !form.elements.crisis_safety_summary.value && caseItem.crisisSafetySummary) {
        form.elements.crisis_safety_summary.value = caseItem.crisisSafetySummary;
      }
      return;
    }

    if (formKey === 'Public_Coordination') {
      if (form.elements.shared_information && !form.elements.shared_information.value && caseItem.handoffSummary) {
        form.elements.shared_information.value = caseItem.handoffSummary;
      }
      if (form.elements.notes && !form.elements.notes.value && caseItem.doNotShare) {
        form.elements.notes.value = 'Do not share: ' + caseItem.doNotShare;
      }
      return;
    }

    if (formKey === 'Private_Coordination') {
      if (form.elements.support_needs && !form.elements.support_needs.value && caseItem.handoffSummary) {
        form.elements.support_needs.value = caseItem.handoffSummary;
      }
      if (form.elements.notes && !form.elements.notes.value && caseItem.doNotShare) {
        form.elements.notes.value = 'Do not share: ' + caseItem.doNotShare;
      }
      return;
    }

    if (formKey === 'Follow_Up') {
      if (form.elements.follow_up_notes && !form.elements.follow_up_notes.value && caseItem.handoffSummary) {
        form.elements.follow_up_notes.value = caseItem.handoffSummary;
      }
    }
  }

  function refreshPageVisibility() {
    document.querySelectorAll('.page').forEach(function(page) {
      page.classList.remove('active');
    });
    const target = document.getElementById('page-' + state.activePage);
    if (target) {
      target.classList.add('active');
    }
  }

  function toggleStaffControls() {
    const canRefresh = !!state.bootstrap.canRefreshDashboard;
    const canSeed = !!state.bootstrap.canSeedDemoData;
    document.getElementById('refresh-button').classList.toggle('hidden', !canRefresh);
    document.getElementById('seed-button').classList.toggle('hidden', !canSeed);
  }

  function bindGlobalActions() {
    document.getElementById('refresh-button').onclick = function() {
      showBanner('Refreshing dashboard...');
      runServer('refreshDashboardData', [state.bootstrap.sessionToken], function(payload) {
        state.bootstrap.dashboard = payload.dashboard;
        state.bootstrap.ecosystemHub = payload.ecosystemHub || state.bootstrap.ecosystemHub;
        state.bootstrap.caseWorkspace = payload.caseWorkspace || state.bootstrap.caseWorkspace;
        state.bootstrap.referralNetwork = payload.referralNetwork || state.bootstrap.referralNetwork;
        state.bootstrap.caseOptions = payload.caseOptions;
        state.bootstrap.staffOptions = payload.staffOptions;
        state.bootstrap.spreadsheetName = payload.spreadsheetName;
        state.bootstrap.spreadsheetUrl = payload.spreadsheetUrl;
        renderSpreadsheetLink();
        renderDashboard();
        renderFormPages();
        refreshCaseSelectors();
        showBanner('Dashboard refreshed.');
        window.setTimeout(hideBanner, 1600);
      }, function(error) {
        showBanner(error.message || 'Unable to refresh dashboard.', true);
      });
    };

    document.getElementById('seed-button').onclick = function() {
      showBanner('Seeding demo data...');
      runServer('seedDemoData', [state.bootstrap.sessionToken], function(payload) {
        state.bootstrap.dashboard = payload.dashboard;
        state.bootstrap.ecosystemHub = payload.ecosystemHub || state.bootstrap.ecosystemHub;
        state.bootstrap.caseWorkspace = payload.caseWorkspace || state.bootstrap.caseWorkspace;
        state.bootstrap.referralNetwork = payload.referralNetwork || state.bootstrap.referralNetwork;
        state.bootstrap.caseOptions = payload.caseOptions || state.bootstrap.caseOptions;
        state.bootstrap.staffOptions = payload.staffOptions || state.bootstrap.staffOptions;
        state.bootstrap.spreadsheetName = payload.spreadsheetName || state.bootstrap.spreadsheetName;
        state.bootstrap.spreadsheetUrl = payload.spreadsheetUrl || state.bootstrap.spreadsheetUrl;
        renderSpreadsheetLink();
        renderDashboard();
        renderFormPages();
        refreshCaseSelectors();
        showBanner(payload.message || 'Prototype data ready.');
        window.setTimeout(hideBanner, 2200);
      }, function(error) {
        showBanner(error.message || 'Unable to seed demo data.', true);
      });
    };

    document.getElementById('logout-button').onclick = function() {
      const token = state.bootstrap.sessionToken;
      clearStoredSessionToken();
      runServer('logoutPortal', [token], function() {
        resetToSignedOutState();
      }, function() {
        resetToSignedOutState();
      });
    };
  }

  function resetToSignedOutState() {
    state.bootstrap = {
      appTitle: state.bootstrap.appTitle,
      subtitle: state.bootstrap.subtitle,
      portalOptions: state.bootstrap.portalOptions,
      proposalNote: state.bootstrap.proposalNote,
      authenticated: false
    };
    state.selectedPortal = window.__INITIAL_PORTAL__ || 'register';
    hydrateApp();
  }

  function submitForm(form) {
    const formKey = form.getAttribute('data-form-key');
    const payload = serializeForm(form);
    const status = document.getElementById('status-' + formKey);
    status.textContent = 'Saving...';
    clearResultBox(formKey);
    showBanner('Saving ' + FORM_DEFINITIONS[formKey].description.toLowerCase() + '...');

    runServer('saveForm', [formKey, payload, state.bootstrap.sessionToken], function(result) {
      state.bootstrap.dashboard = result.dashboard || state.bootstrap.dashboard;
      state.bootstrap.ecosystemHub = result.ecosystemHub || state.bootstrap.ecosystemHub;
      state.bootstrap.caseWorkspace = result.caseWorkspace || state.bootstrap.caseWorkspace;
      state.bootstrap.referralNetwork = result.referralNetwork || state.bootstrap.referralNetwork;
      state.bootstrap.caseOptions = result.caseOptions || state.bootstrap.caseOptions;
      state.bootstrap.staffOptions = result.staffOptions || state.bootstrap.staffOptions;
      state.bootstrap.formContext = result.formContext || state.bootstrap.formContext;
      renderDashboard();
      refreshCaseSelectors();

      if (state.bootstrap.currentUser && state.bootstrap.currentUser.portalType === 'staff' && result.riskFlag) {
        status.innerHTML = renderInlineFlag(result.riskFlag, result.riskReasons);
      } else {
        status.textContent = 'Saved';
      }

      renderResultBox(formKey, result);
      showBanner(result.message || 'Saved successfully.');
      form.reset();
      applyFormContext(form);
      window.setTimeout(hideBanner, 2200);

      if (formKey === 'Patient_Checkin' &&
        state.bootstrap.currentUser &&
        state.bootstrap.currentUser.portalType === 'staff' &&
        result.caseId) {
        state.activePage = 'Clinical_Review';
        renderNavigation();
        refreshPageVisibility();
        const clinicalForm = document.querySelector('form[data-form-key="Clinical_Review"]');
        if (clinicalForm) {
          const selector = clinicalForm.querySelector('.case-selector');
          if (selector) {
            selector.value = result.caseId;
          }
        }
      }
    }, function(error) {
      status.textContent = 'Save failed';
      if (String(error.message || '').indexOf('session has expired') !== -1) {
        clearStoredSessionToken();
      }
      showBanner(error.message || 'Unable to save form.', true);
    });
  }

  function renderResultBox(formKey, result) {
    const box = document.getElementById('result-' + formKey);
    if (!box || !result) {
      return;
    }

    const chunks = [];
    if (result.generatedCodes) {
      chunks.push([
        '<div class="result-title">Generated portal codes</div>',
        '<div class="code-grid">',
        '<div class="code-chip"><span>Patient code</span><strong>',
        escapeHtml(result.generatedCodes.patientCode || ''),
        '</strong></div>',
        '<div class="code-chip"><span>Patient portal</span><strong>',
        escapeHtml(result.generatedCodes.patientPortalCode || ''),
        '</strong></div>',
        '<div class="code-chip"><span>Family portal</span><strong>',
        escapeHtml(result.generatedCodes.familyPortalCode || ''),
        '</strong></div>',
        '</div>'
      ].join(''));
    }

    if (result.aiScreening) {
      chunks.push([
        '<div class="result-title">AI-assisted screening</div>',
        '<div class="code-grid">',
        '<div class="code-chip"><span>Priority for review</span><strong>',
        escapeHtml(result.aiScreening.priorityForReview || ''),
        '</strong></div>',
        '<div class="code-chip"><span>AI confidence</span><strong>',
        escapeHtml(result.aiScreening.aiConfidence || ''),
        '</strong></div>',
        '<div class="code-chip"><span>Agreement</span><strong>',
        escapeHtml(result.aiScreening.agreementStatus || ''),
        '</strong></div>',
        '</div>',
        '<div class="code-grid">',
        '<div class="code-chip"><span>Matched service</span><strong>',
        escapeHtml(result.aiScreening.triageDestination || 'Not set'),
        '</strong></div>',
        '<div class="code-chip"><span>Triage urgency</span><strong>',
        escapeHtml(result.aiScreening.triageUrgency || 'Routine'),
        '</strong></div>',
        '<div class="code-chip"><span>Follow-up window</span><strong>',
        escapeHtml(result.aiScreening.followUpWindow || 'Routine'),
        '</strong></div>',
        '</div>',
        '<div class="result-text">',
        escapeHtml(result.aiScreening.validationStatus || ''),
        '</div>',
        result.aiScreening.recommendedService
          ? '<div class="result-text"><strong>Recommended service:</strong> ' + escapeHtml(result.aiScreening.recommendedService) + '</div>'
          : '',
        result.aiScreening.mdtFocus
          ? '<div class="result-text"><strong>MDT focus:</strong> ' + escapeHtml(result.aiScreening.mdtFocus) + '</div>'
          : '',
        result.aiScreening.selfHelpGuidance
          ? '<div class="result-text"><strong>Self-help / psychoeducation:</strong> ' + escapeHtml(result.aiScreening.selfHelpGuidance) + '</div>'
          : '',
        result.aiScreening.emergencyAction
          ? '<div class="result-text"><strong>Emergency action:</strong> ' + escapeHtml(result.aiScreening.emergencyAction) + '</div>'
          : '',
        result.aiScreening.aiReasons && result.aiScreening.aiReasons.length
          ? '<div class="result-meta">' + result.aiScreening.aiReasons.map(function(reason) {
              return '<span class="mini-chip">' + escapeHtml(reason) + '</span>';
            }).join('') + '</div>'
          : '',
        result.aiScreening.aiSummary
          ? '<div class="result-text">' + escapeHtml(result.aiScreening.aiSummary) + '</div>'
          : ''
      ].join(''));
    }

    if (result.bprsScore || result.bprsInterpretation) {
      chunks.push([
        '<div class="result-title">BPRS 18-item severity</div>',
        '<div class="code-grid">',
        '<div class="code-chip"><span>Total score</span><strong>',
        escapeHtml(result.bprsScore || 'Not recorded'),
        '</strong></div>',
        '<div class="code-chip"><span>Interpretation</span><strong>',
        escapeHtml(result.bprsInterpretation || 'Not recorded'),
        '</strong></div>',
        '<div class="code-chip"><span>Use</span><strong>Clinical severity</strong></div>',
        '</div>',
        '<div class="result-text">BPRS interpretation is shown as a clinical severity aid and does not automatically change the triage decision.</div>'
      ].join(''));
    }

    const meta = [];
    if (result.caseId) {
      meta.push('<span class="mini-chip">Case: ' + escapeHtml(result.caseId) + '</span>');
    }
    if (result.queuePriority) {
      meta.push('<span class="mini-chip">Queue: ' + escapeHtml(result.queuePriority) + '</span>');
    }
    if (result.patientCode) {
      meta.push('<span class="mini-chip">Patient: ' + escapeHtml(result.patientCode) + '</span>');
    }
    if (meta.length) {
      chunks.push('<div class="result-meta">' + meta.join('') + '</div>');
    }

    if (result.message) {
      chunks.push('<div class="result-text">' + escapeHtml(result.message) + '</div>');
    }

    if (!chunks.length) {
      box.classList.add('hidden');
      box.innerHTML = '';
      return;
    }

    box.innerHTML = chunks.join('');
    box.classList.remove('hidden');
  }

  function clearResultBox(formKey) {
    const box = document.getElementById('result-' + formKey);
    if (!box) {
      return;
    }
    box.classList.add('hidden');
    box.innerHTML = '';
  }

  function animateCountersIn(root) {
    if (!root) {
      return;
    }
    root.querySelectorAll('[data-counter-value]').forEach(function(element) {
      const rawValue = element.getAttribute('data-counter-value');
      if (!/^\d+$/.test(rawValue || '')) {
        element.textContent = rawValue || '';
        return;
      }
      const target = parseInt(rawValue, 10);
      const duration = 650;
      const start = performance.now();

      function frame(now) {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = String(Math.round(target * eased));
        if (progress < 1) {
          window.requestAnimationFrame(frame);
        } else {
          element.textContent = String(target);
        }
      }

      window.requestAnimationFrame(frame);
    });
  }

  function serializeForm(form) {
    const data = {};
    Array.prototype.slice.call(form.elements).forEach(function(field) {
      if (!field.name) {
        return;
      }
      data[field.name] = field.value;
    });
    return data;
  }

  function renderFlag(flag) {
    const className = 'flag flag-' + String(flag || 'Green').toLowerCase();
    return '<span class="' + className + '">' + escapeHtml(flag || 'Green') + '</span>';
  }

  function renderPriority(priority) {
    const normalized = String(priority || 'Routine').toLowerCase();
    return '<span class="priority-pill priority-' + escapeHtml(normalized) + '">' + escapeHtml(priority || 'Routine') + '</span>';
  }

  function renderInlineFlag(flag, reasons) {
    const reasonText = reasons && reasons.length ? ' - ' + reasons.join(', ') : '';
    return renderFlag(flag) + '<span class="inline-flag-text">' + escapeHtml(reasonText) + '</span>';
  }

  function showBanner(message, isError) {
    const target = state.bootstrap && state.bootstrap.authenticated
      ? document.getElementById('message-banner')
      : document.getElementById('auth-banner');
    const other = state.bootstrap && state.bootstrap.authenticated
      ? document.getElementById('auth-banner')
      : document.getElementById('message-banner');

    if (other) {
      other.classList.add('hidden');
      other.classList.remove('error');
      other.textContent = '';
    }

    target.classList.remove('hidden');
    target.classList.toggle('error', !!isError);
    target.textContent = message;
  }

  function hideBanner() {
    ['auth-banner', 'message-banner'].forEach(function(id) {
      const element = document.getElementById(id);
      element.classList.add('hidden');
      element.classList.remove('error');
      element.textContent = '';
    });
  }

  function runServer(functionName, args, onSuccess, onFailure) {
    const runner = google.script.run
      .withSuccessHandler(onSuccess)
      .withFailureHandler(function(error) {
        onFailure(error || new Error('Unknown error'));
      });
    runner[functionName](...(args || []));
  }

  function getStoredSessionToken() {
    try {
      return window.localStorage.getItem(SESSION_STORAGE_KEY) || '';
    } catch (error) {
      return '';
    }
  }

  function storeSessionToken(token) {
    try {
      window.localStorage.setItem(SESSION_STORAGE_KEY, token || '');
    } catch (error) {}
  }

  function clearStoredSessionToken() {
    try {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (error) {}
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
</script>

```

