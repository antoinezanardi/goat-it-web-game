@game-questions-filters
Feature: 🎛️ Game Questions Filters

  Background:
    Given the tutorial invitation has already been decided

  Scenario: 🎛️ Opening the question filters shows the committed values
    Given the user is on game page
    When the user opens the question filters
    Then the element with testid "game-questions-filters-modal" should be visible
    And the questions filters adult content switch should be off
    And the questions filters adult content description should be "Only questions suitable for all audiences will appear."
    And the questions filters difficulty filter summary should be "All difficulties"

  Scenario: 🎛️ Turning on the adult content filter updates its description and icon
    Given the user is on game page
    When the user opens the question filters
    And the user turns on the questions filters adult content switch
    Then the questions filters adult content switch should be on
    And the questions filters adult content description should be "Questions involving sensitive topics (wars, violence, sex…) may appear."
    And the questions filters adult content icon should be active

  Scenario: 🎛️ Adult content filter is restored from an existing settings cookie
    Given the user is on game page
    And the browser cookies are set with the cookie fixture set "game-settings-adult-content-enabled"
    And the user reloads the page
    And the user opens the question filters
    Then the questions filters adult content switch should be on

  Scenario: 🎛️ Adult content filter falls back to disabled with a corrupt settings cookie
    Given the user is on game page
    And the browser cookies are set with the cookie fixture set "game-settings-corrupt"
    And the user reloads the page
    And the user opens the question filters
    Then the questions filters adult content switch should be off
    And the questions filters adult content description should be "Only questions suitable for all audiences will appear."

  Scenario: 🎛️ Discarding unapplied edits restores the committed values
    Given the user is on game page
    When the user opens the question filters
    And the user turns on the questions filters adult content switch
    And the user clicks on the close button in the modal header
    And the user opens the question filters
    Then the questions filters adult content switch should be off

  Scenario: 🎛️ Apply is enabled only when the draft differs from the committed values
    Given the user is on game page
    When the user opens the question filters
    Then the questions filters apply button should be disabled
    When the user turns on the questions filters adult content switch
    Then the questions filters apply button should be enabled
    When the user turns off the questions filters adult content switch
    Then the questions filters apply button should be disabled

  Scenario: 🎛️ Applying filters persists both values across reloads
    Given the user is on game page
    When the user opens the question filters
    And the user turns on the questions filters adult content switch
    And the user opens the questions filters difficulty filter
    And the user toggles the "Easy" cognitive difficulty option
    And the user toggles the "Medium" cognitive difficulty option
    And the user closes the cognitive difficulty filter
    And the user clicks on the primary button in the modal
    And the user reloads the page
    And the user opens the question filters
    Then the questions filters adult content switch should be on
    And the questions filters difficulty filter summary should be "Hard"

  Scenario: 🎛️ Applying filters commits them and refreshes the upcoming questions
    Given the database is populated with the question fixture set "cognitive-difficulty-questions"
    And the user is on game page
    And a game question should be displayed
    When the user opens the question filters
    And the user opens the questions filters difficulty filter
    And the user toggles the "Easy" cognitive difficulty option
    And the user toggles the "Medium" cognitive difficulty option
    And the user closes the cognitive difficulty filter
    And the user clicks on the primary button in the modal
    Then the element with testid "game-questions-filters-modal" should be hidden
    And the toast with exact text "Filters applied. Your next questions will use the updated filters." should be visible
    And a game question should be displayed
    When the user goes to the next question
    Then the question difficulty should be "Hard"
