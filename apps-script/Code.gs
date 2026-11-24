/**
 * Træningsregistrering -> Google Kalender
 *
 * Deployes som Google Apps Script web-app ("Udfør som: mig", "Adgang: Alle"),
 * så eventet oprettes direkte i din egen kalender uden login på telefonen.
 */

const DEFAULT_KM = 12;
const STALE_HOURS = 6;          // En "glemt" træning ældre end dette startes forfra
const START_KEY = 'trainingStart';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Træning')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
}

/** Kaldes når appen åbnes. Starter en træning, hvis der ikke allerede kører en. */
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

/** Starter tidtagningen forfra (fx hvis appen blev åbnet ved en fejl). */
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
    const title = 'Træning ' + formatNumber(km) + ' på ' + formatNumber(minutes, 1);

    const event = CalendarApp.getDefaultCalendar()
      .createEvent(title, new Date(start), new Date(end));
    event.setColor(CalendarApp.EventColor.RED);

    props.deleteProperty(START_KEY);
    return { title: title, start: start, end: end };
  } finally {
    lock.releaseLock();
  }
}

/** Dansk talformat: komma som decimaltegn. */
function formatNumber(n, decimals) {
  const s = decimals === undefined ? String(Math.round(n * 10) / 10) : n.toFixed(decimals);
  return s.replace('.', ',');
}
