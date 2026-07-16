import { describe, expect, it } from "vitest";

import { normalizePlateInput } from "./plate";

describe("normalizePlateInput", () => {
  it("normalizes Brazilian plate input", () => {
    expect(normalizePlateInput("abc-1d23")).toBe("ABC1D23");
  });
});
