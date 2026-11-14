self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = { title: "New booking", body: "", url: "/admin" };
  try {
    data = { ...data, ...event.data.json() };
  } catch {}

  // Same tag = same notification, so a repeated push replaces it silently
  const tag = data.tag || `${data.title}|${data.body}`;

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      tag,
      data: { url: data.url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/admin";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.includes("/admin") && "focus" in c) return c.focus();
      }
      return clients.openWindow(url);
    })
  );
});