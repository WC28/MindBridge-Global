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
