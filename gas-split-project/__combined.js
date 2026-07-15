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

  document.addEventListener('DOMContentLoaded', initializeApp);
