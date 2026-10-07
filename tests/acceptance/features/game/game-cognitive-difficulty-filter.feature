@game-cognitive-difficulty-filter
Feature: 🧠 Cognitive Difficulty Filter

  Background:
    Given the tutorial invitation has already been decided

  Scenario: 🧠 Should show all cognitive difficulty options selected by default
    Given the user is on game page
    And the user opens the question filters
    Then the element with testid "game-settings-cognitive-difficulties-filter" should be visible
    And the questions filters difficulty filter summary should be "All difficulties"

  Scenario: 🧠 Should select all cognitive difficulties for a legacy settings cookie
    Given the user is on game page
    And the browser cookies are set with the cookie fixture set "game-settings-adult-content-enabled"
    And the user reloads the page
    And the user opens the question filters
    Then the questions filters difficulty filter summary should be "All difficulties"

  Scenario: 🧠 Should filter fetched questions by selected cognitive difficulties
    Given the database is populated with the question fixture set "cognitive-difficulty-questions"
    And the user is on game page
    And a game question should be displayed
    When the user opens the question filters
    And the user opens the questions filters difficulty filter
    And the user toggles the "Easy" cognitive difficulty option
    And the user toggles the "Medium" cognitive difficulty option
    And the user closes the cognitive difficulty filter
    And the user clicks on the primary button in the modal
    Then a game question should be displayed
    When the user goes to the next question
    Then the question difficulty should be "Hard"

  Scenario: 🧠 Should restore all difficulties after confirming the final deselection
    Given the user is on game page
    And the user opens the question filters
    When the user opens the questions filters difficulty filter
    And the user toggles the "Easy" cognitive difficulty option
    And the user toggles the "Medium" cognitive difficulty option
    And the user toggles the "Hard" cognitive difficulty option
    Then the element with testid "confirm-dialog-modal" should be visible
    When the user confirms restoring all options in the confirmation dialog
    Then the questions filters difficulty filter summary should be "All difficulties"

  Scenario: 🧠 Should retain the last difficulty after canceling the final deselection
    Given the user is on game page
    And the user opens the question filters
    When the user opens the questions filters difficulty filter
    And the user toggles the "Easy" cognitive difficulty option
    And the user toggles the "Medium" cognitive difficulty option
    And the user toggles the "Hard" cognitive difficulty option
    And the user keeps the last selected option in the confirmation dialog
    Then the questions filters difficulty filter summary should be "Hard"

  Scenario: 🧠 Should preserve cognitive difficulty settings across reloads
    Given the user is on game page
    And the user opens the question filters
    When the user opens the questions filters difficulty filter
    And the user toggles the "Easy" cognitive difficulty option
    And the user toggles the "Medium" cognitive difficulty option
    And the user closes the cognitive difficulty filter
    And the user clicks on the primary button in the modal
    And the user reloads the page
    And the user opens the question filters
    Then the questions filters difficulty filter summary should be "Hard"
