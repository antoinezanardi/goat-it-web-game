@home-page
Feature: 🏡 Home Page

  Scenario: 🏡 Home Page is displayed with correct title
    Given the user is on home page
    Then the page title should be "Goat It – The game where the answer is guessed"

  Scenario: 📝 Home Page displays the tagline and subtitle
    Given the user is on home page
    Then the text "The game where the answer is guessed" should be visible
    And the text "You don't need to know everything. You just need to ask the right questions." should be visible

  Scenario: 🎮 Clicking PLAY navigates to game page
    Given the user is on home page
    When the user clicks on the text "Play"
    Then the user should be on game page

  Scenario: 🐙 Version button opens repository
    Given the user is on home page
    When the user clicks on the version button
    Then a new tab should have been opened with URL "https://github.com/antoinezanardi/goat-it-web-game"

  Scenario: ❓ Clicking "How to play?" navigates to rules page
    Given the user is on home page
    When the user clicks on the text "How to play?"
    Then the user should be on rules page
