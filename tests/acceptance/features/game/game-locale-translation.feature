@game @game-locale-translation
Feature: 🌍 Game Locale Translation

  Scenario: 🌍 Selecting French translates the active question
    Given the tutorial invitation has already been decided
    And the database is populated with the question fixture set "single-translatable-question"
    And the user is on game page
    When the user opens the game sidebar
    And the user clicks the settings button in the game sidebar
    And the user selects the "Français" locale option in the game settings
    Then the question statement should be "Quelle est la capitale de la France ?"
    And the user should be on game page
