const MAIN_LANDMARK_ID = "unit-test-main-landmark";

/**
 * Appends a `<main>` landmark to the document body so Vue Teleport targets rendered with `portal="main"` resolve during unit tests.
 *
 * @return {HTMLElement} The created main landmark element.
 */
function createMainLandmark(): HTMLElement {
  const mainLandmark = document.createElement("main");
  mainLandmark.id = MAIN_LANDMARK_ID;
  document.body.append(mainLandmark);

  return mainLandmark;
}

/**
 * Removes the `<main>` landmark previously created by createMainLandmark from the document body.
 *
 * @return {void}
 */
function removeMainLandmark(): void {
  document.querySelector(`#${MAIN_LANDMARK_ID}`)?.remove();
}

export {
  createMainLandmark,
  removeMainLandmark,
};