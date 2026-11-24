# Træningsregistrering → Google Kalender

En lille web-app til mobilens startskærm. Når du åbner den, starter tiden. Vælg km (5–20, standard 12) og tryk **Gem**.
Så oprettes et rødt event i din Google Kalender fra starttidspunktet til nu, med titlen
`12 på 34.50` (km på minutter med 2 decimaler).

Appen kører som et Google Apps Script under din egen Google-konto. Derfor skal du ikke logge ind på telefonen.

## Opsætning (én gang, ca. 5 min)

1. Gå til <https://script.google.com> (logget ind med din Gmail) og klik **Nyt projekt**.
2. Kopiér indholdet af `apps-script/Code.gs` ind i `Code.gs`.
3. Klik **+ → HTML**, kald filen `index`, og kopiér indholdet af `apps-script/index.html` ind.
4. *(Valgfrit)* Under **Projektindstillinger** skal du slå "Vis manifestfilen appsscript.json" til og indsætte `apps-script/appsscript.json`. Den sætter tidszonen til Europe/Copenhagen.
5. Klik **Implementer → Ny implementering → Type: Webapp**
   - *Udfør som:* **Mig**
   - *Hvem har adgang:* **Alle**
6. Klik **Implementer** og giv adgang til din kalender. Det er den eneste gang, du skal godkende noget.
7. Kopiér web-app-URL'en (`https://script.google.com/macros/s/.../exec`).
8. Åbn URL'en på telefonen og vælg **Føj til hjemmeskærm** (Safari: Del-knappen, Chrome: ⋮-menuen).

## Brug

- **Ved start:** tryk på ikonet. Tiden starter og vises på skærmen.
- **Undervejs:** du kan godt lukke appen. Starttidspunktet er gemt på serveren, så tiden fortsætter, når du åbner den igen.
- **Ved slut:** åbn appen, justér km med slider eller +/−, og tryk **Gem**.
- **"Start tiden forfra"** nulstiller starttidspunktet til nu, fx hvis du åbnede appen for tidligt.
- En træning, der ikke er gemt inden for 6 timer, kasseres, og der startes en ny.

## Bemærk

- URL'en er hemmelig. Alle, der kender den, kan oprette events i din kalender, så del den ikke.
- Hvis du ændrer koden senere: **Implementer → Administrer implementeringer → Rediger → Ny version**. Så beholder du den samme URL.
- Du kan ændre farven i `Code.gs` med `CalendarApp.EventColor.RED`, standard-km med `DEFAULT_KM` og talformatet i `formatNumber`.
