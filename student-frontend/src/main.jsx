import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { Provider } from 'react-redux';            
import { store } from './redux/store'; 

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(async registration => {
        console.log('Service Worker registered with scope:', registration.scope);

        // Request notification permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('Notification permission not granted.');
          return;
        }

        // Subscribe for push notifications
        if ('PushManager' in window) {
          try {
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: 'BMUremeOmZV_LUVGd-TAJstjCW4JY06Z2IcTk-b4NmOEf9NfcfdLoSfEFAlWd4woGqXHGuXWo8UvNl_1nPj4DOI'
            });
            console.log('Push subscription:', subscription);
            // Send subscription to your backend
            try {
              await fetch('/api/save-subscription', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(subscription)
              });
              console.log('Subscription sent to backend');
            } catch (err) {
              console.error('Failed to send subscription to backend:', err);
            }
          } catch (err) {
            console.error('Push subscription failed:', err);
          }
        }
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
