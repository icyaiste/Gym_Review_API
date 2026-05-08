import React from "react";
import { render } from "@testing-library/react";
import { screen, waitFor } from "@testing-library/dom";
import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import axios from "axios";
import Profile from "../../components/Profile/Profile";

vi.mock("axios");

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

describe("Profile", () => {
  it("shows user data when profile request succeeds", async () => {
    (axios.get as any).mockResolvedValueOnce({
      data: {
        name: "Demo User",
        email: "demo@example.com",
        picture: "https://example.com/avatar.png",
      },
    });

    render(React.createElement(Profile));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /hello demo user/i })).toBeInTheDocument();
    });

    expect(screen.getByText("demo@example.com")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/avatar.png");
  });

  it("shows not logged in when profile request fails", async () => {
    (axios.get as any).mockRejectedValueOnce(new Error("Unauthorized"));

    render(React.createElement(Profile));

    await waitFor(() => {
      expect(screen.getByText(/not logged in/i)).toBeInTheDocument();
    });
  });
});
