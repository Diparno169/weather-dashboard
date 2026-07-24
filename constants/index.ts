export const WEATHERAPI_BASE = "https://api.weatherapi.com/v1";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Forecast", href: "/forecast" },
  { label: "Map", href: "/map" },
  { label: "Favorites", href: "/favorites" },
  { label: "Settings", href: "/settings" },
  { label: "About", href: "/about" },
] as const;

export const FAVORITES_STORAGE_KEY = "weatherapp:favorites";
export const RECENTS_STORAGE_KEY = "weatherapp:recents";
export const UNIT_STORAGE_KEY = "weatherapp:unit";
export const WIND_UNIT_STORAGE_KEY = "weatherapp:windUnit";
export const LAST_LOCATION_KEY = "weatherapp:lastLocation";

export const MAX_RECENTS = 5;
