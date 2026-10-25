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

  Scenario: 📱 Cold offline navigation shows the offline fallback at the requested URL
    Given the user is on home page
    And the service worker has precached the offline fallback
    When the browser goes offline
    And the user navigates directly to the "/game" page
    Then the offline fallback should be displayed
    And the user should be on game page

  Scenario: 📱 Offline reload shows the offline fallback at the requested URL
    Given the user is on rules page
    And the service worker has precached the offline fallback
    When the browser goes offline
    And the user reloads the current page
    Then the offline fallback should be displayed
    And the user should be on rules page

  Scenario: 📱 Online navigation to home, rules and game is not served by the offline fallback
    Given the database is populated with the question fixture set "five-active-questions"
    And the user is on home page
    And the service worker has precached the offline fallback
    Then the offline fallback should be hidden
    And the user should be on home page
    When the user is on rules page
    Then the offline fallback should be hidden
    And the user should be on rules page
    When the user is on game page
    Then the offline fallback should be hidden
    And a game question should be displayed

  Scenario: 📱 Reconnecting and using Retry reloads the requested page
    Given the database is populated with the question fixture set "five-active-questions"
    And the user is on home page
    And the service worker has precached the offline fallback
    When the browser goes offline
    And the user navigates directly to the "/game" page
    Then the offline fallback should be displayed
    When the browser goes online
    And the user clicks the offline retry link
    Then a game question should be displayed
    And the user should be on game page

  Scenario: 📱 Connectivity indicator reflects offline and reconnect transitions
    Given the user is on home page
    Then the connectivity indicator should be hidden
    When the browser goes offline
    Then the connectivity indicator should display "Offline" with the "i-lucide-wifi-off" icon
    When the browser goes online
    Then the connectivity indicator should display "Online" with the "i-lucide-wifi" icon
    And the connectivity indicator should be hidden after the online confirmation

  Scenario: 📱 Random question prefetch failure is silent when the browser is offline
    Given the database is populated with the question fixture set "sixty-questions"
    And the tutorial invitation has already been decided
    And the user is on game page
    And a game question should be displayed
    When the browser goes offline
    And the user skips 20 questions while the random questions request fails
    Then the toast with exact text "Unable to load questions. Please try again later." should be hidden
    And a game question should be displayed

  Scenario: 📱 Random question failure with a server response keeps its toast
    Given the database is populated with the question fixture set "five-active-questions"
    And the random questions request returns a server error
    When the user is on game page
    Then the toast with exact text "Unable to load questions. Please try again later." should be visible

  Scenario: 📱 Random question failure without a response keeps its toast when online
    Given the database is populated with the question fixture set "five-active-questions"
    And the random questions request fails without a response
    When the user is on game page
    Then the toast with exact text "Unable to load questions. Please try again later." should be visible

  Scenario: 📱 The built fallback is static and precached
    Then the built offline fallback should be a static document
    And the built service worker should precache the offline fallback

  Scenario: 📱 The offline fallback ignores the active locale
    Given the database is populated with the question fixture set "five-active-questions"
    And the tutorial invitation has already been decided
    And the user is on game page
    When the user opens the game sidebar
    And the user clicks the settings button in the game sidebar
    And the user selects the "Français" locale option in the game settings
    And the user clicks on the close button in the modal header
    And the service worker has precached the offline fallback
    And the browser goes offline
    And the user navigates directly to the "/game" page
    Then the offline fallback should be displayed
    And the exact text "You're offline" should be visible

  Scenario: 📱 Connectivity label follows the selected locale
    Given the database is populated with the question fixture set "five-active-questions"
    And the tutorial invitation has already been decided
    And the user is on game page
    When the user opens the game sidebar
    And the user clicks the settings button in the game sidebar
    And the user selects the "Français" locale option in the game settings
    And the user clicks on the close button in the modal header
    And the browser goes offline
    Then the connectivity indicator should display "Hors ligne" with the "i-lucide-wifi-off" icon
