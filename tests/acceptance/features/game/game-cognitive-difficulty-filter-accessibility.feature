@game-cognitive-difficulty-filter @accessibility
Feature: 🧠 Cognitive Difficulty Filter Accessibility

  Scenario Outline: 🧠 Cognitive difficulty filter should not contain accessibility issues in <view> mode
    Given the user has a <view> viewport
    And the tutorial invitation has already been decided
    And the user is on game page
    And the user opens the game sidebar
    And the user clicks the settings button in the game sidebar
    And the element with testid "game-settings-cognitive-difficulties-filter" should be visible
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |
