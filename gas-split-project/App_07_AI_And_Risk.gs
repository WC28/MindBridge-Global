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

