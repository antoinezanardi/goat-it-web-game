@seo
Feature: 🔍 Technical SEO

  Scenario: 🔍 Home page has SEO meta tags
    Given the user is on home page
    Then the following meta tags should be present:
      | type     | key             | content                                                                   |
      | name     | description     | Goat It — a multiplayer quiz game. Take on challenges with themed questions. |
      | property | og:title        | Goat It                                                                   |
      | property | og:description  | Goat It — a multiplayer quiz game. Take on challenges with themed questions. |

  Scenario: 🔍 Game page has SEO meta tags
    Given the user is on game page
    Then the following meta tags should be present:
      | type     | key             | content                                                                 |
      | name     | description     | Take on the challenge! Answer questions and test your knowledge on Goat It. |
      | property | og:title        | Goat It — Play                                                          |
      | property | og:description  | Take on the challenge! Answer questions and test your knowledge on Goat It. |

  Scenario: 📋 Schema.org JSON-LD Website structured data is injected on home page
    Given the user is on home page
    Then the page should contain schema.org Website structured data

  Scenario: 📋 Schema.org JSON-LD Website structured data is injected on game page
    Given the user is on game page
    Then the page should contain schema.org Website structured data
