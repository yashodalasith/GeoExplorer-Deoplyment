import { renderHook, waitFor } from "@testing-library/react";
import { useCountries } from "../../hooks/useCountries";
import { getAllCountries } from "../../services/countriesService";

// Properly mock the countriesService module
vi.mock("../../services/countriesService", () => ({
  getAllCountries: vi.fn(),
}));

describe("useCountries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch countries and handle loading state", async () => {
    const mockCountries = [{ cca3: "USA", name: { common: "United States" } }];
    getAllCountries.mockResolvedValue(mockCountries);

    const { result } = renderHook(() => useCountries());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.countries).toEqual(mockCountries);
      expect(result.current.error).toBe(null);
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Failed to fetch countries";
    getAllCountries.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.countries).toEqual([]);
      expect(result.current.error).toBe(errorMessage);
    });
  });
});
