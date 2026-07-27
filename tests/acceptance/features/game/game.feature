@game-page
Feature: 🎮 Game Page

  Scenario: 🎮 Game Page is displayed with correct title
    Given the user is on game page
    Then the page title should be "Goat It Game"

  Scenario: 🎮 Going through 20 questions still shows a question card
    Given the database is populated with the question fixture set "sixty-questions"
    And the user is on game page
    When the user skips 20 questions
    Then a game question should be displayed

  Scenario: 🎮 Empty state when no questions exist in the database
    Given the user is on game page
    Then the next question button should be visible
