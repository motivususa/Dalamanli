/**
 * MENU / back navigation is handled in a single `window` listener on `menuclick`
 * inside `ViewContextProvider` so only one stack pop runs per press.
 *
 * This hook is kept as a no-op so existing call sites do not need churn; remove
 * imports in a future cleanup if desired.
 */
const useMenuHideView = (_id: string) => {};

export default useMenuHideView;
