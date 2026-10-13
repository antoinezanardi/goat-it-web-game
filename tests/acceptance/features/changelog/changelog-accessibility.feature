@changelog @accessibility
Feature: 🆕 End-User Changelog Accessibility

  Scenario Outline: 🆕 The changelog release history should not contain accessibility issues in <view> mode
    Given the user has reduced motion
    And the browser cookies are set with the cookie fixture set "changelog-outdated"
    And the user has a <view> viewport
    And the user is on home page
    When the user clicks on the button with name "What's new"
    And the element with testid "changelog-modal" should be visible
    Then the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |
