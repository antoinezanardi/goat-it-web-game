@rules-page
Feature: 📖 Rules Page

  Scenario: 📖 Rules page loads and displays content
    Given the user is on rules page
    Then the text "How to play Goat It?" should be visible
