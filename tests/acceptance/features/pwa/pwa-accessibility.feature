@pwa @accessibility
Feature: 📱 Progressive Web App Accessibility

  Scenario Outline: 📱 Offline fallback should not contain accessibility issues in <view> mode
    Given the user is on home page
    When the user navigates directly to the "/offline" page
    Then the offline fallback should be displayed
    And the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |

  Scenario Outline: 📱 Connectivity indicator should not contain accessibility issues while offline in <view> mode
    Given the user is on home page
    When the browser goes offline
    Then the connectivity indicator should display "Offline" with the "i-lucide-wifi-off" icon
    And the page should not contain accessibility issues in <view> mode

    Examples:
      | view    |
      | desktop |
      | mobile  |
