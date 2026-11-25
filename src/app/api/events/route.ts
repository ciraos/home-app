import { onContentUpdate } from "@/lib/content-events";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * SSE：页面订阅内容变更。
 * 收到 update 事件后由客户端调用 router.refresh() 重新渲染。
 */
export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;

      const send = (chunk: string) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          closed = true;
        }
      };

      // 先发一条 ready，客户端据此确认连接建立；之后每 25s 心跳一次防止代理断开
      send("retry: 3000\nevent: ready\ndata: ok\n\n");

      const unsubscribe = onContentUpdate(() => {
        send(`event: update\ndata: ${Date.now()}\n\n`);
      });

      const heartbeat = setInterval(() => send(": ping\n\n"), 25_000);

      const cleanup = () => {
        if (closed) return;
        closed = true;
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // 已经关闭
        }
      };

      request.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // 让 Nginx 不要缓冲 SSE
      "X-Accel-Buffering": "no",
    },
  });
}
