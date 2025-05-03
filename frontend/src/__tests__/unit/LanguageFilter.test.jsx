import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageFilter from "../../components/countries/LanguageFilter";
import { getAllLanguages } from "../../services/countriesService";

// Mock the service
vi.mock("../../services/countriesService", () => ({
  getAllLanguages: vi.fn(),
}));

describe("LanguageFilter", () => {
  const mockOnFilter = vi.fn();

  beforeEach(() => {
    getAllLanguages.mockResolvedValue([
      ["eng", "English"],
      ["spa", "Spanish"],
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", async () => {
    render(<LanguageFilter onFilter={mockOnFilter} selectedLanguage="" />);
    expect(screen.getByText("Loading languages...")).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByText("Loading languages...")
      ).not.toBeInTheDocument();
    });
  });

  it("renders language options after loading", async () => {
    render(<LanguageFilter onFilter={mockOnFilter} selectedLanguage="" />);

    await waitFor(() => {
      expect(screen.getByText("English (eng)")).toBeInTheDocument();
      expect(screen.getByText("Spanish (spa)")).toBeInTheDocument();
    });
  });

  it("calls onFilter with language code when selection changes", async () => {
    render(<LanguageFilter onFilter={mockOnFilter} selectedLanguage="" />);

    await waitFor(() => {
      const select = screen.getByRole("combobox");
      userEvent.selectOptions(select, "spa");
      expect(mockOnFilter).toHaveBeenCalledWith("spa");
    });
  });

  it("shows the selected language", async () => {
    render(<LanguageFilter onFilter={mockOnFilter} selectedLanguage="eng" />);

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toHaveValue("eng");
    });
  });
});
