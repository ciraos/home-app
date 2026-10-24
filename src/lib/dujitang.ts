// =============================================================
// 🍜 人间凑数文案：https://v1.tqq.me/v1/renjian
// 该接口要求带上密钥（?key=xxx），密钥放在服务端环境变量 RENJIAN_API_KEY，
// 不要用 NEXT_PUBLIC_ 前缀，避免密钥被打进浏览器。
// =============================================================

/** 接口地址，可用 RENJIAN_API_URL 覆盖 */
const RENJIAN_API_URL =
  process.env.RENJIAN_API_URL ?? "https://v1.tqq.me/v1/renjian";

/** 接口密钥，缺失时接口返回 403 API_KEY_REQUIRED */
const RENJIAN_API_KEY = process.env.RENJIAN_API_KEY ?? "";

/** 兜底文案：接口不可用时展示，保证首屏不空 */
export const RENJIAN_FALLBACK = "今天的毒鸡汤加载失败了，换个心情吧～";

/** 接口返回体：不同版本字段不完全一致，这里只声明用得到的部分 */
interface RenjianResponse {
  code?: number | string;
  message?: string;
  msg?: string;
  data?: unknown;
  text?: string;
  content?: string;
}

/** code 缺省视为成功，兼容 0 / 200 / "0" / "200" */
function isSuccessCode(code: RenjianResponse["code"]): boolean {
  return (
    code === undefined ||
    code === 0 ||
    code === 200 ||
    code === "0" ||
    code === "200"
  );
}

/** 从几种常见返回结构里取出文案，取不到返回 null */
function extractText(json: unknown, depth = 0): string | null {
  if (typeof json === "string") return json.trim() || null;
  if (!json || typeof json !== "object" || depth > 2) return null;

  const obj = json as Record<string, unknown>;
  for (const key of ["text", "content", "quote", "sentence"]) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  // data / result 里可能再套一层对象
  for (const key of ["data", "result"]) {
    const nested = extractText(obj[key], depth + 1);
    if (nested) return nested;
  }
  return null;
}

/**
 * 拉取一句「人间凑数」文案。
 *
 * 缺密钥、网络失败、返回结构变化等情况都回落到兜底文案，不抛错，
 * 保证首屏渲染不会因为第三方接口挂掉而失败。
 */
export async function getRenjianQuote(): Promise<string> {
  if (!RENJIAN_API_KEY) {
    console.error("缺少 RENJIAN_API_KEY，人间凑数接口会返回 403");
    return RENJIAN_FALLBACK;
  }

  try {
    const url = new URL(RENJIAN_API_URL);
    url.searchParams.set("key", RENJIAN_API_KEY);

    const res = await fetch(url, {
      cache: "no-store", // 每次访问都换一句
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`接口返回 ${res.status}`);

    const json = (await res.json()) as RenjianResponse;
    if (!isSuccessCode(json.code)) {
      throw new Error(`接口错误：${json.message ?? json.msg ?? json.code}`);
    }

    return extractText(json) ?? RENJIAN_FALLBACK;
  } catch (error) {
    console.error("获取人间凑数文案失败:", error);
    return RENJIAN_FALLBACK;
  }
}
