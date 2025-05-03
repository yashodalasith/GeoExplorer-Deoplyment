import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../../pages/Home";
import { useAuth } from "../../context/AuthContext";

// Mock dependencies
vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-tsparticles", () => ({
  default: () => <div>Particles</div>,
}));

vi.mock("swiper/react", () => ({
  Swiper: ({ children }) => <div>{children}</div>,
  SwiperSlide: ({ children }) => <div>{children}</div>,
}));

vi.mock("swiper/modules", () => ({
  Autoplay: () => null,
  EffectFade: () => null,
  Parallax: () => null,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }) => <div>{children}</div>,
  },
}));

describe("Home Page", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the hero section", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Discover Our World")).toBeInTheDocument();
    expect(screen.getByText("Explore Countries")).toBeInTheDocument();
    expect(screen.getByText("Join Our Community")).toBeInTheDocument();
  });

  it("shows different buttons when user is logged in", () => {
    useAuth.mockReturnValue({
      user: { email: "test@example.com" },
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Explore Countries")).toBeInTheDocument();
    expect(screen.queryByText("Join Our Community")).not.toBeInTheDocument();
  });

  it("renders the featured destinations slider", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Journey Through Wonders")).toBeInTheDocument();
  });

  it("displays world stats", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Our Amazing Planet")).toBeInTheDocument();
    expect(screen.getByText("195")).toBeInTheDocument();
    expect(screen.getByText("Countries")).toBeInTheDocument();
  });

  it("shows features section", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Why Explore With Us")).toBeInTheDocument();
    expect(screen.getByText("Global Coverage")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
  });
});
