import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../../components/countries/SearchBar";

// Mock the MagnifyingGlassIcon to add a test ID
vi.mock("@heroicons/react/24/outline", () => ({
  MagnifyingGlassIcon: () => <svg data-testid="magnifying-glass-icon"></svg>,
}));

describe("SearchBar", () => {
  const mockOnSearch = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the search input with icon", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(
      screen.getByPlaceholderText("Search for a country...")
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByTestId("magnifying-glass-icon")).toBeInTheDocument();
  });

  it("calls onSearch with input value when typing", async () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Germany");

    expect(mockOnSearch).toHaveBeenCalledTimes(7); // Called for each keystroke
    expect(mockOnSearch).toHaveBeenLastCalledWith("Germany");
  });

  it("updates the input value", async () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "France");

    expect(input).toHaveValue("France");
  });
});
