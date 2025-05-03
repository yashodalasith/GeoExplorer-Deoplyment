import { render, screen } from "@testing-library/react";
import CountryMap from "../../components/countries/CountryMap";

// Mock the react-leaflet components
vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => <div>TileLayer</div>,
  Marker: ({ position, children }) => (
    <div>
      Marker at {position.join(",")}
      {children}
    </div>
  ),
  Popup: ({ children }) => <div>Popup: {children}</div>,
}));

describe("CountryMap", () => {
  it("renders nothing when latlng is invalid", () => {
    const { container } = render(
      <CountryMap latlng={null} countryName="Test" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the map with marker when valid latlng is provided", () => {
    const testLatLng = [51.505, -0.09];
    render(<CountryMap latlng={testLatLng} countryName="Test Country" />);

    // Check for all expected elements
    expect(screen.getByText("TileLayer")).toBeInTheDocument();
    expect(
      screen.getByText(`Marker at ${testLatLng.join(",")}`)
    ).toBeInTheDocument();
    expect(screen.getByText("Popup: Test Country")).toBeInTheDocument();
  });

  it("renders nothing when latlng array doesn't have exactly 2 elements", () => {
    const { container } = render(
      <CountryMap latlng={[51.505]} countryName="Test" />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
