Feature: Home

  Scenario: The home page should display the application title
    Given the user is on the "/" page
    Then the text "Goat It Game" should be visible
