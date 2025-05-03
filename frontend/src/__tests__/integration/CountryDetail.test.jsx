import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useParams, useNavigate } from "react-router-dom";
import CountryDetail from "../../pages/CountryDetail";
import { useAuth } from "../../context/AuthContext";
import {
  getCountryByCode,
  getCountriesByCodes,
} from "../../services/countriesService";
import { toast } from "react-hot-toast";

// Mock dependencies
vi.mock("../../context/AuthContext");
vi.mock("../../services/countriesService");
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));
vi.mock("react-hot-toast");
vi.mock("../components/countries/CountryMap", () => ({
  __esModule: true,
  default: () => <div>CountryMap</div>,
}));

describe("CountryDetail Page", () => {
  const mockCountry = {
    cca3: "USA",
    name: {
      common: "United States",
      official: "United States of America",
    },
    flags: {
      png: "flag.png",
      svg: "flag.svg",
    },
    population: 331000000,
    region: "Americas",
    subregion: "North America",
    capital: ["Washington D.C."],
    currencies: {
      USD: {
        name: "United States dollar",
        symbol: "$",
      },
    },
    languages: {
      eng: "English",
    },
    borders: ["CAN", "MEX"],
    latlng: [38, -97],
    timezones: ["UTC-12:00"],
    car: {
      side: "right",
    },
  };

  const mockBorderCountries = [
    { cca3: "CAN", name: { common: "Canada" }, flags: { png: "canada.png" } },
    { cca3: "MEX", name: { common: "Mexico" }, flags: { png: "mexico.png" } },
  ];

  const mockNavigate = vi.fn();
  const mockToggleFavorite = vi.fn();

  beforeEach(() => {
    useParams.mockReturnValue({ code: "USA" });
    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({
      user: { favoriteCountries: [] },
      toggleFavorite: mockToggleFavorite,
    });
    getCountryByCode.mockResolvedValue(mockCountry);
    getCountriesByCodes.mockResolvedValue(mockBorderCountries);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    getCountryByCode.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <CountryDetail />
      </MemoryRouter>
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders country details when loaded", async () => {
    render(
      <MemoryRouter>
        <CountryDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("United States")).toBeInTheDocument();
      expect(screen.getByText("United States of America")).toBeInTheDocument();
      expect(screen.getByText("331,000,000")).toBeInTheDocument();
      expect(screen.getByText("Americas")).toBeInTheDocument();
      expect(screen.getByText("Washington D.C.")).toBeInTheDocument();
      expect(screen.getByText("English")).toBeInTheDocument();
    });
  });

  it("shows border countries", async () => {
    render(
      <MemoryRouter>
        <CountryDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Canada")).toBeInTheDocument();
      expect(screen.getByText("Mexico")).toBeInTheDocument();
    });
  });

  it("handles favorite toggle for authenticated user", async () => {
    render(
      <MemoryRouter>
        <CountryDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      const favoriteButton = screen.getByText("Save to Favorites");
      userEvent.click(favoriteButton);
      expect(mockToggleFavorite).toHaveBeenCalledWith("USA");
    });
  });

  it("shows error toast when country fetch fails", async () => {
    getCountryByCode.mockRejectedValue(new Error("Failed to fetch"));

    render(
      <MemoryRouter>
        <CountryDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to fetch country details"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/countries", {
        replace: true,
      });
    });
  });
});
