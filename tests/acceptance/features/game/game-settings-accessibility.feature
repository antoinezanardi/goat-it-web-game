@game-settings @accessibility
Feature: ⚙️ Game Settings Accessibility

  Background:
    Given the database is populated with the question fixture set "single-question"
    And the tutorial invitation has already been decided
    And the user is on game page
    And a game question should be displayed

  Scenario Outline: ⚙️ Settings General tab should not contain accessibility issues in <view> mode
    Given the user has a <view> viewport
    When the user opens the game sidebar
    And the user clicks the settings button in the game sidebar
    And the element with testid "game-settings-modal" should be visible
    And the element with testid "game-settings-general-tab" should be visible
    And the element with testid "game-settings-adult-content-switch" should be visible
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |

  Scenario Outline: ⚙️ Settings About tab should not contain accessibility issues in <view> mode
    Given the user has a <view> viewport
    When the user opens the game sidebar
    And the user clicks the settings button in the game sidebar
    And the user clicks on the tab with exact name "About"
    And the game settings About tab should be displayed
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |
