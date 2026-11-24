# Træningsregistrering → Google Kalender

En lille app til mobilens startskærm med et stopur-ikon. Når du åbner den, starter tiden. Vælg km (5–20, standard 12) og tryk **Gem**.
Så oprettes et rødt event i din Google Kalender fra starttidspunktet til nu, med titlen
`12 på 34.50` (km på minutter med 2 decimaler).

Løsningen består af to dele:

- **`apps-script/`** er backend. Det er et Google Apps Script, der kører som dig og opretter eventet. Derfor skal du ikke logge ind på telefonen.
- **`docs/`** er selve appen med ikon. Den hostes på GitHub Pages og åbner i fuld skærm uden browserlinje.

## 1. Backend (Google Apps Script)

1. Erstat indholdet af `Code.gs` i dit projekt på script.google.com med `apps-script/Code.gs`, og gem.
2. Slet filen `index.html` i Apps Script-projektet, hvis du har oprettet den. Den skal ikke bruges længere.
3. Klik **Implementer → Administrer implementeringer → ✏️ Rediger → Version: Ny version → Implementer**.
   Det skal stadig være *Udfør som: Mig* og *Adgang: Alle*.
4. Kopiér web-app-URL'en (`https://script.google.com/macros/s/.../exec`).
   Hvis du åbner den i en browser, skal der stå "OK - træningsappens backend kører."

## 2. Appen (GitHub Pages)

GitHub Pages kræver et offentligt repo, medmindre du har GitHub Pro. Koden indeholder ingen hemmeligheder,
fordi din script-URL kun gemmes på telefonen.

1. På GitHub: **Settings → General → Danger Zone → Change visibility → Public**.
2. **Settings → Pages → Source: Deploy from a branch → Branch: `ccr-3d7fd4e0-eidprx`, mappe `/docs` → Save**.
3. Efter ca. 1 minut ligger appen på `https://laslabs22.github.io/Workout-registration/`.

## 3. Telefonen

**iPhone:** Åbn adressen i **Safari**, tryk på Del-knappen og vælg **Føj til hjemmeskærm**.
**Android:** Åbn adressen i **Chrome**, tryk på ⋮ og vælg **Installér app / Føj til startskærm**.

Åbn appen fra ikonet på startskærmen, **ikke fra browseren**. Første gang skal du indsætte din `/exec`-URL og trykke **Gem**.
Det sker kun én gang.

## Brug

- **Ved start:** tryk på ikonet, og tiden starter.
- **Undervejs:** du kan godt lukke appen. Starttidspunktet er gemt hos Google, så tiden fortsætter.
- **Ved slut:** åbn appen, vælg km, tryk **Gem**, og luk appen.
- Næste gang du åbner appen, starter en ny træning automatisk.
- **"Start tiden forfra"** nulstiller starttidspunktet til nu.
- En træning, der ikke er gemt inden for 6 timer, kasseres.

## Bemærk

- Script-URL'en er hemmelig. Alle, der kender den, kan oprette events i din kalender.
- Du kan ændre farve, standard-km og talformat i `apps-script/Code.gs`.
