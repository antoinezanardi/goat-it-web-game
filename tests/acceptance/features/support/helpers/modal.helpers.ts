import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

const MODAL_FOOTER_BUTTON_TEST_IDS = {
  close: "default-modal-footer-close-button",
  primary: "default-modal-footer-primary-button",
} as const;

async function getVisibleDefaultModal(page: Page): Promise<Locator> {
  const dialog = page.getByRole("dialog").first();

  await expect(dialog).toBeVisible();

  return dialog;
}

async function clickModalFooterButton(container: Locator, button: keyof typeof MODAL_FOOTER_BUTTON_TEST_IDS): Promise<void> {
  const buttonLocator = container.getByTestId(MODAL_FOOTER_BUTTON_TEST_IDS[button]);

  await expect(buttonLocator).toBeVisible();
  await buttonLocator.click();
}

export {
  clickModalFooterButton,
  getVisibleDefaultModal,
};