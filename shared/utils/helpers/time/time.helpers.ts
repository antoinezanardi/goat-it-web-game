/**
 * Resolves after the given number of milliseconds.
 */
async function sleep(ms: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
}

export {
  sleep,
};