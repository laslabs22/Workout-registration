/**
 * Træningsregistrering -> Google Kalender (backend)
 *
 * Deployes som Google Apps Script web-app ("Udfør som: mig", "Adgang: Alle").
 * Selve appen (forsiden med ikon) ligger i /docs og kalder denne URL.
 */

const DEFAULT_KM = 12;
const STALE_HOURS = 6;          // En "glemt" træning ældre end dette startes forfra
const START_KEY = 'trainingStart';

/** Appen sender POST med JSON: {action: "state" | "restart" | "save", km?: number} */
function doPost(e) {
  let result;
  try {
    const req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (req.action === 'save') result = save(req.km);
    else if (req.action === 'restart') result = restart();
    else result = getState();
    result.ok = true;
  } catch (err) {
    result = { ok: false, error: String(err && err.message || err) };
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Bruges kun til at teste, at URL'en virker. */
function doGet() {
  return ContentService.createTextOutput('OK - træningsappens backend kører.');
}

/** Starter en træning, hvis der ikke allerede kører en. */
function getState() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const props = PropertiesService.getScriptProperties();
    const now = Date.now();
    let start = Number(props.getProperty(START_KEY));
    if (!start || now - start > STALE_HOURS * 3600 * 1000) {
      start = now;
      props.setProperty(START_KEY, String(start));
    }
    return { start: start, now: now, defaultKm: DEFAULT_KM };
  } finally {
    lock.releaseLock();
  }
}

/** Starter tidtagningen forfra. */
function restart() {
  PropertiesService.getScriptProperties().deleteProperty(START_KEY);
  return getState();
}

/** Opretter eventet fra starttidspunkt til nu og nulstiller. */
function save(km) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const props = PropertiesService.getScriptProperties();
    const start = Number(props.getProperty(START_KEY));
    if (!start) throw new Error('Ingen igangværende træning.');

    km = Number(km);
    if (!isFinite(km) || km <= 0) km = DEFAULT_KM;

    const end = Date.now();
    const minutes = (end - start) / 60000;
    const title = formatNumber(km) + ' på ' + formatNumber(minutes, 2);

    const event = CalendarApp.getDefaultCalendar()
      .createEvent(title, new Date(start), new Date(end));
    event.setColor(CalendarApp.EventColor.RED);

    props.deleteProperty(START_KEY);
    return { title: title, start: start, end: end };
  } finally {
    lock.releaseLock();
  }
}

/** Talformat med punktum som decimaltegn. */
function formatNumber(n, decimals) {
  return decimals === undefined ? String(Math.round(n * 10) / 10) : n.toFixed(decimals);
}
