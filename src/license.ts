const LICENSE_KEY = 'sb_license:stock-return-trail';
const VERDICT_KEY = 'sb_license_verdict:stock-return-trail';
const VERIFY_URL = 'https://api.sociobot.in/api/v1/products/stock-return-trail/verify';

export interface LicenseState { unlocked: boolean; notice?: string }

export function captureLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(LICENSE_KEY, token);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function cachedLicense(): LicenseState {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return { unlocked: false };
  try {
    const verdict = JSON.parse(localStorage.getItem(VERDICT_KEY) || '{}');
    if (verdict.valid === false) return { unlocked: false, notice: 'This license is no longer active.' };
    return { unlocked: verdict.valid === true };
  } catch {
    return { unlocked: false };
  }
}

export async function verifyLicense(force = false): Promise<LicenseState> {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return { unlocked: false };
  const cached = JSON.parse(localStorage.getItem(VERDICT_KEY) || '{}');
  if (!force && cached.checkedAt && Date.now() - cached.checkedAt < 86_400_000) return { unlocked: Boolean(cached.valid) };
  try {
    const response = await fetch(`${VERIFY_URL}?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('verify failed');
    const body = await response.json();
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: body.valid, checkedAt: Date.now() }));
    return { unlocked: Boolean(body.valid), notice: body.valid ? undefined : 'This license is no longer active.' };
  } catch {
    return cached.valid === true ? { unlocked: true } : { unlocked: false, notice: 'License check needs a connection. Try again when you are online.' };
  }
}

export async function storeLicense(token: string): Promise<LicenseState> {
  localStorage.setItem(LICENSE_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
  return verifyLicense(true);
}
