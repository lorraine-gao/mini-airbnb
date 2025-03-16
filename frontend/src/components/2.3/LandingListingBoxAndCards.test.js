import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LandingListingBoxAndCards from "./LandingListingBoxAndCards";

describe("LandingListingBoxAndCards", () => {
  const mockListings = [
    {
      id: 1,
      title: "Listing 1",
      owner: "Owner 1",
      price: 100,
      reviews: [{ score: 5 }],
      address: "Address 1",
      metadata: { numberOfBedrooms: 2 },
    },
  ];

  it("renders listings information correctly(including accessiblity)", () => {
    render(
      <BrowserRouter>
        <LandingListingBoxAndCards filteredListings={mockListings} />
      </BrowserRouter>
    );

    mockListings.forEach((listing) => {
      expect(screen.getByAltText(listing.title)).toBeInTheDocument();
      expect(screen.getByText(listing.title)).toBeInTheDocument();
      expect(screen.getByText(`Owner: ${listing.owner}`)).toBeInTheDocument();
      expect(screen.getByText(`Price: $${listing.price}`)).toBeInTheDocument();
      // 这里再加一个review的逻辑
      const reviewText =
        listing.reviews.length > 0
          ? `AVG: ${
              listing.reviews.reduce(
                (total, review) => total + review.score,
                0
              ) / listing.reviews.length
            }⭐️`
          : "AVG: No reviews yet";
      expect(screen.getByText(reviewText)).toBeInTheDocument();
      expect(
        screen.getByText(`Address: ${listing.address}`)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Reviews: ${listing.reviews.length}`)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Bedrooms: ${listing.metadata.numberOfBedrooms}`)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "View Details" })
      ).toBeInTheDocument();
    });
  });

  it("has correct links for viewing details", () => {
    const nights = 3;
    render(
      <BrowserRouter>
        <LandingListingBoxAndCards filteredListings={mockListings} nights={3} />
      </BrowserRouter>
    );

    mockListings.forEach((listing) => {
      const detailLink = screen.getByRole("link", { name: "View Details" });
      expect(detailLink.getAttribute("href")).toBe(
        `/listing/${listing.id}/${nights}`
      );
    });
  });
});
