import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Profile from "../../pages/Profile";
import { getCountriesByCodes } from "../../services/countriesService";

// Mock dependencies
vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../services/countriesService", () => ({
  getCountriesByCodes: vi.fn(),
}));

vi.mock("react-hot-toast");
vi.mock("../../components/countries/CountryCard", () => ({
  __esModule: true,
  default: () => <div>CountryCard</div>,
}));

describe("Profile Page", () => {
  const mockUser = {
    email: "test@example.com",
    username: "testuser",
    firstName: "Test",
    lastName: "User",
    dateOfBirth: "2000-01-01",
    countryOfResidence: "United States",
    nationality: "American",
    favoriteCountries: ["USA", "CAN"],
    gender: "male",
  };

  const mockCountries = [
    { cca3: "USA", name: { common: "United States" } },
    { cca3: "CAN", name: { common: "Canada" } },
  ];

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: mockUser,
      logout: vi.fn(),
    });
    getCountriesByCodes.mockResolvedValue(mockCountries);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders profile header with user info", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockUser.username)).toBeInTheDocument();
      expect(
        screen.getByText(`${mockUser.firstName} ${mockUser.lastName}`)
      ).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
      expect(screen.getByText("January 1, 2000")).toBeInTheDocument();
    });
  });

  it("shows loading state for favorite countries", async () => {
    getCountriesByCodes.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("displays favorite countries when loaded", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText("CountryCard").length).toBe(2);
    });
  });

  it("shows empty state when no favorites", async () => {
    useAuth.mockReturnValue({
      user: { ...mockUser, favoriteCountries: [] },
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No favorite countries yet")).toBeInTheDocument();
    });
  });

  it("handles logout", async () => {
    const mockLogout = vi.fn();
    useAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText("Logout");
    await userEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });
});
