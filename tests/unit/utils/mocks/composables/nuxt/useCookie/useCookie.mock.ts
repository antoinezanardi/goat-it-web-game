type CookieReference<T> = { value: T };

type CapturedReference<T> = { current: T };

type UseCookieMockState<T> = {
  cookieRef: CookieReference<T>;
  capturedName: CapturedReference<string | undefined>;
  capturedOptions: CapturedReference<Record<string, unknown> | undefined>;
};

/**
 * Creates a mock state holder for the `useCookie` composable for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createUseCookieMockState<T>(initialValue: T): UseCookieMockState<T> {
  return {
    cookieRef: { value: initialValue },
    capturedName: { current: undefined },
    capturedOptions: { current: undefined },
  };
}

export type { CookieReference as CookieRef, CapturedReference, UseCookieMockState };

export { createUseCookieMockState };