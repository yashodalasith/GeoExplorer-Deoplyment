import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router-dom";
import Countries from "../../pages/Countries";
import { useAuth } from "../../context/AuthContext";
import { useCountries } from "../../hooks/useCountries";
import {
  searchCountries,
  getCountriesByRegion,
  getCountriesByLanguage,
} from "../../services/countriesService";
import { toast } from "react-hot-toast";

// Mock dependencies
vi.mock("../../context/AuthContext");
vi.mock("../../hooks/useCountries");
vi.mock("../../hooks/useDebounce", () => ({
  useDebounce: (value) => value, // Remove debounce for testing
}));
vi.mock("../../services/countriesService");
vi.mock("react-hot-toast");
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: vi.fn(),
  useLocation: () => ({
    pathname: "/",
  }),
}));

// Mock child components
vi.mock("../../components/countries/CountryCard", () => ({
  __esModule: true,
  default: ({ country, onClick, onToggleFavorite }) => (
    <div
      onClick={() => onClick(country.cca3)}
      data-testid={`country-${country.cca3}`}
    >
      {country.name.common}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(country.cca3);
        }}
        aria-label={`Save ${country.name.common} to favorites`}
      >
        Favorite
      </button>
    </div>
  ),
}));

vi.mock("../../components/countries/SearchBar", () => ({
  __esModule: true,
  default: ({ onSearch }) => (
    <input
      type="text"
      placeholder="Search by name, capital, or region..."
      onChange={(e) => onSearch(e.target.value)}
      data-testid="search-input"
    />
  ),
}));

vi.mock("../../components/countries/RegionFilter", () => ({
  __esModule: true,
  default: ({ onFilter }) => (
    <select
      onChange={(e) => onFilter(e.target.value)}
      data-testid="region-filter"
    >
      <option value="">Filter by Region</option>
      <option value="Americas">Americas</option>
    </select>
  ),
}));

vi.mock("../../components/countries/LanguageFilter", () => ({
  __esModule: true,
  default: () => <div>LanguageFilter</div>,
}));

vi.mock("../../components/ui/LoadingSpinner", () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <div>{children}</div>,
}));

// Mock country data
const mockCountries = [
  {
    cca3: "USA",
    name: { common: "United States", official: "United States of America" },
    flags: { png: "us-flag.png", svg: "us-flag.svg" },
    population: 331000000,
    region: "Americas",
    subregion: "North America",
    capital: ["Washington D.C."],
    languages: { eng: "English" },
    latlng: [38, -97],
  },
  {
    cca3: "CAN",
    name: { common: "Canada", official: "Canada" },
    flags: { png: "ca-flag.png", svg: "ca-flag.svg" },
    population: 38000000,
    region: "Americas",
    subregion: "North America",
    capital: ["Ottawa"],
    languages: { eng: "English", fra: "French" },
    latlng: [60, -95],
  },
];

describe("Countries Component", () => {
  const mockToggleFavorite = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { favoriteCountries: [] },
      toggleFavorite: mockToggleFavorite,
    });
    useCountries.mockReturnValue({
      countries: mockCountries,
      loading: false,
    });
    useNavigate.mockReturnValue(mockNavigate);
    searchCountries.mockImplementation((term) =>
      Promise.resolve(
        mockCountries.filter((c) =>
          c.name.common.toLowerCase().includes(term.toLowerCase())
        )
      )
    );
    getCountriesByRegion.mockResolvedValue(mockCountries);
    getCountriesByLanguage.mockResolvedValue(mockCountries);
    toast.success.mockImplementation(() => {});
    toast.error.mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    useCountries.mockReturnValueOnce({
      countries: [],
      loading: true,
    });

    render(
      <MemoryRouter>
        <Countries />
      </MemoryRouter>
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders country cards when loaded", async () => {
    render(
      <MemoryRouter>
        <Countries />
      </MemoryRouter>
    );

    expect(await screen.findByText("United States")).toBeInTheDocument();
    expect(screen.getByText("Canada")).toBeInTheDocument();
  });

  it("filters countries by search term", async () => {
    render(
      <MemoryRouter>
        <Countries />
      </MemoryRouter>
    );

    const searchInput = screen.getByTestId("search-input");
    await userEvent.type(searchInput, "United");

    await waitFor(() => {
      expect(searchCountries).toHaveBeenCalledWith("United");
      expect(screen.getByText("Search: United")).toBeInTheDocument();
    });
  });

  it("toggles favorite status when favorite button is clicked", async () => {
    render(
      <MemoryRouter>
        <Countries />
      </MemoryRouter>
    );

    const favoriteButton = await screen.findByLabelText(
      "Save United States to favorites"
    );
    await userEvent.click(favoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalledWith("USA");
  });

  it("navigates to country detail when card is clicked", async () => {
    render(
      <MemoryRouter>
        <Countries />
      </MemoryRouter>
    );

    const countryCard = await screen.findByTestId("country-USA");
    await userEvent.click(countryCard);

    expect(mockNavigate).toHaveBeenCalledWith("/countries/USA");
  });

  it("shows empty state when no countries match filters", async () => {
    searchCountries.mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <Countries />
      </MemoryRouter>
    );

    const searchInput = screen.getByTestId("search-input");
    await userEvent.type(searchInput, "Nonexistent");

    expect(await screen.findByText("No countries found")).toBeInTheDocument();
    expect(screen.getByText("Search: Nonexistent")).toBeInTheDocument();
  });

  it("filters countries by region", async () => {
    render(
      <MemoryRouter>
        <Countries />
      </MemoryRouter>
    );

    const regionFilter = screen.getByTestId("region-filter");
    await userEvent.selectOptions(regionFilter, "Americas");

    await waitFor(() => {
      expect(getCountriesByRegion).toHaveBeenCalledWith("Americas");
      expect(screen.getByText("Region: Americas")).toBeInTheDocument();
    });
  });
});
