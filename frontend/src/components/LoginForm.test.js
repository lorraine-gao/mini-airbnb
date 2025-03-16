import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  const mockSetEmail = jest.fn();
  const mockSetPassword = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    render(
      <LoginForm
        email=""
        setEmail={mockSetEmail}
        password=""
        setPassword={mockSetPassword}
        login={mockLogin}
      />
    );
  });

  test("renders email and password input fields and login button", () => {
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  test("allows entering email and password", () => {
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password" },
    });

    expect(mockSetEmail).toHaveBeenCalledWith("user@example.com");
    expect(mockSetPassword).toHaveBeenCalledWith("password");
  });

  test("calls login function on button click", () => {
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(mockLogin).toHaveBeenCalled();
  });
});
