@home @accessibility
Feature: 🏠 Home Page Accessibility

  Scenario Outline: 🏠 Home Page should not contain accessibility issues in <view> mode
    Given the database is populated with the question theme fixture set "five-question-themes"
    And the user is on home page
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |
