@rules @accessibility
Feature: 📖 Rules Page Accessibility

  Scenario Outline: 📖 Rules Page should not contain accessibility issues in <view> mode
    Given the user is on rules page
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |
