import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ReviewForm from "./ReviewForm";
import { Rating } from "@mui/material";

describe("ReviewForm", () => {
  it("does not render if hasVisited is false", () => {
    render(
      <ReviewForm
        hasVisited={false}
        review={""}
        rating={0}
        setReview={() => {}}
        setRating={() => {}}
        handleReview={() => {}}
      />
    );
    expect(
      screen.queryByText("Please leave a review for this property!")
    ).not.toBeInTheDocument();
  });

  it("renders correctly when hasVisited is true", () => {
    render(
      <ReviewForm
        hasVisited={true}
        review={""}
        rating={0}
        setReview={() => {}}
        setRating={() => {}}
        handleReview={() => {}}
      />
    );
    expect(
      screen.getByText(
        "⬇️ You have booked this property before! Please leave a review for this property!"
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Review")).toBeInTheDocument();
    expect(screen.getByTestId("rating")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("allows user to input review and rating", () => {
    const setReview = jest.fn();
    const setRating = jest.fn();
    render(
      <ReviewForm
        hasVisited={true}
        review={""}
        rating={0}
        setReview={setReview}
        setRating={setRating}
        handleReview={() => {}}
      />
    );

    fireEvent.change(screen.getByLabelText("Review"), {
      target: { value: "Great place!" },
    });
    expect(setReview).toHaveBeenCalledWith("Great place!");

    fireEvent.click(screen.getByLabelText("2 Stars"));
    expect(setRating).toHaveBeenCalledWith(2);
  });

  it("calls handleReview on submit button click", () => {
    const handleReview = jest.fn();
    render(
      <ReviewForm
        hasVisited={true}
        review={"Great place!"}
        rating={3}
        setReview={() => {}}
        setRating={() => {}}
        handleReview={handleReview}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(handleReview).toHaveBeenCalled();
  });
});
