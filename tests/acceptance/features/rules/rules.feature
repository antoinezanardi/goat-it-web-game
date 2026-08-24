@rules-page
Feature: 📖 Rules Page

  Background:
    Given the user is on rules page
    And the user has reduced motion

  Scenario: 📖 Rules page loads and displays content
    Then the text "How to play Goat It?" should be visible

  Scenario: 📖 Rules page should display a table of contents with the section links
    Given the user has a desktop viewport
    Then the element with testid "docs-toc" should be visible
    And the table of contents should contain the link "The concept"

  Scenario: 📖 Rules page should hide the table of contents on mobile
    Given the user has a mobile viewport
    Then the element with testid "docs-toc" should be hidden

  Scenario: 📖 Rules page should not display the back to top button at the top of the page
    Then the element with testid "docs-back-to-top-button" should be hidden

  Scenario: 📖 Rules page should scroll to a section when clicking a table of contents link
    When the user clicks on the table of contents link "The golden rule"
    Then the "The golden rule" heading should be in the viewport

  Scenario: 📖 Rules page should navigate to the home page when clicking the back link
    When the user clicks on the link with name "Back to home"
    Then the user should be on home page

  Scenario: 📖 Rules page should navigate to the game page when clicking the start a game button
    When the user clicks on the link with name "Start a game"
    Then the user should be on game page
