// usePushNotifications.jsx

import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const vapidPublicKey = "BMUremeOmZV_LUVGd-TAJstjCW4JY06Z2IcTk-b4NmOEf9NfcfdLoSfEFAlWd4woGqXHGuXWo8UvNl_1nPj4DOI";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}

const usePushNotifications = () => {
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const subscribeUser = async () => {
      if (!token) return;

      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          console.log("Service Worker registered!");

          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
          });

          console.log("Push subscription successful!");

          await fetch("http://127.0.0.1:8000/api/save-subscription", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              endpoint: subscription.endpoint,
              publicKey: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("p256dh")))),
              authToken: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("auth")))),
              contentEncoding: "aes128gcm",
            }),
          });

          console.log("Subscription sent to server!");
        } catch (err) {
          console.error("Push subscription failed:", err.name, err.message);
        }
      }
    };

    subscribeUser();
  }, [token]);
};

export default usePushNotifications;
