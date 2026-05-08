import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { afterEach, describe, it, expect } from "vitest";
import { cleanup } from "@testing-library/react";
import Login from "../../components/Login/Login";

afterEach(() => {
  cleanup();
});

describe("Login", () => {
  it("renders login and logout buttons", () => {
    render(<Login />);

    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("renders exactly two action buttons", () => {
    render(<Login />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent("Login");
    expect(buttons[1]).toHaveTextContent("Logout");
  });
});
