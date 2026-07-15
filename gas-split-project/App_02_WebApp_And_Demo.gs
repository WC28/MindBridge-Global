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
  return mergeObjects_(base, buildAuthenticatedBootstrap_(session, {
    liteStaffLoad: session.portalType === 'staff'
  }));
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
  return mergeObjects_(buildBaseBootstrap_(), buildAuthenticatedBootstrap_(session, {
    liteStaffLoad: normalizedPortalType === 'staff'
  }));
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
  const portalData = session.portalType === 'staff' ? getFullStaffPortalData_() : null;
  refreshDashboardSheet_(portalData ? portalData.dashboard : null);

  const response = sanitizeSaveResponseForSession_(session, result);
  const portalState = buildAuthenticatedBootstrap_(session, portalData ? {
    portalData: portalData
  } : null);
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

  const portalData = getFullStaffPortalData_();
  refreshDashboardSheet_(portalData.dashboard);
  const portalState = buildAuthenticatedBootstrap_(session, {
    portalData: portalData
  });
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
    const existingPortalData = getFullStaffPortalData_();
    const existingPortalState = buildAuthenticatedBootstrap_(session, {
      portalData: existingPortalData
    });
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

  const portalData = getFullStaffPortalData_();
  refreshDashboardSheet_(portalData.dashboard);
  const portalState = buildAuthenticatedBootstrap_(session, {
    portalData: portalData
  });
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
