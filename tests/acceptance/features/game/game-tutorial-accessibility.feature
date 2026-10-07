@game @game-tutorial @accessibility
Feature: 🧑‍🏫 Game Tutorial Accessibility

  Background:
    Given the database is populated with the question fixture set "single-question"
    And the tutorial invitation has already been decided
    And the user is on game page
    And a game question should be displayed

  Scenario Outline: 🧑‍🏫 Tutorial first step should not contain accessibility issues in <view> mode
    Given the user has a <view> viewport
    When the user opens the interactive tutorial from the game sidebar
    And the interactive tutorial step title should be "You hold the answer. It's up to them to find it!"
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |

  Scenario Outline: 🧑‍🏫 Tutorial middle step should not contain accessibility issues in <view> mode
    Given the user has a <view> viewport
    When the user opens the interactive tutorial from the game sidebar
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Next button in the interactive tutorial
    And the interactive tutorial step title should be "Your tools to guide them"
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |

  Scenario Outline: 🧑‍🏫 Tutorial filters step should not contain accessibility issues in <view> mode
    Given the user has a <view> viewport
    When the user opens the interactive tutorial from the game sidebar
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Next button in the interactive tutorial
    And the interactive tutorial step title should be "Shape the next investigations"
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |

  Scenario Outline: 🧑‍🏫 Tutorial final step should not contain accessibility issues in <view> mode
    Given the user has a <view> viewport
    When the user opens the interactive tutorial from the game sidebar
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Next button in the interactive tutorial
    And the user clicks the Next button in the interactive tutorial
    And the interactive tutorial step title should be "Everything is within reach"
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |
