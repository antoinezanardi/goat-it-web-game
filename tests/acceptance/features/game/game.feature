@game-page
Feature: 🎮 Game Page

  Scenario: 🎮 Game Page is displayed with correct title
    Given the user is on game page
    Then the page title should be "Goat It – Play"

  Scenario: 🎮 Going through 20 questions still shows a question card
    Given the database is populated with the question fixture set "sixty-questions"
    And the user is on game page
    When the user skips 20 questions
    Then a game question should be displayed

  Scenario: 🎮 Empty state when no questions exist in the database
    Given the user is on game page
    Then the no more questions message should be displayed

  Scenario: 🎮 Previous button is hidden on first question
    Given the database is populated with the question fixture set "five-active-questions"
    And the user is on game page
    Then a game question should be displayed
    And the previous question button should be hidden
    And the next question button should be visible

  Scenario: 🎮 Previous button appears after advancing to second question
    Given the database is populated with the question fixture set "five-active-questions"
    And the user is on game page
    When the user goes to the next question
    Then a game question should be displayed
    And the previous question button should be visible
    And the next question button should be visible

  Scenario: 🎮 Previous button navigates back to the first question
    Given the database is populated with the question fixture set "five-active-questions"
    And the user is on game page
    When the user goes to the next question
    And the user goes to the previous question
    Then a game question should be displayed
    And the previous question button should be hidden
    And the next question button should be visible

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

  Scenario: 🎮 Question card displays all content correctly
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    Then the question card should be displayed
    And the question theme should be "Geography"
    And the question category should be "Trivia"
    And the question difficulty should be "Easy"
    And the question statement should be "What is the capital of France?"
    And the question answer should be "Paris"
    And the question source link "en.wikipedia.org" should be visible
    And the question source link "britannica.com" should be visible
    When the user expands the question context accordion
    Then the question context should be "Paris has been the capital of France since the 10th century."
    And the question trivia item "Paris is known as the City of Light" should be visible
    And the question trivia item "The Eiffel Tower was built in 1889" should be visible

  Scenario: 🚪 Confirm leave while playing
    Given the database is populated with the question fixture set "five-active-questions"
    And the user is on home page
    When the user clicks on the link with name "Play"
    Then the user should be on game page
    And a game question should be displayed
    When the user navigates back
    Then a confirmation modal should be displayed
    When the user clicks on the primary button in the modal
    Then the user should be on home page

  Scenario: 🚪 Cancel leave while playing
    Given the database is populated with the question fixture set "five-active-questions"
    And the user is on home page
    When the user clicks on the link with name "Play"
    Then the user should be on game page
    And a game question should be displayed
    When the user navigates back
    Then a confirmation modal should be displayed
    When the user clicks on the close button in the modal footer
    Then a game question should be displayed

  Scenario: 🚪 Navigate from game over without confirmation
    Given the user is on home page
    When the user clicks on the link with name "Play"
    Then the user should be on game page
    And the no more questions message should be displayed
    When the user clicks the back to home button
    Then the user should be on home page

  Scenario: 🎮 Source link opens in new tab with correct URL
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    Then the question card should be displayed
    When the user clicks on the question source link "en.wikipedia.org"
    Then a new tab should have been opened with URL "https://en.wikipedia.org/wiki/Paris"
