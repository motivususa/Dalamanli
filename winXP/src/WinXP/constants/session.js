/** Local session flag until real auth (e.g. Supabase) is wired */
export const WINXP_SESSION_KEY = 'winxp-user-signed-in';

export function isWinXpSignedIn() {
  try {
    return localStorage.getItem(WINXP_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function setWinXpSignedIn() {
  try {
    localStorage.setItem(WINXP_SESSION_KEY, '1');
  } catch {
    /* private mode / quota */
  }
}

export function clearWinXpSignedIn() {
  try {
    localStorage.removeItem(WINXP_SESSION_KEY);
  } catch {
    /* ignore */
  }
}
