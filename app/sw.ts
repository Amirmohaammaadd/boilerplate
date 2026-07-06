import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("push", (event: PushEvent) => {
    let title = "اعلان تستی";
    let body = "این یه پیام تستیه!";

    if (event.data) {
        try {
            const data = event.data.json();
            title = data.title;
            body = data.body;
        } catch {
            body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(title, {
            body,
            icon: "/icons/icon-192x192.png",
        })
    );
});

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: defaultCache,
});

serwist.addEventListeners();