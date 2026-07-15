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

function getFullStaffPortalData_() {
  return {
    dashboard: getDashboardData_(),
    ecosystemHub: getEcosystemHubData_(),
    caseWorkspace: getCaseWorkspaceData_(),
    referralNetwork: getReferralNetworkData_()
  };
}

function refreshDashboardSheet_(dashboard) {
  dashboard = dashboard || getDashboardData_();
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
