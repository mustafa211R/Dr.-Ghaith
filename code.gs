/**
 * Google Apps Script Backend - عيادة الدكتور غيث التميمي
 * ========================================================
 * خطوات التنصيب والتشغيل:
 * 1. افتح جدول بيانات Google Sheets جديد أو اربطه عبر Extensions -> Apps Script.
 * 2. الصق هذا الكود بالكامل داخل ملف Code.gs واحفظه.
 * 3. اختر الدالة setup من القائمة العلوية واضغط Run (تشغيل) لمنح الصلاحيات وتنصيب الأوراق تلقائياً.
 * 4. اضغط Deploy -> New deployment -> Web app:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. انسخ رابط Web App الناتج وضعه داخل ملف pic.js في حقل APPS_SCRIPT_URL.
 */

var CLINIC_CONFIG = {
  DOCTOR_CODE: 'cbc2000',
  BOOKINGS_SHEET: 'Bookings',
  VISITS_SHEET: 'Visits',
  SETTINGS_SHEET: 'Settings',
  TIMEZONE: 'Asia/Baghdad'
};

/**
 * دالة التنصيب الشاملة: تنشئ جميع الأوراق والأعمدة والتنسيقات وتهيئة العدادات
 */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    ss = SpreadsheetApp.create('قاعدة بيانات عيادة الدكتور غيث التميمي');
  }

  // 1. إنشاء وتنسيق ورقة الحجوزات (Bookings)
  var bookingsHeaders = [
    'id',
    'queueNumber',
    'bookingDate',
    'fullName',
    'phone',
    'condition',
    'status',
    'createdAt'
  ];
  var bookingsSheet = ensureSheet_(ss, CLINIC_CONFIG.BOOKINGS_SHEET, bookingsHeaders);
  bookingsSheet.setColumnWidth(1, 150);
  bookingsSheet.setColumnWidth(2, 110);
  bookingsSheet.setColumnWidth(3, 130);
  bookingsSheet.setColumnWidth(4, 220);
  bookingsSheet.setColumnWidth(5, 160);
  bookingsSheet.setColumnWidth(6, 280);
  bookingsSheet.setColumnWidth(7, 130);
  bookingsSheet.setColumnWidth(8, 190);

  // 2. إنشاء وتنسيق ورقة الزيارات (Visits)
  var visitsHeaders = [
    'date',
    'count',
    'lastUpdated'
  ];
  var visitsSheet = ensureSheet_(ss, CLINIC_CONFIG.VISITS_SHEET, visitsHeaders);
  visitsSheet.setColumnWidth(1, 140);
  visitsSheet.setColumnWidth(2, 120);
  visitsSheet.setColumnWidth(3, 210);

  // تهيئة صف إجمالي الزيارات إن لم يكن موجوداً
  if (visitsSheet.getLastRow() < 2) {
    visitsSheet.appendRow(['TOTAL', 0, new Date().toISOString()]);
    visitsSheet.appendRow([todayDateStr_(), 0, new Date().toISOString()]);
  }

  // 3. إنشاء وتنسيق ورقة الإعدادات (Settings)
  var settingsHeaders = ['key', 'value', 'description'];
  var settingsSheet = ensureSheet_(ss, CLINIC_CONFIG.SETTINGS_SHEET, settingsHeaders);
  settingsSheet.setColumnWidth(1, 180);
  settingsSheet.setColumnWidth(2, 260);
  settingsSheet.setColumnWidth(3, 320);

  if (settingsSheet.getLastRow() < 2) {
    settingsSheet.appendRow(['clinic_name', 'عيادة الدكتور غيث التميمي', 'اسم العيادة الرسمي']);
    settingsSheet.appendRow(['specialty', 'دكتوراه في أمراض الدم السريري', 'التخصص والشهادة']);
    settingsSheet.appendRow(['doctor_code', CLINIC_CONFIG.DOCTOR_CODE, 'كود التحقق الخاص بالدكتور لعرض بروفايل المريض']);
    settingsSheet.appendRow(['sheet_url', ss.getUrl(), 'رابط جدول البيانات']);
  }

  Logger.log('تم تنصيب نظام عيادة الدكتور غيث التميمي بنجاح! رابط الجدول: ' + ss.getUrl());
  return {
    ok: true,
    message: 'تم التنصيب بنجاح',
    spreadsheetId: ss.getId(),
    spreadsheetUrl: ss.getUrl()
  };
}

function ensureSheet_(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#0b1f3a');
  headerRange.setFontColor('#c9a227');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
  return sheet;
}

function todayDateStr_() {
  return Utilities.formatDate(new Date(), CLINIC_CONFIG.TIMEZONE, 'yyyy-MM-dd');
}

function getOrSetupSpreadsheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName(CLINIC_CONFIG.BOOKINGS_SHEET) || !ss.getSheetByName(CLINIC_CONFIG.VISITS_SHEET)) {
    setup();
  }
  return ss;
}

function sheetToObjects_(sheet) {
  if (!sheet || sheet.getLastRow() < 2) return [];
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    var hasValue = false;
    for (var j = 0; j < headers.length; j++) {
      var val = data[i][j];
      if (val instanceof Date) {
        // تنسيق التاريخ إلى YYYY-MM-DD إن كان في عمود bookingDate أو date
        if (headers[j] === 'bookingDate' || headers[j] === 'date') {
          val = Utilities.formatDate(val, CLINIC_CONFIG.TIMEZONE, 'yyyy-MM-dd');
        } else {
          val = val.toISOString();
        }
      }
      obj[headers[j]] = val;
      if (String(val).trim() !== '') hasValue = true;
    }
    if (hasValue) rows.push(obj);
  }
  return rows;
}

function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * معالجة طلبات القراءة (GET)
 * ?action=all | bookings | visits | incrementVisit
 */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action) : 'all';
    var ss = getOrSetupSpreadsheet_();

    if (action === 'incrementVisit') {
      var visitRes = incrementVisitInternal_(ss);
      return jsonOut_({ ok: true, visits: visitRes });
    }

    if (action === 'bookings') {
      var bookings = getBookingsList_(ss);
      return jsonOut_({ ok: true, bookings: bookings });
    }

    if (action === 'visits') {
      var visits = getVisitsSummary_(ss);
      return jsonOut_({ ok: true, visits: visits });
    }

    return jsonOut_({
      ok: true,
      bookings: getBookingsList_(ss),
      visits: getVisitsSummary_(ss),
      today: todayDateStr_()
    });
  } catch (err) {
    return jsonOut_({ ok: false, error: err.message || String(err) });
  }
}

/**
 * معالجة طلبات الكتابة (POST)
 * actions: book | visit | updateStatus | verifyDoctor
 */
function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var payload = JSON.parse(raw);
    var action = payload.action || '';
    var ss = getOrSetupSpreadsheet_();

    if (action === 'book') {
      return jsonOut_(createBooking_(ss, payload));
    }

    if (action === 'visit') {
      var visits = incrementVisitInternal_(ss);
      return jsonOut_({ ok: true, visits: visits });
    }

    if (action === 'verifyDoctor') {
      var ok = String(payload.code || '').trim() === CLINIC_CONFIG.DOCTOR_CODE;
      return jsonOut_({ ok: ok, verified: ok });
    }

    if (action === 'updateStatus') {
      if (String(payload.code || '').trim() !== CLINIC_CONFIG.DOCTOR_CODE) {
        return jsonOut_({ ok: false, error: 'كود الدكتور غير صحيح' });
      }
      return jsonOut_(updateBookingStatus_(ss, payload.id, payload.status));
    }

    return jsonOut_({ ok: false, error: 'إجراء غير معروف' });
  } catch (err) {
    return jsonOut_({ ok: false, error: err.message || String(err) });
  }
}

function getBookingsList_(ss) {
  var sheet = ss.getSheetByName(CLINIC_CONFIG.BOOKINGS_SHEET);
  var rows = sheetToObjects_(sheet);
  return rows.map(function (r) {
    return {
      id: String(r.id || ''),
      queueNumber: Number(r.queueNumber || 0),
      bookingDate: String(r.bookingDate || ''),
      fullName: String(r.fullName || ''),
      phone: String(r.phone || ''),
      condition: String(r.condition || ''),
      status: String(r.status || 'بانتظار المراجعة'),
      createdAt: String(r.createdAt || '')
    };
  });
}

function createBooking_(ss, payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var fullName = String(payload.fullName || '').trim();
    var phone = String(payload.phone || '').trim();
    var bookingDate = String(payload.bookingDate || todayDateStr_()).trim();
    var condition = String(payload.condition || '').trim();

    if (fullName.length < 3 || phone.length < 7) {
      return { ok: false, error: 'يرجى إدخال الاسم الثلاثي ورقم الهاتف بشكل صحيح' };
    }

    var sheet = ss.getSheetByName(CLINIC_CONFIG.BOOKINGS_SHEET);
    var existing = getBookingsList_(ss);
    var maxQueue = 0;
    for (var i = 0; i < existing.length; i++) {
      if (existing[i].bookingDate === bookingDate && existing[i].queueNumber > maxQueue) {
        maxQueue = existing[i].queueNumber;
      }
    }

    var nextQueue = maxQueue + 1;
    var id = 'bk_' + new Date().getTime() + '_' + Math.floor(Math.random() * 1000);
    var createdAt = new Date().toISOString();
    var status = 'بانتظار المراجعة';

    sheet.appendRow([
      id,
      nextQueue,
      bookingDate,
      fullName,
      phone,
      condition,
      status,
      createdAt
    ]);

    return {
      ok: true,
      booking: {
        id: id,
        queueNumber: nextQueue,
        bookingDate: bookingDate,
        fullName: fullName,
        phone: phone,
        condition: condition,
        status: status,
        createdAt: createdAt
      }
    };
  } finally {
    lock.releaseLock();
  }
}

function updateBookingStatus_(ss, id, newStatus) {
  var sheet = ss.getSheetByName(CLINIC_CONFIG.BOOKINGS_SHEET);
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.getRange(i + 1, 7).setValue(String(newStatus || 'تم الفحص'));
      return { ok: true, id: id, status: newStatus };
    }
  }
  return { ok: false, error: 'الحجز غير موجود' };
}

function getVisitsSummary_(ss) {
  var sheet = ss.getSheetByName(CLINIC_CONFIG.VISITS_SHEET);
  var rows = sheetToObjects_(sheet);
  var today = todayDateStr_();
  var total = 0;
  var todayCount = 0;
  var dailyHistory = [];

  for (var i = 0; i < rows.length; i++) {
    var d = String(rows[i].date || '');
    var c = Number(rows[i].count || 0);
    if (d === 'TOTAL') {
      total = c;
    } else if (d) {
      if (d === today) todayCount = c;
      dailyHistory.push({ date: d, count: c });
    }
  }

  return {
    totalVisits: total,
    todayVisits: todayCount,
    today: today,
    dailyHistory: dailyHistory.slice(-14)
  };
}

function incrementVisitInternal_(ss) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = ss.getSheetByName(CLINIC_CONFIG.VISITS_SHEET);
    var data = sheet.getDataRange().getValues();
    var today = todayDateStr_();
    var nowIso = new Date().toISOString();

    var totalRow = -1;
    var todayRow = -1;

    for (var i = 1; i < data.length; i++) {
      var cellDate = data[i][0];
      if (cellDate instanceof Date) {
        cellDate = Utilities.formatDate(cellDate, CLINIC_CONFIG.TIMEZONE, 'yyyy-MM-dd');
      } else {
        cellDate = String(cellDate || '').trim();
      }
      if (cellDate === 'TOTAL') totalRow = i + 1;
      if (cellDate === today) todayRow = i + 1;
    }

    if (totalRow === -1) {
      sheet.appendRow(['TOTAL', 1, nowIso]);
    } else {
      var nextTotal = (Number(data[totalRow - 1][1]) || 0) + 1;
      sheet.getRange(totalRow, 2).setValue(nextTotal);
      sheet.getRange(totalRow, 3).setValue(nowIso);
    }

    if (todayRow === -1) {
      sheet.appendRow([today, 1, nowIso]);
    } else {
      var nextToday = (Number(data[todayRow - 1][1]) || 0) + 1;
      sheet.getRange(todayRow, 2).setValue(nextToday);
      sheet.getRange(todayRow, 3).setValue(nowIso);
    }

    return getVisitsSummary_(ss);
  } finally {
    lock.releaseLock();
  }
}
