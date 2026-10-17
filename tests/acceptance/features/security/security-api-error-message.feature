@security
Feature: 🛡️ Rate limited error message

  Scenario: 🛡️ The game shows the translated rate limited message when the api returns a rate limit error
    Given the client "203.0.113.20" is used for every browser request
    And the rate limit budget for client "203.0.113.20" is exhausted
    When the user is on game page
    Then the toast with exact text "Too many requests. Please wait a moment and try again." should be visible
