// Global PWA installation manager
let deferredPrompt = null;
const listeners = new Set();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    listeners.forEach((fn) => fn(deferredPrompt));
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    listeners.forEach((fn) => fn(null));
  });
}

export function getDeferredPrompt() {
  return deferredPrompt;
}

export function subscribeToInstallPrompt(fn) {
  listeners.add(fn);
  fn(deferredPrompt);
  return () => listeners.delete(fn);
}

export async function promptInstall() {
  if (deferredPrompt) {
    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      listeners.forEach((fn) => fn(null));
      return choice && choice.outcome === 'accepted';
    } catch {
      return false;
    }
  }
  return false;
}

export function isStandaloneApp() {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.matchMedia?.('(display-mode: standalone)')?.matches ||
    window.navigator?.standalone === true
  );
}
