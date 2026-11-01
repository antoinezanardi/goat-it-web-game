import { describe, it, expect } from "vitest";

import { createGoatItApiEndpoint } from "#server/utils/goat-it-api/helpers/goat-it-api-endpoint/goat-it-api-endpoint.helpers";
import { GoatItApiResourceNames } from "#server/utils/goat-it-api/goat-it-api.enums";
import type { CreateGoatItApiEndpointOptions } from "#server/utils/goat-it-api/goat-it-api.types";

describe(createGoatItApiEndpoint, () => {
  it.each<{
    description: string;
    resourceName: GoatItApiResourceNames;
    options?: CreateGoatItApiEndpointOptions;
    expectedEndpoint: string;
  }>([
    { description: "no options", resourceName: GoatItApiResourceNames.QUESTION_THEMES, expectedEndpoint: "/question-themes" },
    { description: "an id option", resourceName: GoatItApiResourceNames.QUESTION_THEMES, options: { id: "abc123" }, expectedEndpoint: "/question-themes/abc123" },
    {
      description: "an id option with query characters",
      resourceName: GoatItApiResourceNames.QUESTION_THEMES,
      options: { id: "abc?x=1" },
      expectedEndpoint: "/question-themes/abc%3Fx%3D1",
    },
    { description: "an id option with a space", resourceName: GoatItApiResourceNames.QUESTION_THEMES, options: { id: "abc def" }, expectedEndpoint: "/question-themes/abc%20def" },
    { description: "a suffix option", resourceName: GoatItApiResourceNames.QUESTIONS, options: { suffix: "search/random" }, expectedEndpoint: "/questions/search/random" },
    { description: "an empty id option", resourceName: GoatItApiResourceNames.QUESTION_THEMES, options: { id: "" }, expectedEndpoint: "/question-themes" },
    { description: "an empty suffix option", resourceName: GoatItApiResourceNames.QUESTIONS, options: { suffix: "" }, expectedEndpoint: "/questions" },
  ])(
    "should create the endpoint '$expectedEndpoint' for resource '$resourceName' when called with $description.",
    ({ resourceName, options, expectedEndpoint }) => {
      const endpoint = createGoatItApiEndpoint(resourceName, options);

      expect(endpoint).toBe(expectedEndpoint);
    },
  );
});