@game @game-tutorial
Feature: 🧑‍🏫 Game Page Interactive Tutorial

  Background:
    Given the tutorial invitation has already been decided

  Scenario: 🧑‍🏫 Tutorial entry is visible for a live question
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    When the user opens the game sidebar
    Then the element with testid "game-sidebar-tutorial-link" should be visible

  Scenario: 🧑‍🏫 Tutorial entry is hidden when no live question is available
    Given the user is on game page
    And the no more questions message should be displayed
    When the user opens the game sidebar
    Then the element with testid "game-sidebar-tutorial-link" should be hidden

  Scenario: 🧑‍🏫 Tutorial starts after closing the sidebar
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    When the user opens the interactive tutorial from the game sidebar
    Then the element with testid "game-sidebar" should be hidden
    And the interactive tutorial should be visible
    And the interactive tutorial step title should be "You hold the answer. It's up to them to find it!"

  Scenario: 🧑‍🏫 Complete eight-step tour can be navigated forward and finished
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    When the user opens the interactive tutorial from the game sidebar
    Then the interactive tutorial step title should be "You hold the answer. It's up to them to find it!"
    When the user clicks the Next button in the interactive tutorial
    Then the interactive tutorial step title should be "Set the scene for the investigation"
    When the user clicks the Next button in the interactive tutorial
    Then the interactive tutorial step title should be "Launch the investigation"
    When the user clicks the Next button in the interactive tutorial
    Then the interactive tutorial step title should be "Your tools to guide them"
    When the user clicks the Next button in the interactive tutorial
    Then the interactive tutorial step title should be "It's up to you to validate the answer"
    When the user clicks the Next button in the interactive tutorial
    Then the interactive tutorial step title should be "Reveal the story behind the answer"
    When the user clicks the Next button in the interactive tutorial
    Then the interactive tutorial step title should be "Ready for the next investigation?"
    When the user clicks the Next button in the interactive tutorial
    Then the interactive tutorial step title should be "Everything is within reach"
    And the interactive tutorial should target the sidebar toggle
    When the user clicks the Finish button in the interactive tutorial
    Then the interactive tutorial should be hidden

  Scenario: 🧑‍🏫 Tutorial supports back-and-forth navigation and cannot go before step 1
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    When the user opens the interactive tutorial from the game sidebar
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Next button in the interactive tutorial
    Then the interactive tutorial step title should be "Launch the investigation"
    When the user clicks the Back button in the interactive tutorial
    Then the interactive tutorial step title should be "Set the scene for the investigation"
    When the user clicks the Back button in the interactive tutorial
    Then the interactive tutorial step title should be "You hold the answer. It's up to them to find it!"
    And the Back button should not be available in the interactive tutorial

  Scenario: 🧑‍🏫 Skipping the tour keeps the same question visible
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    When the user opens the interactive tutorial from the game sidebar
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Skip button in the interactive tutorial
    Then the interactive tutorial should be hidden
    And the question statement should be "What is the capital of France?"

  Scenario: 🧑‍🏫 Replaying the tour starts from step 1
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    When the user opens the interactive tutorial from the game sidebar
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Skip button in the interactive tutorial
    Then the interactive tutorial should be hidden
    When the user opens the interactive tutorial from the game sidebar
    Then the interactive tutorial step title should be "You hold the answer. It's up to them to find it!"

  Scenario: 🧑‍🏫 Tutorial is localized after switching locale
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    When the user opens the game sidebar
    And the user clicks the settings button in the game sidebar
    And the user selects the "Français" locale option in the game settings
    And the user clicks on the close button in the modal header
    Then the element with testid "game-settings-modal" should be hidden
    When the user opens the interactive tutorial from the game sidebar
    Then the interactive tutorial step title should be "Vous détenez la réponse. À eux de la trouver !"
