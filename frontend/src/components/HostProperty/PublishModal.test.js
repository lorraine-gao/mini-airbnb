import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PublishModal from "./PublishModal.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DatePickersContainer from "../Styled/DatePickersContainer.jsx";
import { waitFor } from "@testing-library/react";

// Mock localStorage
const mockLocalStorage = (function () {
  let store = {};
  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("PublishModal", () => {
  const mockOnClose = jest.fn();
  const mockFetchData = jest.fn();
  const mockItemId = 1;
  const mockAvailableNumber = 3; // assume has 3 available dates

  it("renders correctly", () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <PublishModal
          itemId={mockItemId}
          open={true}
          onClose={mockOnClose}
          fetchData={mockFetchData}
          availableNumber={mockAvailableNumber}
        />
      </LocalizationProvider>
    );
    expect(
      screen.getByText(
        "Choose the date range for your property to be available!"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Number of available date")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument();
  });

  it("renders the correct number of date pickers", async () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <PublishModal
          itemId={mockItemId}
          open={true}
          onClose={mockOnClose}
          fetchData={mockFetchData}
          availableNumber={mockAvailableNumber}
        />
      </LocalizationProvider>
    );
    await waitFor((mockAvailableNumber) => {
      for (let i = 1; i <= mockAvailableNumber; i++) {
        expect(screen.getByLabelText(`Start Date ${i}`)).toBeInTheDocument();
        expect(screen.getByLabelText(`End Date ${i}`)).toBeInTheDocument();
      }
    });
  });

  it("allows changing the number of available dates", () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <PublishModal
          itemId={mockItemId}
          open={true}
          onClose={mockOnClose}
          fetchData={mockFetchData}
        />
      </LocalizationProvider>
    );
    const numberInput = screen.getByLabelText("Number of available date");
    fireEvent.change(numberInput, { target: { value: "2" } });
    expect(numberInput.value).toBe("2");
  });

  it("handles publish button click", async () => {
    window.localStorage.setItem("token", "dummyToken");

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ message: "Success" }),
      })
    );

    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <PublishModal
          itemId={mockItemId}
          open={true}
          onClose={mockOnClose}
          fetchData={mockFetchData}
        />
      </LocalizationProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "Publish" }));

    expect(global.fetch).toHaveBeenCalled();
    // clear fetch mock
    global.fetch.mockClear();
  });
});
