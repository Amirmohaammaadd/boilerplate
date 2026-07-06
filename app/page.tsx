"use client"

import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((p) => console.log("permission:", p));
    }
  }, []);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
    </div>
  );
}
