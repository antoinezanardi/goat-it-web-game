@home-page
Feature: 🏡 Home Page

  Scenario: 🏡 Home Page is displayed with correct title
    Given the user is on home page
    Then the page title should be "Goat It | Goat It"

  Scenario: 🎮 Clicking PLAY navigates to game page
    Given the user is on home page
    When the user clicks on the text "Play"
    Then the user should be on game page

  Scenario: 🐙 Version button opens repository
    Given the user is on home page
    When the user clicks on the version button
    Then a new tab should have been opened with URL "https://github.com/antoinezanardi/goat-it-web-game"
