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

  Scenario: 🤖 Robots.txt is served with sitemap reference
    Given the user is on robots.txt page
    Then the robots.txt response should reference the sitemap

  Scenario: 🗺️ Sitemap.xml is served with all routes
    Given the user is on sitemap.xml page
    Then the sitemap.xml should contain the route "/"
    And the sitemap.xml should contain the route "/game"

  Scenario: 🗺️ Sitemap.xml contains only expected routes
    Given the user is on sitemap.xml page
    Then the sitemap.xml should contain exactly the expected routes

  Scenario: 🔗 Canonical link tag is present on home page
    Given the user is on home page
    Then the canonical link should point to the current page

  Scenario: 🔗 Canonical link tag is present on game page
    Given the user is on game page
    Then the canonical link should point to the current page

  Scenario: 📋 Schema.org JSON-LD WebPage and WebSite structured data is injected on home page
    Given the user is on home page
    Then the page should contain schema.org WebPage and WebSite structured data

  Scenario: 📋 Schema.org JSON-LD WebPage and WebSite structured data is injected on game page
    Given the user is on game page
    Then the page should contain schema.org WebPage and WebSite structured data
