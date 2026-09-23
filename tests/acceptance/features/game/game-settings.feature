@game-settings
Feature: ⚙️ Game Settings Modal

  Background:
    Given the tutorial invitation has already been decided

  Scenario: ⚙️ Opening Settings displays the General tab and locale selector
    Given the user is on game page
    When the user opens the game sidebar
    And the user clicks the settings button in the game sidebar
    Then the element with testid "game-settings-modal" should be visible
    And the element with testid "game-settings-general-tab" should be visible
    And the element with testid "locale-select" should be visible
    And the exact text "Language" should be visible
    And the element with testid "game-sidebar-settings-button" should be hidden

  Scenario: ⚙️ About displays the Goat It tagline and version button
    Given the user is on game page
    When the user opens the game sidebar
    And the user clicks the settings button in the game sidebar
    And the user clicks on the tab with exact name "About"
    Then the game settings About tab should be displayed
    And the exact text "The game where the answer is guessed" should be visible
    And the element with testid "github-version-button" should be visible
    And the element with testid "game-settings-about-logo" should be visible

  Scenario: ⚙️ Selecting French in Settings switches the interface immediately
    Given the user is on game page
    When the user opens the game sidebar
    And the user clicks the settings button in the game sidebar
    And the user selects the "Français" locale option in the game settings
    Then the element with testid "game-settings-modal" should be visible
    And the exact text "Langue" should be visible
    And the exact text "Général" should be visible
    And the user should be on game page

  Scenario: ⚙️ Selecting French in Settings persists after a reload
    Given the user is on game page
    When the user opens the game sidebar
    And the user clicks the settings button in the game sidebar
    And the user selects the "Français" locale option in the game settings
    And the user reloads the page
    And the user opens the game sidebar
    And the user clicks the settings button in the game sidebar
    Then the element with testid "game-settings-general-tab" should be visible
    And the exact text "Langue" should be visible
    And the game settings selected locale should be "Français"
