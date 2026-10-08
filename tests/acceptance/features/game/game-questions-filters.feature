@game-questions-filters
Feature: 🎛️ Game Questions Filters

  Background:
    Given the tutorial invitation has already been decided

  Scenario: 🎛️ Opening the question filters shows the committed values
    Given the user is on game page
    When the user opens the question filters
    Then the element with testid "game-questions-filters-modal" should be visible
    And the questions filters adult content switch should be off
    And the questions filters adult content description should be "Only questions suitable for all audiences will appear."
    And the questions filters difficulty filter summary should be "All difficulties"

  Scenario: 🎛️ Turning on the adult content filter updates its description and icon
    Given the user is on game page
    When the user opens the question filters
    And the user turns on the questions filters adult content switch
    Then the questions filters adult content switch should be on
    And the questions filters adult content description should be "Questions involving sensitive topics (wars, violence, sex…) may appear."
    And the questions filters adult content icon should be active

  Scenario: 🎛️ Adult content filter is restored from an existing settings cookie
    Given the user is on game page
    And the browser cookies are set with the cookie fixture set "game-settings-adult-content-enabled"
    And the user reloads the page
    And the user opens the question filters
    Then the questions filters adult content switch should be on

  Scenario: 🎛️ Adult content filter falls back to disabled with a corrupt settings cookie
    Given the user is on game page
    And the browser cookies are set with the cookie fixture set "game-settings-corrupt"
    And the user reloads the page
    And the user opens the question filters
    Then the questions filters adult content switch should be off
    And the questions filters adult content description should be "Only questions suitable for all audiences will appear."

  Scenario: 🎛️ Discarding unapplied edits restores the committed values
    Given the user is on game page
    When the user opens the question filters
    And the user turns on the questions filters adult content switch
    And the user clicks on the close button in the modal header
    And the user confirms closing without applying
    And the user opens the question filters
    Then the questions filters adult content switch should be off

  Scenario: 🎛️ Apply is enabled only when the draft differs from the committed values
    Given the user is on game page
    When the user opens the question filters
    Then the questions filters apply button should be disabled
    When the user turns on the questions filters adult content switch
    Then the questions filters apply button should be enabled
    When the user turns off the questions filters adult content switch
    Then the questions filters apply button should be disabled

  Scenario: 🎛️ Applying filters persists both values across reloads
    Given the user is on game page
    When the user opens the question filters
    And the user turns on the questions filters adult content switch
    And the user opens the questions filters difficulty filter
    And the user toggles the "Easy" cognitive difficulty option
    And the user toggles the "Medium" cognitive difficulty option
    And the user closes the cognitive difficulty filter
    And the user clicks on the primary button in the modal
    And the user reloads the page
    And the user opens the question filters
    Then the questions filters adult content switch should be on
    And the questions filters difficulty filter summary should be "Hard"

  Scenario: 🎛️ Applying filters commits them and refreshes the upcoming questions
    Given the database is populated with the question fixture set "cognitive-difficulty-questions"
    And the user is on game page
    And a game question should be displayed
    When the user opens the question filters
    And the user opens the questions filters difficulty filter
    And the user toggles the "Easy" cognitive difficulty option
    And the user toggles the "Medium" cognitive difficulty option
    And the user closes the cognitive difficulty filter
    And the user clicks on the primary button in the modal
    Then the element with testid "game-questions-filters-modal" should be hidden
    And the toast with exact text "Filters applied. Your next questions will use the updated filters." should be visible
    And a game question should be displayed
    When the user goes to the next question
    Then the question difficulty should be "Hard"

  Scenario: 🧠 Should show all cognitive difficulty options selected by default
    Given the user is on game page
    And the user opens the question filters
    Then the element with testid "game-settings-cognitive-difficulties-filter" should be visible
    And the questions filters difficulty filter summary should be "All difficulties"

  Scenario: 🧠 Should select all cognitive difficulties for a legacy settings cookie
    Given the user is on game page
    And the browser cookies are set with the cookie fixture set "game-settings-adult-content-enabled"
    And the user reloads the page
    And the user opens the question filters
    Then the questions filters difficulty filter summary should be "All difficulties"

  Scenario: 🧠 Should filter fetched questions by selected cognitive difficulties
    Given the database is populated with the question fixture set "cognitive-difficulty-questions"
    And the user is on game page
    And a game question should be displayed
    When the user opens the question filters
    And the user opens the questions filters difficulty filter
    And the user toggles the "Easy" cognitive difficulty option
    And the user toggles the "Medium" cognitive difficulty option
    And the user closes the cognitive difficulty filter
    And the user clicks on the primary button in the modal
    Then a game question should be displayed
    When the user goes to the next question
    Then the question difficulty should be "Hard"

  Scenario: 🧠 Should restore all difficulties after confirming the final deselection
    Given the user is on game page
    And the user opens the question filters
    When the user opens the questions filters difficulty filter
    And the user toggles the "Easy" cognitive difficulty option
    And the user toggles the "Medium" cognitive difficulty option
    And the user toggles the "Hard" cognitive difficulty option
    Then the element with testid "confirm-dialog-modal" should be visible
    When the user confirms restoring all options in the confirmation dialog
    Then the questions filters difficulty filter summary should be "All difficulties"

  Scenario: 🧠 Should retain the last difficulty after canceling the final deselection
    Given the user is on game page
    And the user opens the question filters
    When the user opens the questions filters difficulty filter
    And the user toggles the "Easy" cognitive difficulty option
    And the user toggles the "Medium" cognitive difficulty option
    And the user toggles the "Hard" cognitive difficulty option
    And the user keeps the last selected option in the confirmation dialog
    Then the questions filters difficulty filter summary should be "Hard"

  Scenario: 🧠 Should preserve cognitive difficulty settings across reloads
    Given the user is on game page
    And the user opens the question filters
    When the user opens the questions filters difficulty filter
    And the user toggles the "Easy" cognitive difficulty option
    And the user toggles the "Medium" cognitive difficulty option
    And the user closes the cognitive difficulty filter
    And the user clicks on the primary button in the modal
    And the user reloads the page
    And the user opens the question filters
    Then the questions filters difficulty filter summary should be "Hard"

  Scenario: 🎛️ Opening the filters from the sidebar closes the sidebar and opens the modal
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    When the user opens the game sidebar
    And the user opens the question filters from the game sidebar
    Then the element with testid "game-sidebar" should be hidden
    And the element with testid "game-questions-filters-modal" should be visible

  Scenario: 🎛️ Dismissing the sidebar without the filters action does not open the filters
    Given the user is on game page
    When the user opens the game sidebar
    And the user closes the game sidebar
    Then the element with testid "game-questions-filters-modal" should be hidden

  Scenario: 🎛️ Opening the filters from the sidebar works with reduced motion
    Given the user has reduced motion
    And the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    When the user opens the game sidebar
    And the user opens the question filters from the game sidebar
    Then the element with testid "game-questions-filters-modal" should be visible

  Scenario: 🎛️ Applied count is hidden on the trigger and in the modal header
    Given the user is on game page
    When the user opens the question filters
    Then the question filters trigger count badge should be hidden
    And the element with testid "game-questions-filters-modal-count-badge" should be hidden

  Scenario: 🎛️ Editing the draft does not change the applied count
    Given the user is on game page
    When the user opens the question filters
    And the user turns on the questions filters adult content switch
    And the user clicks on the primary button in the modal
    And the user opens the question filters
    And the user turns off the questions filters adult content switch
    Then the question filters applied count in the modal header should be 1

  Scenario: 🎛️ Applying a filter updates the applied count on the trigger and in the modal header
    Given the user is on game page
    When the user opens the question filters
    And the user turns on the questions filters adult content switch
    And the user clicks on the primary button in the modal
    Then the question filters applied count on the trigger should be 1
    When the user opens the question filters
    Then the question filters applied count in the modal header should be 1

  Scenario: 🎛️ The sidebar filters entry shows the applied count
    Given the database is populated with the question fixture set "single-question"
    And the user is on game page
    And a game question should be displayed
    When the user opens the question filters
    And the user turns on the questions filters adult content switch
    And the user clicks on the primary button in the modal
    And the user opens the game sidebar
    Then the question filters applied count in the sidebar should be 1

  Scenario: 🎛️ Reset restores the draft defaults without committing them
    Given the user is on game page
    When the user opens the question filters
    And the user turns on the questions filters adult content switch
    Then the element with testid "game-questions-filters-modal-reset-button" should be visible
    When the user clicks the reset button in the question filters modal
    Then the questions filters adult content switch should be off
    And the question filters trigger count badge should be hidden
    And the questions filters apply button should be disabled

  Scenario: 🎛️ Reset can be followed by applying the defaults
    Given the user is on game page
    When the user opens the question filters
    And the user turns on the questions filters adult content switch
    And the user clicks on the primary button in the modal
    And the user opens the question filters
    And the user clicks the reset button in the question filters modal
    Then the questions filters apply button should be enabled
    When the user clicks on the primary button in the modal
    Then the question filters trigger count badge should be hidden

  Scenario: 🎛️ Reset draft is discarded when the modal is dismissed without applying
    Given the user is on game page
    When the user opens the question filters
    And the user turns on the questions filters adult content switch
    And the user clicks on the primary button in the modal
    And the user opens the question filters
    And the user clicks the reset button in the question filters modal
    And the user clicks on the close button in the modal header
    And the user confirms closing without applying
    And the user opens the question filters
    Then the questions filters adult content switch should be on
    And the element with testid "game-questions-filters-modal-reset-button" should be visible

  Scenario: 🎛️ Filter counts and reset are exposed with singular then plural accessible names
    Given the user is on game page
    When the user opens the question filters
    And the user turns on the questions filters adult content switch
    Then the element with testid "game-questions-filters-modal-count-badge" should be hidden
    And the element with testid "game-questions-filters-modal-reset-button" should have the accessible name "Reset"
    When the user clicks on the primary button in the modal
    Then the element with testid "game-questions-filters-button-badge" should have the accessible name "1 active filter"
    When the user opens the question filters
    Then the element with testid "game-questions-filters-modal-count-badge" should have the accessible name "1 active filter"
    When the user opens the questions filters difficulty filter
    And the user toggles the "Easy" cognitive difficulty option
    And the user closes the cognitive difficulty filter
    And the user clicks on the primary button in the modal
    Then the element with testid "game-questions-filters-button-badge" should have the accessible name "2 active filters"
    When the user opens the game sidebar
    Then the element with testid "game-sidebar-filters-link" should have the accessible name "Question filters 2 active filters"

  Scenario: 🎛️ Closing a modified filters draft requests a discard confirmation
    Given the user is on game page
    When the user opens the question filters
    And the user turns on the questions filters adult content switch
    And the user clicks on the close button in the modal header
    Then the element with testid "confirm-dialog-modal" should be visible

  Scenario: 🎛️ Closing an unmodified filters draft closes directly
    Given the user is on game page
    When the user opens the question filters
    And the user clicks on the close button in the modal header
    Then the element with testid "game-questions-filters-modal" should be hidden
    And the element with testid "confirm-dialog-modal" should be hidden

  Scenario Outline: 🎛️ Returning from the discard confirmation preserves filter edits
    Given the user is on game page
    When the user opens the question filters
    And the user turns on the questions filters adult content switch
    And the user clicks on the close button in the modal header
    Then the element with testid "confirm-dialog-modal" should be visible
    When the user returns from the discard confirmation by <action>
    Then the element with testid "game-questions-filters-modal" should be visible
    And the questions filters adult content switch should be on

    Examples:
      | action          |
      | going back      |
      | pressing escape |

  Scenario: 🎛️ Clicking outside the discard confirmation preserves filter edits
    Given the user is on game page
    When the user opens the question filters
    And the user turns on the questions filters adult content switch
    And the user clicks on the close button in the modal header
    Then the element with testid "confirm-dialog-modal" should be visible
    When the user clicks on the overlay outside of the modal
    Then the element with testid "game-questions-filters-modal" should be visible
    And the questions filters adult content switch should be on

  Scenario: 🎛️ Confirming close discards unapplied filter edits
    Given the user is on game page
    When the user opens the question filters
    And the user turns on the questions filters adult content switch
    And the user clicks on the close button in the modal header
    And the user confirms closing without applying
    Then the element with testid "game-questions-filters-modal" should be hidden
    When the user opens the question filters
    Then the questions filters adult content switch should be off

  Scenario: 🎛️ Applying filters does not show a discard confirmation
    Given the user is on game page
    When the user opens the question filters
    And the user turns on the questions filters adult content switch
    And the user clicks on the primary button in the modal
    Then the element with testid "game-questions-filters-modal" should be hidden
    And the element with testid "confirm-dialog-modal" should be hidden
    And the toast with exact text "Filters applied. Your next questions will use the updated filters." should be visible

