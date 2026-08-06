@game-page
Feature: 🎮 Game Page

  Scenario: 🎮 Game Page is displayed with correct title
    Given the user is on game page
    Then the page title should be "Goat It — Play"

  Scenario: 🎮 Going through 20 questions still shows a question card
    Given the database is populated with the question fixture set "sixty-questions"
    And the user is on game page
    When the user skips 20 questions
    Then a game question should be displayed

  Scenario: 🎮 Empty state when no questions exist in the database
    Given the user is on game page
    Then the no more questions message should be displayed

  Scenario: 🎮 "No more questions" message when all questions exhausted
    Given the database is populated with the question fixture set "five-active-questions"
    And the user is on game page
    When the user skips 5 questions
    Then the no more questions message should be displayed
    And the next question button should be hidden

  Scenario: 🎮 "Back to Home" navigates to home page from game over state
    Given the user is on game page
    And the no more questions message should be displayed
    When the user clicks the back to home button
    Then the user should be on home page
