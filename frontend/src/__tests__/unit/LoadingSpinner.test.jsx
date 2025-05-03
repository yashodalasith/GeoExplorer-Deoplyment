import { render } from "@testing-library/react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders a spinning animation", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector("div");
    expect(spinner).toHaveClass("animate-spin");
    expect(spinner).toHaveClass("border-t-2");
    expect(spinner).toHaveClass("border-b-2");
  });
});
