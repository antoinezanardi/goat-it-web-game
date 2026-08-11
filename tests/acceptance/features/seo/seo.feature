@seo
Feature: 🔍 Technical SEO

  Scenario: 🔍 Home page has SEO meta tags
    Given the user is on home page
    Then the following meta tags should be present:
      | type     | key             | content                                                                       |
      | name     | description     | Goat It is a deduction game based on unusual facts. Ask the Game Master your questions, investigate, and find the answer. |
      | property | og:title        | Goat It — The game where the answer is guessed                                |
      | property | og:description  | Goat It is a deduction game based on unusual facts. Ask the Game Master your questions, investigate, and find the answer. |

  Scenario: 🔍 Game page has SEO meta tags
    Given the user is on game page
    Then the following meta tags should be present:
      | type     | key             | content                                                                       |
      | name     | description     | Ask the Game Master your questions, cross-reference the clues, and find the answer. An unusual fact lies behind every game. |
      | property | og:title        | Goat It – Play                                                                |
      | property | og:description  | Ask the Game Master your questions, cross-reference the clues, and find the answer. An unusual fact lies behind every game. |

  Scenario: 🖼️ Home page has og:image meta tag
    Given the user is on home page
    Then the meta tag with property "og:image" should be present

  Scenario: 🖼️ Home page has twitter:image meta tag
    Given the user is on home page
    Then the meta tag with property "twitter:image" should be present

  Scenario: 🖼️ Game page has og:image meta tag
    Given the user is on game page
    Then the meta tag with property "og:image" should be present

  Scenario: 🖼️ Game page has twitter:image meta tag
    Given the user is on game page
    Then the meta tag with property "twitter:image" should be present

  Scenario: 🖼️ Home page og:image returns a valid PNG image
    Given the user is on home page
    Then the og:image should return a valid PNG image

  Scenario: 🖼️ Game page og:image returns a valid PNG image
    Given the user is on game page
    Then the og:image should return a valid PNG image

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
