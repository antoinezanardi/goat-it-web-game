@game-questions-filters @accessibility
Feature: 🎛️ Game Questions Filters Accessibility

  Scenario Outline: 🎛️ Question filters modal should not contain accessibility issues in <view> mode
    Given the user has a <view> viewport
    And the database is populated with the question fixture set "single-question"
    And the tutorial invitation has already been decided
    And the user is on game page
    And a game question should be displayed
    When the user opens the question filters
    And the element with testid "game-questions-filters-modal" should be visible
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |
