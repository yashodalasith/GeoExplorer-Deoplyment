import { render, screen } from "@testing-library/react";
import PrivateRoute from "../../components/routing/PrivateRoute";
import { useAuth } from "../../context/AuthContext";
import { MemoryRouter, Routes, Route } from "react-router-dom";

vi.mock("../../context/AuthContext");

describe("PrivateRoute", () => {
  const TestComponent = () => <div>Protected Content</div>;

  it("redirects to login when not authenticated", () => {
    useAuth.mockReturnValue({ user: null, loading: false });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/protected" element={<TestComponent />} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders content when authenticated", () => {
    useAuth.mockReturnValue({ user: { id: 1 }, loading: false });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/protected" element={<TestComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("shows loading when checking auth", () => {
    useAuth.mockReturnValue({ user: null, loading: true });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/protected" element={<TestComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
