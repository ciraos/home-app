// =============================================================
// 🌞 日出日落计算（Sunrise equation）
// 用于根据当地时间自动切换浅色/深色主题。
// 坐标默认是淮南（可改成你的位置）。
// =============================================================

/** 家乡坐标：淮南（纬度、经度）——改成你所在的城市坐标即可 */
export const HOME_LAT = 32.6255;
export const HOME_LNG = 116.9984;

/** 官方日出日落定义：太阳中心低于地平线 0.833° */
const SOLAR_ZENITH = 90.833;

const RAD = Math.PI / 180;

export interface SunTimes {
  /** 日出时刻（本地时间戳 ms） */
  sunrise: number;
  /** 日落时刻（本地时间戳 ms） */
  sunset: number;
}

/**
 * 计算某一天在本地时区的日出/日落时间。
 * 极昼/极夜等异常情况返回 null。
 */
export function getSunTimes(date: Date, lat = HOME_LAT, lng = HOME_LNG): SunTimes | null {
  const dayOfYear =
    Math.floor(
      (new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() -
        new Date(date.getFullYear(), 0, 1).getTime()) /
        86_400_000
    ) + 1;

  // 本地时区相对 UTC 的偏移（东为正，小时）
  const tzOffsetHours = -date.getTimezoneOffset() / 60;
  const lngHour = lng / 15;

  /** 计算日出(true)或日落(false)的本地时间戳 */
  const calc = (rising: boolean): number | null => {
    // 近似日出/日落的世界时
    const t = dayOfYear + ((rising ? 6 : 18) - lngHour) / 24;

    // 太阳平近点角（度）
    const M = 0.9856 * t - 3.289;
    // 太阳黄经（度）
    const L = (((M + 1.916 * Math.sin(M * RAD) + 0.02 * Math.sin(2 * M * RAD) + 282.634) % 360) + 360) % 360;
    // 赤经（度，需修正象限）
    let RA = Math.atan(0.91764 * Math.tan(L * RAD)) / RAD;
    RA = ((RA % 360) + 360) % 360;
    RA = (RA + (Math.floor(L / 90) * 90 - Math.floor(RA / 90) * 90)) / 15; // 转为小时

    // 赤纬
    const sinDec = 0.39782 * Math.sin(L * RAD);
    const cosDec = Math.cos(Math.asin(sinDec));

    // 时角
    const cosH =
      (Math.cos(SOLAR_ZENITH * RAD) - sinDec * Math.sin(lat * RAD)) / (cosDec * Math.cos(lat * RAD));
    if (cosH > 1 || cosH < -1) return null; // 极昼/极夜

    // 日出用 360-H，日落用 H（度），转为小时
    const H = (rising ? 360 - Math.acos(cosH) / RAD : Math.acos(cosH) / RAD) / 15;

    // 当地平均时 → 世界时 → 本地时
    const T = H + RA - 0.06571 * t - 6.622;
    const UT = (T - lngHour + 24) % 24;
    const localH = (UT + tzOffsetHours + 24) % 24;

    return (
      new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime() +
      Math.round(localH * 3_600_000)
    );
  };

  const sunrise = calc(true);
  const sunset = calc(false);
  if (sunrise === null || sunset === null) return null;
  return { sunrise, sunset };
}

/** 当前时刻应使用的主题：白天浅色、夜晚深色（异常情况兜底浅色） */
export function getDayTheme(now = new Date()): "light" | "dark" {
  const times = getSunTimes(now);
  if (!times) return "light";
  const t = now.getTime();
  return t >= times.sunrise && t < times.sunset ? "light" : "dark";
}

/**
 * 距离下一次日出/日落切换还有多少毫秒。
 * 用于精确调度主题切换，最迟 3 天内必有结果，兜底 12 小时。
 */
export function getNextTransitionMs(now = new Date()): number {
  const t = now.getTime();
  for (let i = 0; i < 3; i++) {
    const times = getSunTimes(new Date(now.getFullYear(), now.getMonth(), now.getDate() + i));
    if (times) {
      const candidates = [times.sunrise, times.sunset].filter((x) => x > t);
      if (candidates.length > 0) return Math.min(...candidates) - t;
    }
  }
  return 12 * 3_600_000;
}
