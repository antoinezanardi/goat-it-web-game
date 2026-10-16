@changelog
Feature: 🆕 End-User Changelog

  Background:
    Given the user has reduced motion

  Scenario: 🆕 A first visit starts silently at the latest release
    Given the user is on home page
    Then the element with testid "home-changelog-button" should be visible
    And the element with testid "changelog-unread-indicator" should be hidden
    And the toast with exact text "There's something new in Goat It!" should be hidden

  Scenario: 🆕 A newer release is announced once and keeps the unread marker
    Given the browser cookies are set with the cookie fixture set "changelog-outdated"
    And the user is on home page
    Then the toast with exact text "There's something new in Goat It!" should be visible
    And the element with testid "changelog-unread-indicator" should be visible
    When the user reloads the page
    Then the toast with exact text "There's something new in Goat It!" should be hidden
    And the element with testid "changelog-unread-indicator" should be visible

  Scenario: 🆕 The home footer entry point opens the release history
    Given the browser cookies are set with the cookie fixture set "changelog-outdated"
    And the user is on home page
    When the user clicks on the button with name "What's new"
    Then the element with testid "changelog-modal" should be visible

  Scenario: 🆕 Opening the release history clears the unread marker
    Given the browser cookies are set with the cookie fixture set "changelog-outdated"
    And the user is on home page
    Then the element with testid "changelog-unread-indicator" should be visible
    When the user clicks on the button with name "What's new"
    And the user clicks on the close button in the modal header
    Then the element with testid "changelog-unread-indicator" should be hidden

  Scenario: 🆕 The game sidebar entry point opens the shared release history
    Given the browser cookies are set with the cookie fixture set "changelog-outdated"
    And the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    When the user opens the game sidebar
    And the user clicks on the button with name "What's new"
    Then the element with testid "changelog-modal" should be visible

  Scenario: 🆕 The release history shows the translated baseline entry
    Given the browser cookies are set with the cookie fixture set "changelog-outdated"
    And the user is on home page
    When the user clicks on the button with name "What's new"
    Then the text "Settings, keyboard and a smoother tutorial" should be visible
