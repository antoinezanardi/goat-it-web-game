@game @accessibility
Feature: 🎮 Game Page Accessibility

  Scenario Outline: 🎮 Game Page should not contain accessibility issues without questions in <view> mode
    Given the user is on game page
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |
