// =============================================================
// 🖼 图片上传：后台选择文件后写入 UPLOAD_DIR（默认 ./data/uploads）
// 不用 public/ 的原因：standalone 部署时 public 是构建产物，
// 运行期写入的文件不会被 standalone 的静态目录服务到。
// 图片通过 /uploads/[file] 路由读取。
// =============================================================

import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_BYTES = 4 * 1024 * 1024;

const EXT_BY_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

/** 上传目录的绝对路径 */
export function uploadsDir(): string {
  const configured = process.env.UPLOAD_DIR || path.join("data", "uploads");
  // turbopackIgnore：避免把整个项目目录纳入 standalone 追踪
  return path.isAbsolute(configured)
    ? configured
    : path.join(/* turbopackIgnore: true */ process.cwd(), configured);
}

/** 保存一张图片并返回可访问的 URL；校验失败会抛错（错误信息直接给用户看） */
export async function saveImage(file: File): Promise<string> {
  if (file.size > MAX_BYTES) throw new Error("图片不能超过 4MB");
  const ext = EXT_BY_TYPE[file.type];
  if (!ext) throw new Error("只支持 PNG / JPEG / WebP / AVIF / GIF");

  const name = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}.${ext}`;
  const dir = uploadsDir();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}
