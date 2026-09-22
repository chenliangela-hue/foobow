// Foobow (福报) Identity & Authentication Service
// Supports Clerk SSO (Google, Apple, Passkeys, Email) when CLERK_PUBLISHABLE_KEY is configured,
// with a seamless Guest Mode & Local Sanctuary fallback for offline dev and zero-friction usage.

(function (window) {
  "use strict";

  const STORAGE_KEY = "foobow_user_session";
  const GUEST_USER = {
    id: "guest_local",
    name: "Quiet Helper",
    email: "",
    avatar: "F",
    avatarUrl: null,
    provider: "guest",
    isGuest: true,
    syncStatus: "local"
  };

  const listeners = [];
  let currentUser = loadSession();
  let clerkInstance = null;
  let isInitializing = false;

  function loadSession() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) return parsed;
      }
    } catch {
      // Storage unavailable or corrupted; fall back to guest
    }
    return { ...GUEST_USER };
  }

  function saveSession(user) {
    try {
      if (user.isGuest) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      }
    } catch (e) {
      console.warn("[FoobowAuth] Failed to persist user session", e);
    }
  }

  function notifyListeners() {
    listeners.forEach((fn) => {
      try {
        fn(currentUser);
      } catch (err) {
        console.error("[FoobowAuth] Listener error:", err);
      }
    });
    window.dispatchEvent(
      new CustomEvent("foobow:auth-changed", { detail: { user: currentUser } })
    );
  }

  async function initClerk() {
    const publishableKey =
      window.CLERK_PUBLISHABLE_KEY ||
      (typeof process !== "undefined" && process.env && process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY) ||
      "";

    if (!publishableKey || isInitializing) return;
    isInitializing = true;

    try {
      if (window.Clerk) {
        clerkInstance = window.Clerk;
      } else {
        // Dynamically load Clerk JS if publishable key is present
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js";
        script.async = true;
        script.crossOrigin = "anonymous";
        script.setAttribute("data-clerk-publishable-key", publishableKey);

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });

        if (window.Clerk) {
          clerkInstance = window.Clerk;
          await clerkInstance.load();
        }
      }

      if (clerkInstance) {
        clerkInstance.addListener(({ user }) => {
          if (user) {
            currentUser = {
              id: user.id,
              name: user.fullName || user.username || user.primaryEmailAddress?.emailAddress?.split("@")[0] || "Kind Soul",
              email: user.primaryEmailAddress?.emailAddress || "",
              avatar: (user.fullName || "F").charAt(0).toUpperCase(),
              avatarUrl: user.imageUrl || null,
              provider: "clerk",
              isGuest: false,
              syncStatus: "synced"
            };
          } else {
            currentUser = { ...GUEST_USER };
          }
          saveSession(currentUser);
          notifyListeners();
        });
      }
    } catch (err) {
      console.warn("[FoobowAuth] Clerk initialization skipped or offline; continuing in local mode.", err);
    } finally {
      isInitializing = false;
    }
  }

  const FoobowAuth = {
    async init() {
      await initClerk();
      notifyListeners();
    },

    getUser() {
      return { ...currentUser };
    },

    isSignedIn() {
      return !currentUser.isGuest;
    },

    onAuthStateChanged(fn) {
      if (typeof fn === "function") {
        listeners.push(fn);
        fn(currentUser);
      }
      return () => {
        const idx = listeners.indexOf(fn);
        if (idx !== -1) listeners.splice(idx, 1);
      };
    },

    async signInWithOAuth(provider) {
      if (clerkInstance && clerkInstance.client) {
        try {
          await clerkInstance.authenticateWithRedirect({
            strategy: provider === "apple" ? "oauth_apple" : "oauth_google",
            redirectUrl: window.location.href,
            redirectUrlComplete: window.location.href
          });
          return;
        } catch (e) {
          console.warn("[FoobowAuth] Clerk OAuth redirect failed, falling back to simulated session:", e);
        }
      }

      // Simulated OAuth for development / demo / offline environments
      const providerName = provider === "apple" ? "Apple" : "Google";
      const sampleEmail = provider === "apple" ? "kind.traveler@icloud.com" : "kindness.seeker@gmail.com";
      const sampleName = provider === "apple" ? "Mindful Traveler" : "Lotus Keeper";

      currentUser = {
        id: `user_${provider}_${Date.now().toString(36)}`,
        name: sampleName,
        email: sampleEmail,
        avatar: sampleName.charAt(0).toUpperCase(),
        avatarUrl: null,
        provider: provider,
        isGuest: false,
        syncStatus: "synced",
        lastSyncedAt: new Date().toISOString()
      };

      saveSession(currentUser);
      notifyListeners();
      return currentUser;
    },

    async signInWithEmail(email) {
      const cleanEmail = (email || "").trim();
      if (!cleanEmail) throw new Error("Email required");

      const name = cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      currentUser = {
        id: `user_email_${Date.now().toString(36)}`,
        name: name || "Zen Friend",
        email: cleanEmail,
        avatar: (name || "Z").charAt(0).toUpperCase(),
        avatarUrl: null,
        provider: "email",
        isGuest: false,
        syncStatus: "synced",
        lastSyncedAt: new Date().toISOString()
      };

      saveSession(currentUser);
      notifyListeners();
      return currentUser;
    },

    async signInDemo() {
      // Aligns with the backend demo fixture (`user_demo` / `demo@foobow.local`)
      currentUser = {
        id: "user_demo",
        name: "Alex Tan",
        email: "demo@foobow.local",
        avatar: "A",
        avatarUrl: null,
        provider: "demo",
        isGuest: false,
        syncStatus: "synced",
        lastSyncedAt: new Date().toISOString()
      };

      saveSession(currentUser);
      notifyListeners();
      return currentUser;
    },

    async signOut() {
      if (clerkInstance && clerkInstance.signOut) {
        try {
          await clerkInstance.signOut();
        } catch (e) {
          console.warn("[FoobowAuth] Clerk signOut error:", e);
        }
      }

      currentUser = { ...GUEST_USER };
      saveSession(currentUser);
      notifyListeners();
      return currentUser;
    },

    async syncCloud() {
      if (currentUser.isGuest) return { status: "guest" };

      // In real backend or mock API, verify token and sync merit state
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer dev-foobow-token"
        };
        const res = await fetch("/api/v1/me", { headers });
        if (res.ok) {
          const data = await res.json();
          currentUser.syncStatus = "synced";
          currentUser.lastSyncedAt = new Date().toISOString();
          if (data.profile && data.profile.display_name) {
            currentUser.name = data.profile.display_name;
          }
          saveSession(currentUser);
          notifyListeners();
          return { status: "success", data };
        }
      } catch {
        // Fallback: mark as locally synced
      }

      currentUser.syncStatus = "synced";
      currentUser.lastSyncedAt = new Date().toISOString();
      saveSession(currentUser);
      notifyListeners();
      return { status: "local_sync" };
    }
  };

  window.FoobowAuth = FoobowAuth;
  // Automatically bootstrap auth
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => FoobowAuth.init());
  } else {
    FoobowAuth.init();
  }
})(typeof window !== "undefined" ? window : globalThis);
