@game-sidebar
Feature: 🧭 Game Page Sidebar

  Scenario: 🧭 Opening the sidebar displays the brand header
    Given the user is on game page
    When the user opens the game sidebar
    Then the game sidebar should be visible
    And the game sidebar brand text should be "Goat It"

  Scenario: 🧭 Sidebar displays the back to home link and app version
    Given the user is on game page
    When the user opens the game sidebar
    Then the game sidebar back to home link should be visible
    And the game sidebar version button should be visible

  Scenario: 🧭 Clicking back to home in the sidebar navigates to home page
    Given the user is on game page
    And the no more questions message should be displayed
    When the user opens the game sidebar
    And the user clicks the back to home link in the game sidebar
    Then the user should be on home page

  Scenario: 🧭 Clicking back to home in the sidebar while playing shows the leave confirmation
    Given the database is populated with the question fixture set "five-active-questions"
    And the user is on game page
    And a game question should be displayed
    When the user opens the game sidebar
    And the user clicks the back to home link in the game sidebar
    Then a confirmation modal should be displayed

  Scenario: 🧭 Sidebar displays the rules link
    Given the user is on game page
    When the user opens the game sidebar
    Then the game sidebar rules link should be visible

  Scenario: 🧭 Clicking the rules link in the sidebar opens the rules page in a new tab
    Given the user is on game page
    And the no more questions message should be displayed
    When the user opens the game sidebar
    And the user clicks the rules link in the game sidebar
    Then the rules page should have been opened in a new tab
