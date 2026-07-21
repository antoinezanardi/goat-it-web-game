@game @accessibility
Feature: Game Page Accessibility

  Scenario Outline: <mode> viewport has no accessibility violations
    Given the database is populated with the question fixture set "five-questions"
    And the user is on game page
    Then the page should not contain accessibility issues in <mode> mode

    Examples:
      | mode    |
      | desktop |
      | mobile  |
