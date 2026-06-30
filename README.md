# Skyrud Media — nettsideguide

Enkel guide for å oppdatere innhold på nettsiden. Ingen admin-panel — alt gjøres ved å redigere filer i prosjektet og pushe til GitHub. Vercel deployer automatisk.

## Kom i gang lokalt

```bash
npm install
npm run dev
```

Åpne [http://localhost:3000/no](http://localhost:3000/no) (norsk) eller [http://localhost:3000/en](http://localhost:3000/en) (engelsk) i nettleseren. Rot-URL (`/`) sender deg automatisk til `/no`.

Bygg for produksjon:

```bash
npm run build
```

---

## Språk (norsk / engelsk)

Nettsiden finnes på **`/no`** og **`/en`**. Standard er norsk.

**Automatisk språkvalg:** Når noen besøker forsiden (`/`) uten lagret preferanse, sendes de til `/no` eller `/en` basert på nettleserens språkinnstillinger (`Accept-Language`). Valget huskes i en cookie — manuelt språkbytte i headeren overstyrer ved neste besøk.

| Hva | Hvor |
|-----|------|
| Norsk tekst | `messages/no.json` |
| Engelsk tekst | `messages/en.json` |
| Språkvelger | Header (NO / EN) |

**Portfolio-tekst** (tittel, kategori, alt-tekst) ligger i begge filene under `portfolio.items.{id}`:

```json
"portfolio": {
  "items": {
    "mitt-prosjekt": {
      "title": "Mitt prosjekt",
      "category": "Kortfilm",
      "alt": "Beskrivelse av bildet"
    }
  }
}
```

Legg til samme nøkkel i **både** `no.json` og `en.json` når du legger til nytt arbeid.

---

## Legge til portfolio-arbeid

Media og teknisk info ligger i **`lib/portfolio.ts`** (`PORTFOLIO_ITEMS`). Tekst ligger i **`messages/no.json`** og **`messages/en.json`**.

### Steg 1 — Last opp filer

Legg media i `public/`:

| Type | Mappe | Eksempel |
|------|-------|----------|
| Thumbnail / foto | `public/images/` | `mitt-prosjekt.jpg` |
| Preview-video | `public/videos/` | `mitt-prosjekt.mp4` |

Tips for video:
- Hold preview-klipp korte (noen sekunder til ~30 sek)
- Komprimer gjerne før opplasting — store `.mp4`-filer gjør repoet tungt
- MP4 med H.264 fungerer best i nettlesere

### Steg 2 — Legg til media i `lib/portfolio.ts`

Åpne `lib/portfolio.ts` og lim inn et nytt objekt i `PORTFOLIO_ITEMS`:

```ts
{
  id: "mitt-prosjekt",
  type: "short-film",
  src: "/images/mitt-prosjekt.jpg",
  previewSrc: "/videos/mitt-prosjekt.mp4",
  watchUrl: "https://www.tiktok.com/@bruker/video/1234567890",
  ratio: 16 / 9,
},
```

### Steg 3 — Legg til tekst i begge språkfiler

I `messages/no.json` og `messages/en.json`, under `portfolio.items`:

```json
"mitt-prosjekt": {
  "title": "Mitt prosjekt",
  "category": "Kortfilm",
  "alt": "Kort beskrivelse for skjermlesere"
}
```

### Steg 4 — Push endringene

```bash
git add .
git commit -m "Legg til portfolio: Mitt prosjekt"
git push
```

Vercel bygger og publiserer siden på noen minutter.

---

## Feltforklaring

| Felt | Påkrevd | Beskrivelse |
|------|---------|-------------|
| `id` | Ja | Unik ID — brukes også som nøkkel i `messages/*.json` under `portfolio.items` |
| `type` | Ja | `short-film`, `tiktok`, eller `photography` |
| `src` | Ja | Bilde-URL fra `public/`, f.eks. `/images/navn.jpg` |
| `previewSrc` | Nei* | Preview-video for film/TikTok. Utelat for fotografi |
| `watchUrl` | Nei | Lenke til full film (TikTok, Vimeo, Instagram, osv.) |
| `ratio` | Ja | Bilde-/videoformat (se under) |

Tittel, kategori og `alt` settes i `messages/no.json` og `messages/en.json`, ikke i `portfolio.ts`.

\* `previewSrc` anbefales for `short-film` og `tiktok` — det er klippet som spilles av på siden.

### Type (`type`)

| Verdi | Hvor det vises |
|-------|----------------|
| `short-film` | Portfolio → «Short films» + kan vises i karusell på forsiden |
| `tiktok` | Portfolio → «TikTok edits» |
| `photography` | Portfolio → «Photography» + kan vises i karusell på forsiden |

### Aspect ratio (`ratio`)

Bruk brøk som matcher formatet på arbeidet:

| Format | Verdi |
|--------|-------|
| Landskap 16:9 | `16 / 9` |
| Portrett 4:5 | `4 / 5` |
| Vertikal 9:16 | `9 / 16` |
| Kvadrat | `1 / 1` |

### Eksempel: bare foto (ingen video)

`lib/portfolio.ts`:

```ts
{
  id: "portrett-serie",
  type: "photography",
  src: "/images/portrett-serie.jpg",
  ratio: 4 / 5,
},
```

`messages/no.json` + `messages/en.json` → `portfolio.items.portrett-serie` med title, category, alt.

### Eksempel: TikTok uten ekstern lenke

```ts
{
  id: "min-edit",
  title: "Min edit",
  category: "TikTok edit",
  type: "tiktok",
  src: "/images/min-edit-thumb.jpg",
  previewSrc: "/videos/min-edit.mp4",
  alt: "TikTok-edit av produktvideo",
  ratio: 9 / 16,
},
```

---

## Karusell på forsiden

Karusellen under «Process» på forsiden henter automatisk fra `PORTFOLIO_PREVIEW` — de første 5 elementene av typen `short-film` eller `photography` i `PORTFOLIO_ITEMS`.

Vil du styre rekkefølgen? Flytt elementene i arrayet — det som står først, vises først.

---

## Andre ting du kan endre

### Kontaktinfo og sidenavn

`lib/site.ts`:

```ts
export const SITE_NAME = "Skyrud Media";
export const CONTACT_EMAIL = "daniel.skyrud@hotmail.com";
```

### Personvern-side

Teksten ligger i `app/privacy/page.tsx`. Dato for sist oppdatert: `PRIVACY_LAST_UPDATED` i `lib/site.ts`.

---

## Mappestruktur (kort)

```
app/              Sider (forside, portfolio, personvern)
components/       UI og seksjoner (hero, services, osv.)
lib/portfolio.ts     Media + teknisk info for portfolio
messages/no.json     Norsk tekst (inkl. portfolio-titler)
messages/en.json     Engelsk tekst
lib/site.ts       Navn, e-post, osv.
public/images/    Bilder
public/videos/    Videoer
```

---

## Feilsøking

**Endringen vises ikke på nettsiden**
- Sjekk at du har pushet til GitHub
- Vent til Vercel-deploy er ferdig (grønn hake i Vercel-dashboard)
- Hard refresh i nettleseren: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)

**Video spiller ikke av**
- Sjekk at filen ligger i `public/videos/` og at stien i `previewSrc` starter med `/videos/`
- Prøv å eksportere på nytt som MP4 (H.264)

**TypeScript-feil ved build**
- Sjekk at alle objekter i `PORTFOLIO_ITEMS` har komma mellom seg
- Sjekk at `type` er nøyaktig `short-film`, `tiktok`, eller `photography`

---

Spørsmål? Rediger filene, test lokalt med `npm run dev`, og push når det ser bra ut.
