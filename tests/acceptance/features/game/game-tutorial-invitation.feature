@game @game-tutorial-invitation
Feature: 🧑‍🏫 Game Page Tutorial Invitation

  Scenario: 🧑‍🏫 Invitation is shown when the first playable game state is reached
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    Then the tutorial invitation should be visible
    And the tutorial invitation should offer the "Start tutorial" and "Not now" actions

  Scenario: 🧑‍🏫 Invitation stays visible until the user decides
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    Then the tutorial invitation should be visible
    When the user opens the game sidebar
    Then the tutorial invitation should be visible

  Scenario: 🧑‍🏫 Starting the tutorial from the invitation resolves it for later visits
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    When the user clicks the "Start tutorial" action in the tutorial invitation
    Then the tutorial invitation should be hidden
    And the interactive tutorial should be visible
    And the tutorial decision should be remembered
    When the user reloads the page
    Then the tutorial invitation should be hidden

  Scenario: 🧑‍🏫 Declining points the user to the game sidebar
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    When the user clicks the "Not now" action in the tutorial invitation
    Then the tutorial invitation should be hidden
    And the toast with exact text "The interactive tutorial is always available from the game sidebar." should be visible
    When the user opens the game sidebar
    Then the element with testid "game-sidebar-tutorial-link" should be visible

  Scenario: 🧑‍🏫 Declining is remembered on a later visit
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    When the user clicks the "Not now" action in the tutorial invitation
    And the user reloads the page
    And a game question should be displayed
    Then the tutorial invitation should be hidden
    When the user opens the game sidebar
    Then the element with testid "game-sidebar-tutorial-link" should be visible

  Scenario: 🧑‍🏫 Launching the tutorial from the sidebar accepts the invitation
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    Then the tutorial invitation should be visible
    When the user opens the interactive tutorial from the game sidebar
    Then the tutorial invitation should be hidden
    And the interactive tutorial should be visible
    And the tutorial decision should be remembered
    When the user reloads the page
    Then the tutorial invitation should be hidden

  Scenario: 🧑‍🏫 Game exit removes the invitation without deciding it
    Given the database is populated with the question fixture set "five-active-questions"
    And the user is on game page
    And a game question should be displayed
    Then the tutorial invitation should be visible
    When the user opens the game sidebar
    And the user clicks the back to home link in the game sidebar
    And the user clicks on the primary button in the modal
    Then the user should be on home page
    When the user is on game page
    And a game question should be displayed
    Then the tutorial invitation should be visible

  Scenario: 🧑‍🏫 Invitation coexists with the locale suggestion toast
    Given the user browser languages are "fr-FR,fr"
    And the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    Then the toast with exact text "Voulez-vous jouer en français ?" should be visible
    And the tutorial invitation should be visible

  Scenario: 🧑‍🏫 Invitation copy follows the selected locale
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    Then the tutorial invitation should be visible
    When the user opens the game sidebar
    And the user clicks the settings button in the game sidebar
    And the user selects the "Français" locale option in the game settings
    Then the toast with exact text "Voulez-vous lancer le tutoriel interactif ?" should be visible
    And the toast with exact text "Would you like to launch the interactive tutorial?" should be hidden

  Scenario: 🧑‍🏫 Tutorial replay stays available after accepting the invitation
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    When the user clicks the "Start tutorial" action in the tutorial invitation
    And the user clicks the Skip button in the interactive tutorial
    Then the interactive tutorial should be hidden
    When the user opens the interactive tutorial from the game sidebar
    Then the interactive tutorial step title should be "You hold the answer. It's up to them to find it!"
