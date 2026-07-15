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

function buildAuthenticatedBootstrap_(session, options) {
  options = options || {};
  const spreadsheet = getSpreadsheet_();
  const isStaff = session.portalType === 'staff';
  const canSeeCaseOptions = ['staff', 'public', 'private'].indexOf(session.portalType) !== -1;
  const liteStaffLoad = isStaff && !!options.liteStaffLoad;
  const portalData = options.portalData || {};

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
    defaultPage: session.portalType === 'staff' ? 'dashboard' : getAllowedPagesForPortalType_(session.portalType)[0],
    optionSets: OPTION_SETS,
    caseOptions: canSeeCaseOptions ? getCaseOptions_() : [],
    staffOptions: isStaff ? getStaffOptions_() : [],
    dashboard: isStaff ? (liteStaffLoad ? buildEmptyDashboard_() : (portalData.dashboard || getDashboardData_())) : buildEmptyDashboard_(),
    ecosystemHub: isStaff ? (liteStaffLoad ? buildEmptyEcosystemHub_() : (portalData.ecosystemHub || getEcosystemHubData_())) : buildEmptyEcosystemHub_(),
    caseWorkspace: isStaff ? (liteStaffLoad ? buildEmptyCaseWorkspace_() : (portalData.caseWorkspace || getCaseWorkspaceData_())) : buildEmptyCaseWorkspace_(),
    referralNetwork: isStaff ? (liteStaffLoad ? buildEmptyReferralNetwork_() : (portalData.referralNetwork || getReferralNetworkData_())) : buildEmptyReferralNetwork_(),
    formContext: getFormContextForSession_(session),
    canRefreshDashboard: isStaff,
    canSeedDemoData: isStaff,
    needsStaffHydration: liteStaffLoad,
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
