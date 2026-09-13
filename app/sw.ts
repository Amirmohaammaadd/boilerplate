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
    // "/offline.html" lives under public/, so @serwist/next already adds it
    // to __SW_MANIFEST automatically — it only needs to be referenced below,
    // not added again (a duplicate precache entry throws at construction time).
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: defaultCache,
    fallbacks: {
        entries: [
            {
                url: "/offline.html",
                matcher: ({ request }) => request.destination === "document",
            },
        ],
    },
});

serwist.addEventListeners();