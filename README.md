# Skyline — Premium Weather App

A glassmorphic weather app built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Framer Motion. Data comes from [WeatherAPI.com](https://www.weatherapi.com/).

## Setup

```bash
npm install
cp .env.local.example .env.local
# then add your free key from https://www.weatherapi.com/signup.aspx into .env.local
npm run dev
```

Before shipping, run and fix anything reported by:

```bash
npm run build
npm run lint
```

## What's included

- Next.js 15 App Router, full TypeScript, professional folder architecture (`components/`, `hooks/`, `services/`, `types/`, `utils/`, `constants/`)
- Premium glassmorphism UI, full light/dark theming via `next-themes` (instant switch, no hydration flash)
- Animated navbar with a custom hamburger → glass floating panel mobile menu (Framer Motion), including a theme toggle and Escape-to-close
- Debounced city search with autocomplete, loading/error/no-results states, and "use my location"
- Current weather card: temp, feels like, condition, sunrise/sunset, humidity, wind, pressure, visibility, clouds, AQI
- Hourly forecast and 5-day forecast — each hour/day card includes temperature, rain probability, wind, and (daily) humidity
- Interactive world map (`react-leaflet`): global search, animated marker, full-detail popup, recenter/current-location controls, light/dark tiles
- Favorites (saved to `localStorage`, deletable on both desktop and mobile), recent searches, independent temperature and wind-speed unit toggles
- Rule-based "AI" summary card (clothing/umbrella/activity suggestions) — no external LLM call required
- PWA: real installable manifest + icons, service worker with offline shell caching, offline banner + `/offline` page, install-prompt button in Settings
- SEO: `robots.txt`, `sitemap.xml`, dynamic OG image — via Next's built-in file conventions
- Reduced-motion support throughout the animated background, Hero, and buttons
- Loading skeletons, error boundary, 404, and offline states

## Data layer: WeatherAPI.com

All weather data flows through `services/weatherService.ts`, which calls WeatherAPI.com's `forecast.json`, `current.json`, and `search.json` endpoints. The function signatures (`fetchCurrentWeather`, `fetchHourlyForecast`, `fetchDailyForecast`, `fetchAirQuality`, `geocodeCity`, `reverseGeocode`) and their return shapes are unchanged from before, so no other file needed to know which provider is behind them.

A few provider-specific notes:

- **Units**: WeatherAPI returns both metric and imperial values on every call; the service picks the right field based on the app's `unit` setting. Wind speed is normalized to m/s internally (metric) or mph (imperial) to match the existing `formatWindSpeed()` contract.
- **Icons**: WeatherAPI uses numeric condition codes (e.g. `1000` = Sunny) instead of OpenWeather's `"01d"` style strings. `weatherService.ts` re-encodes them as `"<code><d|n>"` (e.g. `"1183n"`) so `WeatherIcon.tsx` and the background-scene resolver didn't need structural changes — only the code-to-icon lookup table inside `WeatherIcon.tsx` was rewritten for WeatherAPI's code set.
- **Local time**: WeatherAPI doesn't return a numeric UTC offset directly, so the service derives it from the location's IANA `tz_id` using `Intl.DateTimeFormat`, then reconstructs each forecast timestamp from WeatherAPI's local wall-clock strings under the same `dt + timezoneOffset` convention the UI already used.
- **Air quality**: mapped from WeatherAPI's US EPA index (1–6) down to this app's existing 1–5 scale (Good…Very Poor) by capping at 5 — the label set in `utils/weather.ts` was left untouched.
- **Reverse geocoding**: WeatherAPI has no dedicated reverse-geocode endpoint; `search.json?q=lat,lon` (its documented way of resolving coordinates to a place) is used instead.

## Known external limitations

- **Forecast length**: the code requests 5 days, but WeatherAPI's free/trial plan may cap actual forecast length lower (commonly 3 days) — the UI already renders whatever length comes back, so this degrades gracefully rather than breaking.
- **Country-only search** (e.g. searching just "France") is limited by WeatherAPI's search endpoint, which is built for city/town lookup rather than administrative regions.
- **AI Summary** is a deterministic, rule-based generator — not a paid LLM call.
- Live requests to `api.weatherapi.com` haven't been exercised from this build environment (no network access here) — the request/response shapes match WeatherAPI's documented endpoints, but test locally with a real key before shipping, and run `npm run build` / `npm run lint` to catch anything this review couldn't.
