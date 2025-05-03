import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CountryCard from "../../components/countries/CountryCard";

const mockCountry = {
  cca3: "USA",
  name: { common: "United States" },
  flags: {
    svg: "https://flagcdn.com/us.svg",
    png: "https://flagcdn.com/w320/us.png",
  },
  population: 329484123,
  region: "Americas",
  capital: ["Washington, D.C."],
};

describe("CountryCard", () => {
  it("renders country details correctly", () => {
    render(
      <CountryCard
        country={mockCountry}
        onToggleFavorite={vi.fn()}
        onClick={vi.fn()}
        isFavorite={false}
        isLoggedIn={true}
      />
    );

    // Test country name
    expect(screen.getByText("United States")).toBeInTheDocument();

    // Test population (using more specific query)
    expect(screen.getByText(/329,484,123/)).toBeInTheDocument();

    // Test region (using more specific query)
    expect(screen.getByText(/Americas/)).toBeInTheDocument();

    // Test capital (using more specific query)
    expect(screen.getByText(/Washington, D.C./)).toBeInTheDocument();
  });

  it("calls onClick when card is clicked", () => {
    const onClick = vi.fn();
    render(
      <CountryCard
        country={mockCountry}
        onToggleFavorite={vi.fn()}
        onClick={onClick}
        isFavorite={false}
        isLoggedIn={true}
      />
    );

    fireEvent.click(screen.getByText(/United States/));
    expect(onClick).toHaveBeenCalledWith("USA");
  });

  it("calls onToggleFavorite when favorite button is clicked", () => {
    const onToggleFavorite = vi.fn();
    render(
      <CountryCard
        country={mockCountry}
        onToggleFavorite={onToggleFavorite}
        onClick={vi.fn()}
        isFavorite={false}
        isLoggedIn={true}
      />
    );

    fireEvent.click(screen.getByRole("button"));
    expect(onToggleFavorite).toHaveBeenCalledWith("USA");
  });

  it("shows correct heart icon based on favorite status", () => {
    const { rerender } = render(
      <CountryCard
        country={mockCountry}
        onToggleFavorite={vi.fn()}
        onClick={vi.fn()}
        isFavorite={true}
        isLoggedIn={true}
      />
    );
    expect(screen.getByRole("button").querySelector("svg")).toHaveClass(
      "text-red-500"
    );

    rerender(
      <CountryCard
        country={mockCountry}
        onToggleFavorite={vi.fn()}
        onClick={vi.fn()}
        isFavorite={false}
        isLoggedIn={true}
      />
    );
    expect(screen.getByRole("button").querySelector("svg")).toHaveClass(
      "text-gray-600"
    );
  });

  it("shows gray heart when not logged in", () => {
    render(
      <CountryCard
        country={mockCountry}
        onToggleFavorite={vi.fn()}
        onClick={vi.fn()}
        isFavorite={false}
        isLoggedIn={false}
      />
    );
    expect(screen.getByRole("button").querySelector("svg")).toHaveClass(
      "text-gray-400"
    );
  });
});
