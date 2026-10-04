@game @accessibility
Feature: 🎮 Game Question Accessibility

  Background:
    Given the tutorial invitation has already been decided

  Scenario Outline: 🎮 Populated game playing screen should not contain accessibility issues in <view> mode
    Given the user has a <view> viewport
    And the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |

  Scenario Outline: 🎮 Expanded question context should not contain accessibility issues in <view> mode
    Given the user has a <view> viewport
    And the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    When the user expands the question context accordion
    And the question context should be "Paris has been the capital of France since the 10th century."
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |

  Scenario Outline: 🎮 Theme stack popover should not contain accessibility issues in <view> mode
    Given the user has a <view> viewport
    And the database is populated with the question fixture set "single-multi-themes-question"
    And the user is on game page
    And a game question should be displayed
    When the user clicks on the theme icon stack
    And the themes popover should be visible
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |

  Scenario Outline: 🎮 Primary theme hint popover should not contain accessibility issues in <view> mode
    Given the user has a <view> viewport
    And the database is populated with the question fixture set "single-multi-themes-question"
    And the user is on game page
    And a game question should be displayed
    And hovering the primary theme hint badge shows the popover "The primary theme is a hint for the answer"
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |

  Scenario Outline: 🎮 Difficulty badge popover should not contain accessibility issues in <view> mode
    Given the user has a <view> viewport
    And the database is populated with the question fixture set "single-multi-themes-question"
    And the user is on game page
    And a game question should be displayed
    And the question difficulty should be "Medium"
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |

  Scenario Outline: 🎮 Adult content badge popover should not contain accessibility issues in <view> mode
    Given the user has a <view> viewport
    And the database is populated with the question fixture set "single-adult-content-question"
    And the browser cookies are set with the cookie fixture set "game-settings-adult-content-enabled"
    And the user is on game page
    And a game question should be displayed
    And the adult content badge should be visible
    And hovering the adult content badge shows the popover "This question is intended for a mature audience"
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |
