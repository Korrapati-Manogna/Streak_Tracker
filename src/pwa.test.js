import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkIsInstalled, detectPlatform } from './hooks/usePWAInstall.js';

describe('PWA Installation Detection & Platform Utilities', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('detects uninstalled state by default in standard browser view', () => {
    vi.stubGlobal('window', {
      matchMedia: vi.fn().mockReturnValue({ matches: false }),
      navigator: { standalone: false }
    });
    expect(checkIsInstalled()).toBe(false);
  });

  it('detects installed state when navigator.standalone is true (iOS)', () => {
    vi.stubGlobal('window', {
      matchMedia: vi.fn().mockReturnValue({ matches: false }),
      navigator: { standalone: true }
    });
    expect(checkIsInstalled()).toBe(true);
  });

  it('detects installed state when display-mode matches standalone', () => {
    vi.stubGlobal('window', {
      matchMedia: vi.fn().mockImplementation((query) => ({
        matches: query === '(display-mode: standalone)'
      })),
      navigator: { standalone: false }
    });
    expect(checkIsInstalled()).toBe(true);
  });

  it('detects iOS devices accurately from userAgent', () => {
    vi.stubGlobal('window', {
      navigator: {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        platform: 'iPhone'
      }
    });
    const platform = detectPlatform();
    expect(platform.isIOS).toBe(true);
    expect(platform.isMobile).toBe(true);
    expect(platform.isAndroid).toBe(false);
  });

  it('detects Android devices accurately from userAgent', () => {
    vi.stubGlobal('window', {
      navigator: {
        userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36',
        platform: 'Linux armv8l'
      }
    });
    const platform = detectPlatform();
    expect(platform.isAndroid).toBe(true);
    expect(platform.isMobile).toBe(true);
    expect(platform.isIOS).toBe(false);
  });

  it('handles environment when window is undefined', () => {
    vi.stubGlobal('window', undefined);
    expect(checkIsInstalled()).toBe(false);
    expect(detectPlatform()).toEqual({ isIOS: false, isAndroid: false, isMobile: false });
  });
});
