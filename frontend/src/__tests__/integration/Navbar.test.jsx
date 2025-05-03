import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "../../components/layout/Navbar";
import { useAuth } from "../../context/AuthContext";
import { MemoryRouter } from "react-router-dom";

// Mock the AuthContext
vi.mock("../../context/AuthContext");

// Mock react-router-dom hooks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: vi.fn(() => ({ pathname: "/" })),
    useNavigate: vi.fn(() => vi.fn()),
  };
});

// Mock the toast
vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the icons
vi.mock("@heroicons/react/24/outline", () => ({
  Bars3Icon: () => <div>BarsIcon</div>,
  XMarkIcon: () => <div>XMarkIcon</div>,
  GlobeAltIcon: () => <div>GlobeIcon</div>,
}));

describe("Navbar", () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: null,
      logout: mockLogout,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders logo and navigation links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("GeoExplorer")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Countries")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it("shows user email and logout when logged in", () => {
    useAuth.mockReturnValue({
      user: { email: "test@example.com" },
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Check for the initial instead of full email
    expect(screen.getByText("T")).toBeInTheDocument(); // First letter of email
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  it("toggles mobile menu", async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const menuButton = screen.getByLabelText("Toggle menu");
    await userEvent.click(menuButton);
    expect(screen.getByText("XMarkIcon")).toBeInTheDocument();

    await userEvent.click(menuButton);
    expect(screen.getByText("BarsIcon")).toBeInTheDocument();
  });

  it("calls logout when logout button is clicked", async () => {
    useAuth.mockReturnValue({
      user: { email: "test@example.com" },
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByText("Logout"));
    expect(mockLogout).toHaveBeenCalled();
  });
});
