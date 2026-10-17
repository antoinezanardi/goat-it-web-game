@security
Feature: 🛡️ Content security policy enforcement

  Scenario: 🛡️ No content security policy violations are reported on the served pages
    Given content security policy violations are being monitored
    When the user visits the "/" page
    Then no content security policy violations should have been reported
    When the user visits the "/game" page
    Then no content security policy violations should have been reported
    When the user visits the "/rules" page
    Then no content security policy violations should have been reported
