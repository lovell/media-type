/*!
  Copyright 2013 Lovell Fuller and others.
  SPDX-License-Identifier: Apache-2.0
*/

// Based on test cases taken from https://github.com/web-platform-tests/wpt

import { strictEqual } from "node:assert";
import { test } from "node:test";
import { MediaType } from "../dist/media-type.mjs";

import webPlatformTestCases from "./web-platform-test.json" with {
  type: "json",
};

test("web-platform-test", async (t) => {
  await Promise.all(
    webPlatformTestCases.map(({ input, output }) => {
      return t.test(input, () => {
        const type = MediaType.parse(input);
        strictEqual(type?.toString(), output);
      });
    }),
  );
});
