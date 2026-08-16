@pwa
Feature: 📱 Progressive Web App

  Scenario: 📱 The manifest link is present in the document head
    Given the user is on home page
    Then the manifest link should be present in the document head

  Scenario: 📱 The theme color meta tag is present with the correct value
    Given the user is on home page
    Then the theme color meta tag should have content "#09090b"

  Scenario: 📱 The apple touch icon link is present in the document head
    Given the user is on home page
    Then the apple touch icon link should be present in the document head

  Scenario: 📱 The mobile web app capable meta tag is present
    Given the user is on home page
    Then the mobile web app capable meta tag should be present

  Scenario: 📱 The service worker registers and becomes active after page load
    Given the user is on home page
    Then the service worker should be active
