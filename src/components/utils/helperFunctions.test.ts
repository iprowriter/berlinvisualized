import { describe, expect, it } from "vitest";
import { formatString } from "./helperFunctions";

describe("formatString", () => {
  it("removes commas and joins words with '+'", () => {
    expect(formatString("29A Alexanderplatz, Berlin, Deutschland")).toBe("29A+Alexanderplatz+Berlin+Deutschland");
  });

  it("collapses repeated whitespace", () => {
    expect(formatString("Unter   den  Linden")).toBe("Unter+den+Linden");
  });

  it("returns an empty string unchanged", () => {
    expect(formatString("")).toBe("");
  });
});
