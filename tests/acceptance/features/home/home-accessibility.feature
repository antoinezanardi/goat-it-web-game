@home @accessibility
Feature: Home Page Accessibility

  Scenario Outline: <mode> viewport has no accessibility violations
    Given the database is populated with the question theme fixture set "five-question-themes"
    And the user is on home page
    Then the page should not contain accessibility issues in <mode> mode

    Examples:
      | mode    |
      | desktop |
      | mobile  |
