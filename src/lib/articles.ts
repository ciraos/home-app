// =============================================================
// 📄 最近文章：从 blog.ciraos.top 的前端 API 拉取列表与总数
// 列表只取标题、最上方标签、创建日期三个字段。
// =============================================================

/** 最近文章展示用数据 */
export interface RecentArticle {
  id: string;
  /** 标题 */
  title: string;
  /** 最上方标签（post_tags 第一项的 name） */
  tag: string;
  /** 创建日期 YYYY-MM-DD */
  date: string;
}

/** API 返回中的单个文章字段（仅声明用到的部分） */
interface ArticleApiItem {
  id: string;
  title: string;
  created_at: string;
  post_tags?: { name?: string }[];
}

interface ArticleApiResponse {
  code: number;
  data?: { list?: ArticleApiItem[]; total?: number };
}

const ARTICLES_API_URL =
  process.env.NEXT_PUBLIC_ARTICLES_API_URL ??
  "https://blog.ciraos.top/api/public/articles";

/** 内部共享的取数逻辑（列表 + 总数），失败返回 null */
async function fetchArticleList(): Promise<{
  list: ArticleApiItem[];
  total: number;
} | null> {
  try {
    const res = await fetch(ARTICLES_API_URL, {
      cache: "no-store", // 每次请求都拉取最新数据，文章列表与计数即时同步
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`文章接口返回 ${res.status}`);

    const json = (await res.json()) as ArticleApiResponse;
    if (json.code !== 200 || !json.data?.list) {
      throw new Error("文章接口响应异常");
    }

    return {
      list: json.data.list,
      total: json.data.total ?? json.data.list.length,
    };
  } catch (error) {
    console.error("获取文章列表失败:", error);
    return null;
  }
}

/** 拉取最近文章列表，失败时返回空数组（由页面兜底展示） */
export async function getRecentArticles(): Promise<RecentArticle[]> {
  const result = await fetchArticleList();
  if (!result) return [];
  return result.list.map((item) => ({
    id: item.id,
    title: item.title,
    tag: item.post_tags?.[0]?.name ?? "",
    date: item.created_at?.slice(0, 10) ?? "",
  }));
}

/** 文章总数；接口不可用时返回 undefined（页面做兜底） */
export async function getArticleCount(): Promise<number | undefined> {
  const result = await fetchArticleList();
  return result ? result.total : undefined;
}
