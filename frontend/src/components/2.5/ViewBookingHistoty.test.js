import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ViewBookingHistory from "./ViewBookingHistory";

describe("ViewBookingHistory", () => {
  const mockItem = {
    id: "123",
    owner: "John Doe",
    dateRange: {
      start: new Date(2021, 1, 1),
      end: new Date(2021, 1, 7),
    },
    totalPrice: 100,
    status: "pending",
  };
  const mockFormatDateTime = jest.fn((date) => date.toISOString());
  const mockAcceptBooking = jest.fn();
  const mockDeclineBooking = jest.fn();

  it("renders booking details correctly", () => {
    render(
      <ViewBookingHistory
        item={mockItem}
        formatDateTime={mockFormatDateTime}
        acceptBooking={mockAcceptBooking}
        declineBooking={mockDeclineBooking}
      />
    );

    expect(
      screen.getByText(`Name of booker: ${mockItem.owner}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Total price: ${mockItem.totalPrice}`)
    ).toBeInTheDocument();
  });

  it("renders Accept and Decline buttons for pending bookings", () => {
    render(
      <ViewBookingHistory
        item={mockItem}
        formatDateTime={mockFormatDateTime}
        acceptBooking={mockAcceptBooking}
        declineBooking={mockDeclineBooking}
      />
    );

    if (mockItem.status === "pending") {
      expect(screen.getByText("Accept")).toBeInTheDocument();
      expect(screen.getByText("Decline")).toBeInTheDocument();
    } else if (mockItem.status === "accepted") {
      expect(screen.getByText("Have Accepted")).toBeInTheDocument();
    } else if (mockItem.status === "declined") {
      expect(screen.getByText("Have Declined")).toBeInTheDocument();
    }
  });

  it("triggers acceptBooking callback when Accept button is clicked", () => {
    render(
      <ViewBookingHistory
        item={mockItem}
        formatDateTime={mockFormatDateTime}
        acceptBooking={mockAcceptBooking}
        declineBooking={mockDeclineBooking}
      />
    );

    fireEvent.click(screen.getByText("Accept"));
    expect(mockAcceptBooking).toHaveBeenCalledWith(mockItem.id);
  });

  it("triggers declineBooking callback when Decline button is clicked", () => {
    render(
      <ViewBookingHistory
        item={mockItem}
        formatDateTime={mockFormatDateTime}
        acceptBooking={mockAcceptBooking}
        declineBooking={mockDeclineBooking}
      />
    );

    fireEvent.click(screen.getByText("Decline"));
    expect(mockDeclineBooking).toHaveBeenCalledWith(mockItem.id);
  });
});
