// =============================================================
// 📡 内容变更广播（进程内）
// 后台保存内容后 publish，所有打开着的首页通过 SSE 收到通知后
// 调 router.refresh() 重新取服务端数据，不用手动刷新。
//
// 单实例部署（next dev / standalone 单进程）下即时生效；
// 多实例需要换成 Redis pub/sub 之类的跨进程通道。
// =============================================================

type Listener = () => void;

const globalForEvents = globalThis as unknown as {
  __contentListeners?: Set<Listener>;
};

function listeners(): Set<Listener> {
  globalForEvents.__contentListeners ??= new Set();
  return globalForEvents.__contentListeners;
}

/** 订阅内容变更，返回取消订阅函数 */
export function onContentUpdate(listener: Listener): () => void {
  listeners().add(listener);
  return () => {
    listeners().delete(listener);
  };
}

/** 后台写入成功后调用，通知所有在线页面刷新 */
export function publishContentUpdate(): void {
  for (const listener of listeners()) {
    try {
      listener();
    } catch {
      // 单个连接出错不影响其他订阅者
    }
  }
}
