"use client";

import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
  type LucideProps,
} from "lucide-react";

const THUNDER = new Set([1087, 1273, 1276, 1279, 1282]);
const SNOW = new Set([
  1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252,
  1255, 1258, 1261, 1264,
]);
const DRIZZLE = new Set([1063, 1150, 1153, 1168, 1171, 1180, 1183, 1240]);
const RAIN = new Set([1186, 1189, 1192, 1195, 1198, 1201, 1243, 1246]);
const FOG = new Set([1030, 1135, 1147]);
const OVERCAST = new Set([1006, 1009]);
const PARTLY_CLOUDY = new Set([1003]);

/**
 * Maps a WeatherAPI condition code (encoded by weatherService.ts as
 * "<code><d|n>", e.g. "1183n") to a Lucide icon component.
 */
export function WeatherIcon({ code, ...props }: { code: string } & LucideProps) {
  const match = code.match(/^(\d+)([dn])$/);
  const numericCode = match ? parseInt(match[1], 10) : 1000;
  const isNight = match ? match[2] === "n" : false;

  let Icon: typeof Sun;
  if (THUNDER.has(numericCode)) Icon = CloudLightning;
  else if (SNOW.has(numericCode)) Icon = CloudSnow;
  else if (RAIN.has(numericCode)) Icon = CloudRain;
  else if (DRIZZLE.has(numericCode)) Icon = CloudDrizzle;
  else if (FOG.has(numericCode)) Icon = CloudFog;
  else if (OVERCAST.has(numericCode)) Icon = Cloud;
  else if (PARTLY_CLOUDY.has(numericCode)) Icon = isNight ? CloudMoon : CloudSun;
  else Icon = isNight ? Moon : Sun; // 1000 (Sunny/Clear) and any unrecognized code

  return <Icon {...props} />;
}
