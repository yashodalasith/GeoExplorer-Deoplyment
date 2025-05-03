import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MemoryRouter } from "react-router-dom";

vi.mock("axios");
vi.mock("react-hot-toast");
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => vi.fn(),
}));

describe("AuthContext", () => {
  const wrapper = ({ children }) => (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides initial auth state", async () => {
    axios.get.mockResolvedValueOnce({ data: { data: null } });

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);

    // Wait for useEffect to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it("handles successful registration", async () => {
    const mockUser = { id: 1, email: "test@example.com" };
    axios.post.mockResolvedValueOnce({ data: { data: mockUser } });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register({
        email: "test@example.com",
        password: "password",
      });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(toast.success).toHaveBeenCalledWith("Registration successful!");
  });

  it("handles registration error", async () => {
    const error = { response: { data: { error: "Email already exists" } } };
    axios.post.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await expect(
        result.current.register({
          email: "test@example.com",
          password: "password",
        })
      ).rejects.toEqual(error);
    });

    expect(result.current.user).toBe(null);
    expect(toast.error).toHaveBeenCalledWith("Email already exists");
  });

  it("handles successful login", async () => {
    const mockUser = { id: 1, email: "test@example.com" };
    axios.post.mockResolvedValueOnce({ data: { data: mockUser } });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        email: "test@example.com",
        password: "password",
      });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(toast.success).toHaveBeenCalledWith("Login successful!");
  });

  it("handles successful logout", async () => {
    axios.get.mockResolvedValueOnce({});

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Set a user first
    await act(() => {
      result.current.user = { id: 1, email: "test@example.com" };
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBe(null);
    expect(toast.success).toHaveBeenCalledWith("Logged out successfully");
  });

  it("toggles favorite countries", async () => {
    const mockUser = { id: 1, favoriteCountries: [] };
    const updatedFavorites = ["US"];
    axios.put.mockResolvedValueOnce({ data: { data: updatedFavorites } });

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Set initial user
    await act(() => {
      result.current.user = mockUser;
    });

    await act(async () => {
      const favorites = await result.current.toggleFavorite("US");
      expect(favorites).toEqual(updatedFavorites);
    });

    expect(result.current.user.favoriteCountries).toEqual(updatedFavorites);
  });
});
