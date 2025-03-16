import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GlobalAppBar from "./GlobalAppBar";
import { BrowserRouter } from "react-router-dom";

describe("GlobalAppBar", () => {
  it("renders whole appbar correctly", () => {
    render(
      <BrowserRouter>
        <GlobalAppBar />
      </BrowserRouter>
    );
    expect(screen.getByTestId("appbar-toolbar")).toBeInTheDocument();
    expect(screen.getByText("Airbrb")).toBeInTheDocument();
    expect(screen.getByText("Landing Page")).toBeInTheDocument();
  });
});

describe("when user is logged in", () => {
  beforeEach(() => {
    localStorage.setItem("token", "dummytoken");
  });

  afterEach(() => {
    localStorage.removeItem("token");
  });

  test("renders Hosted Listing and Logout buttons", () => {
    render(
      <BrowserRouter>
        <GlobalAppBar />
      </BrowserRouter>
    );
    expect(screen.getByText("Hosted Listing")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("logout button removes token from localStorage", () => {
    const setTokenMock = jest.fn();

    render(
      <BrowserRouter>
        <GlobalAppBar setToken={setTokenMock} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Logout"));

    expect(localStorage.getItem("token")).toBeNull();
    expect(setTokenMock).toHaveBeenCalledWith(null);
  });

  test('navigates to "/host" on clicking "Hosted Listing" button', () => {
    render(
      <BrowserRouter>
        <GlobalAppBar />
      </BrowserRouter>
    );

    const hostedListingLink = screen.getByRole("link", {
      name: "Hosted Listing",
    });
    expect(hostedListingLink.getAttribute("href")).toBe("/host");
  });
});

describe("when user is not logged in", () => {
  test("renders Register and Login buttons", () => {
    render(
      <BrowserRouter>
        <GlobalAppBar />
      </BrowserRouter>
    );
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test('navigates to /register" on clicking "Register" button', () => {
    render(
      <BrowserRouter>
        <GlobalAppBar />
      </BrowserRouter>
    );

    const hostedListingLink = screen.getByRole("link", { name: "Register" });
    expect(hostedListingLink.getAttribute("href")).toBe("/register");
  });

  test('navigates to /register" on clicking "login" button', () => {
    render(
      <BrowserRouter>
        <GlobalAppBar />
      </BrowserRouter>
    );

    const hostedListingLink = screen.getByRole("link", { name: "Login" });
    expect(hostedListingLink.getAttribute("href")).toBe("/login");
  });
});
