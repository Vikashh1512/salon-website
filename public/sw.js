self.addEventListener("push", (event) => {
  let data = { title: "New booking", body: "", url: "/admin" };
  try {
    data = { ...data, ...event.data.json() };
  } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      data: { url: data.url },
    })
  );
});

self.addEventListener("push", (event) => {
  let data = { title: "New booking", body: "", url: "/admin" };
  try {
    data = { ...data, ...event.data.json() };
  } catch {}

  const options = { body: data.body, data: { url: data.url } };
  if (data.tag) {
    options.tag = data.tag;
    options.renotify = true;
  }

  event.waitUntil(self.registration.showNotification(data.title, options));
});