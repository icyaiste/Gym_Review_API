import { describe, it, expect } from "vitest";

describe("Pipeline tests", () => {
  it("should pass", () => {
    expect(1 + 1).toBe(2);
  });

  it("should fail", () => {
    expect(1 + 1).toBe(3);
  });
});