@seo @html-lang
Feature: 🌐 HTML Lang Attribute

  Scenario: 🌐 Default locale language is applied on initial page load
    Given the user is on home page
    Then the html lang attribute should be "en-US"

  Scenario: 🌐 Cookie locale language is applied on initial page load
    Given the browser cookies are set with the cookie fixture set "locale-french"
    And the user is on home page
    Then the html lang attribute should be "fr-FR"

  Scenario: 🌐 Switching locale updates the html lang attribute at runtime
    Given the user browser languages are "fr-FR,fr"
    And the user is on home page
    Then the html lang attribute should be "en-US"
    When the user clicks on the button with name "Jouer en français"
    Then the html lang attribute should be "fr-FR"
