@security
Feature: 🛡️ Proxy security hardening

  Scenario: 🛡️ Rate limiting returns a 429 with a retry after header once the budget is exceeded
    Given the rate limit budget for client "203.0.113.7" is exhausted
    Then the response status should be 429
    And the response should carry a retry after header

  Scenario: 🛡️ Rate limiting one client does not affect another client
    Given the rate limit budget for client "203.0.113.8" is exhausted
    When the user requests the "/api/goat-it-api/question-themes" route as client "203.0.113.9"
    Then the response status should be 200

  Scenario: 🛡️ Every page response carries the agreed security headers
    When the user requests the "/" route as client "203.0.113.10"
    Then the response should carry the security headers

  Scenario: 🛡️ Api responses are private, not stored and vary on the cookie
    When the user requests the "/api/goat-it-api/question-themes" route as client "203.0.113.11"
    Then the response should be private, not stored and vary on the cookie

  Scenario: 🛡️ All inline scripts in served HTML carry a content security policy nonce
    Given the user is on home page
    Then all inline scripts in the "/" response should carry the content security policy nonce
    And all inline scripts in the "/game" response should carry the content security policy nonce
    And all inline scripts in the "/rules" response should carry the content security policy nonce

  Scenario: 🛡️ An oversized json body is rejected with a payload too large error
    When the user posts a json body of 600000 bytes to the "/api/goat-it-api/questions/search/random" route as client "203.0.113.12"
    Then the response status should be 413

  Scenario: 🛡️ A non json body is rejected with an unsupported media type error
    When the user posts a non json body to the "/api/goat-it-api/questions/search/random" route as client "203.0.113.13"
    Then the response status should be 415
