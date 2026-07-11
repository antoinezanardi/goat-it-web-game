Feature: Home

  Scenario: The home page should display the application title
    Given the user is on the "/" page
    Then the page title should be "Goat It Game"
