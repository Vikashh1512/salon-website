import * as webpushModule from "web-push";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const webpush = webpushModule.default ?? webpushModule;
let vapidReady = false;

function setupVapid() {
  if (vapidReady) return true;
  const { NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;
  if (!NEXT_PUBLIC_VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_SUBJECT) {
    console.error("Push is not set up: a VAPID key is missing in .env.local");
    return false;
  }
  webpush.setVapidDetails(VAPID_SUBJECT, NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  vapidReady = true;
  return true;
}

export async function sendPush(payload) {
  if (!setupVapid()) return;

  const { data: subs, error } = await supabaseAdmin
    .from("push_subscriptions")
    .select("id, subscription");

  if (error || !subs) {
    console.error("Could not load push subscriptions:", error);
    return;
  }

  if (subs.length === 0) {
    console.error("No devices have notifications turned on yet.");
    return;
  }

  await Promise.all(
    subs.map(async (row) => {
      try {
        await webpush.sendNotification(row.subscription, JSON.stringify(payload));
      } catch (err) {
        // 404/410 means this device no longer exists, so remove it
        if (err.statusCode === 404 || err.statusCode === 410) {
          await supabaseAdmin.from("push_subscriptions").delete().eq("id", row.id);
        } else {
          console.error("Push error:", err.statusCode, err.body);
        }
      }
    })
  );
}