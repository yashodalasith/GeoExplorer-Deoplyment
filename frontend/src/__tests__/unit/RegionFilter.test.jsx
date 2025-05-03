import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegionFilter from "../../components/countries/RegionFilter";

describe("RegionFilter", () => {
  const mockOnFilter = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders all region options", () => {
    render(<RegionFilter onFilter={mockOnFilter} selectedRegion="" />);

    expect(screen.getByText("Filter by Region")).toBeInTheDocument();
    expect(screen.getByText("Africa")).toBeInTheDocument();
    expect(screen.getByText("Americas")).toBeInTheDocument();
    expect(screen.getByText("Asia")).toBeInTheDocument();
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.getByText("Oceania")).toBeInTheDocument();
  });

  it("calls onFilter with region when selection changes", async () => {
    render(<RegionFilter onFilter={mockOnFilter} selectedRegion="" />);

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "Europe"); // Use the option's value
    expect(mockOnFilter).toHaveBeenCalledWith("Europe");
  });

  it("shows the selected region", () => {
    render(<RegionFilter onFilter={mockOnFilter} selectedRegion="Asia" />);
    expect(screen.getByRole("combobox")).toHaveValue("Asia");
  });
});
