@game @game-keyboard
Feature: ⌨️ Game Page Keyboard Navigation

  Background:
    Given the tutorial invitation has already been decided

  Scenario: ⌨️ Right arrow advances and left arrow returns to the previous question
    Given the database is populated with the question fixture set "five-active-questions"
    And the user is on game page
    Then a game question should be displayed
    And the previous question button should be hidden
    When the user presses the right arrow key
    Then a game question should be displayed
    And the previous question button should be visible
    When the user presses the left arrow key
    Then a game question should be displayed
    And the previous question button should be hidden

  Scenario: ⌨️ Left arrow does nothing on the first question
    Given the database is populated with the question fixture set "five-active-questions"
    And the user is on game page
    Then a game question should be displayed
    And the previous question button should be hidden
    When the user presses the left arrow key
    Then a game question should be displayed
    And the previous question button should be hidden

  Scenario: ⌨️ Right arrow does nothing when the game is over
    Given the user is on game page
    Then the no more questions message should be displayed
    And the next question button should be hidden
    When the user presses the right arrow key
    Then the no more questions message should be displayed
    And the next question button should be hidden

  Scenario: ⌨️ Question arrows are ignored while the game sidebar is open
    Given the database is populated with the question fixture set "five-active-questions"
    And the user is on game page
    And a game question should be displayed
    When the user opens the game sidebar
    And the user presses the right arrow key
    Then the game sidebar should be visible
    And the previous question button should be hidden

  Scenario: ⌨️ Question arrows are ignored while the leave confirmation modal is open
    Given the database is populated with the question fixture set "five-active-questions"
    And the user is on home page
    When the user clicks on the link with name "Play"
    Then the user should be on game page
    And a game question should be displayed
    When the user navigates back
    Then a confirmation modal should be displayed
    When the user presses the right arrow key
    Then a confirmation modal should be displayed
    And the previous question button should be hidden

  Scenario: ⌨️ Tutorial arrows navigate tutorial steps instead of questions
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    When the user opens the interactive tutorial from the game sidebar
    Then the interactive tutorial step title should be "You hold the answer. It's up to them to find it!"
    When the user presses the right arrow key
    Then the interactive tutorial step title should be "Set the scene for the investigation"
    When the user presses the left arrow key
    Then the interactive tutorial step title should be "You hold the answer. It's up to them to find it!"
    When the user presses the right arrow key
    And the user presses the right arrow key
    And the user presses the right arrow key
    And the user presses the right arrow key
    And the user presses the right arrow key
    And the user presses the right arrow key
    And the user presses the right arrow key
    Then the interactive tutorial step title should be "Everything is within reach"
    When the user presses the right arrow key
    Then the interactive tutorial should be hidden
    And the question statement should be "What is the capital of France?"

  Scenario: ⌨️ Finishing the tutorial with the right arrow key does not advance the question
    Given the database is populated with the question fixture set "five-active-questions"
    And the user is on game page
    And a game question should be displayed
    When the user opens the interactive tutorial from the game sidebar
    And the user presses the right arrow key
    And the user presses the right arrow key
    And the user presses the right arrow key
    And the user presses the right arrow key
    And the user presses the right arrow key
    And the user presses the right arrow key
    And the user presses the right arrow key
    Then the interactive tutorial step title should be "Everything is within reach"
    When the user presses the right arrow key
    Then the interactive tutorial should be hidden
    And a game question should be displayed
    And the previous question button should be hidden

  Scenario: ⌨️ Question arrows remain usable while the themes popover is open
    Given the database is populated with the question fixture set "single-multi-themes-question"
    And the user is on game page
    Then the question card should be displayed
    When the user clicks on the theme icon stack
    And the themes popover should be visible
    And the user presses the right arrow key
    Then the no more questions message should be displayed
