@game-settings
Feature: ⚙️ Game Settings Modal

  Background:
    Given the tutorial invitation has already been decided
    And the user is on game page
    And the user opens the game sidebar
    And the user clicks the settings button in the game sidebar

  Scenario: ⚙️ Opening Settings displays the General tab and locale selector
    Then the element with testid "game-settings-modal" should be visible
    And the element with testid "game-settings-general-tab" should be visible
    And the element with testid "locale-select" should be visible
    And the exact text "Language" should be visible
    And the element with testid "game-sidebar-settings-button" should be hidden

  Scenario: ⚙️ About displays the Goat It tagline and version button
    When the user clicks on the tab with exact name "About"
    Then the game settings About tab should be displayed
    And the exact text "The game where the answer is guessed" should be visible
    And the element with testid "github-version-button" should be visible
    And the element with testid "game-settings-about-logo" should be visible

  Scenario: ⚙️ Selecting French in Settings switches the interface immediately
    When the user selects the "Français" locale option in the game settings
    Then the element with testid "game-settings-modal" should be visible
    And the exact text "Langue" should be visible
    And the exact text "Général" should be visible
    And the user should be on game page

  Scenario: ⚙️ Selecting French in Settings persists after a reload
    When the user selects the "Français" locale option in the game settings
    And the user reloads the page
    And the user opens the game sidebar
    And the user clicks the settings button in the game sidebar
    Then the element with testid "game-settings-general-tab" should be visible
    And the exact text "Langue" should be visible
    And the game settings selected locale should be "Français"

  Scenario: ⚙️ Adult content option is disabled by default
    Then the element with testid "game-settings-adult-content-switch" should be visible
    And the game settings adult content switch should be off
    And the game settings adult content description should be "Only questions suitable for all audiences will appear."

  Scenario: ⚙️ Enabling adult content updates the description and icon
    When the user turns on the game settings adult content switch
    Then the game settings adult content switch should be on
    And the game settings adult content description should be "Questions involving sensitive topics (wars, violence, sex…) may appear."
    And the game settings adult content icon should be active

  Scenario: ⚙️ Adult content option resets to disabled after a reload
    When the user turns on the game settings adult content switch
    And the user reloads the page
    And the user opens the game sidebar
    And the user clicks the settings button in the game sidebar
    Then the game settings adult content switch should be off
    And the game settings adult content description should be "Only questions suitable for all audiences will appear."
