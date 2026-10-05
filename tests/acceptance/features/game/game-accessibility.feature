@game @accessibility
Feature: 🎮 Game Page Accessibility

  Scenario Outline: 🎮 Game Page should not contain accessibility issues without questions in <view> mode
    Given the user is on game page
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |

  Scenario Outline: 🚪 Leave confirmation should not contain accessibility issues while playing in <view> mode
    Given the user has a <view> viewport
    And the database is populated with the question fixture set "single-question"
    And the tutorial invitation has already been decided
    And the user is on home page
    When the user clicks on the link with name "Play"
    Then the user should be on game page
    And a game question should be displayed
    When the user navigates back
    Then a confirmation modal should be displayed
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |
