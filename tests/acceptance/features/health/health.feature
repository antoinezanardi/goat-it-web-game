@health
Feature: 🩺 Health probes

  Scenario: 🩺 Liveness probe confirms the Nuxt server is running
    When the user requests the "/healthz" route as client "203.0.113.30"
    Then the response status should be 200
    And the health response should report the status "ok"
    And the health response should not be cached

  Scenario: 🩺 Readiness probe confirms the Nuxt server and API are ready
    When the user requests the "/readyz" route as client "203.0.113.31"
    Then the response status should be 200
    And the health response should report the status "ready"
    And the health response should not be cached
