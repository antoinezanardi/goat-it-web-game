@locale-suggestion
Feature: 🌍 Locale Suggestion

  Scenario: 🌍 French suggestion toast is displayed and switching flips the UI to French
    Given the user browser languages are "fr-FR,fr"
    And the user is on home page
    Then the toast with exact text "Voulez-vous jouer en français ?" should be visible
    When the user clicks on the button with name "Jouer en français"
    Then the exact text "Comment jouer ?" should be visible

  Scenario: 🌍 French choice persists after accepting the suggestion
    Given the user browser languages are "fr-FR,fr"
    And the user is on home page
    When the user clicks on the button with name "Jouer en français"
    And the user reloads the page
    Then the exact text "Comment jouer ?" should be visible
    And the toast with exact text "Voulez-vous jouer en français ?" should be hidden

  Scenario: 🌍 English persists after declining the suggestion
    Given the user browser languages are "fr-FR,fr"
    And the user is on home page
    When the user clicks on the button with name "Non merci"
    Then the toast with exact text "Voulez-vous jouer en français ?" should be hidden
    And the user reloads the page
    Then the exact text "How to play?" should be visible
    And the toast with exact text "Voulez-vous jouer en français ?" should be hidden

  Scenario: 🌍 No suggestion toast when browser languages are unsupported
    Given the user browser languages are "ja-JP,ja"
    And the user is on home page
    Then the exact text "How to play?" should be visible
    And the toast with exact text "Voulez-vous jouer en français ?" should be hidden
