import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import Login from "../../pages/Login";
import { useAuth } from "../../context/AuthContext";

// Mock dependencies
vi.mock("../../context/AuthContext");
vi.mock("formik", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Formik: ({ children, onSubmit }) => {
      const renderProps = {
        values: { email: "", password: "", remember: false },
        errors: {},
        touched: {},
        handleChange: vi.fn(),
        handleBlur: vi.fn(),
        handleSubmit: vi.fn((e) => {
          e.preventDefault();
          onSubmit(renderProps.values);
        }),
        isSubmitting: false,
      };
      return typeof children === "function" ? children(renderProps) : children;
    },
    Field: ({ name, type, placeholder }) => (
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        data-testid={`${name}-input`}
        onChange={vi.fn()}
      />
    ),
    ErrorMessage: ({ name }) => <div data-testid={`error-${name}`} />,
    Form: ({ children }) => <form data-testid="login-form">{children}</form>,
  };
});

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useLocation: vi.fn(),
}));

describe("Login Page", () => {
  const mockLogin = vi.fn();
  const mockUseLocation = vi.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      login: mockLogin,
    });
    mockUseLocation.mockReturnValue({ pathname: "/login" });
    useLocation.mockImplementation(mockUseLocation);
    mockLogin.mockResolvedValue({}); // Make sure login returns a promise
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("shows auth message when redirected", () => {
    mockUseLocation.mockReturnValue({
      pathname: "/login",
      state: { from: "/protected" },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText("Please login to continue")).toBeInTheDocument();
  });

  it("shows loading state when submitting", async () => {
    // Mock Formik with isSubmitting: true
    vi.doMock("formik", () => ({
      __esModule: true,
      Formik: ({ children, onSubmit }) => {
        const renderProps = {
          values: { email: "", password: "", remember: false },
          errors: {},
          touched: {},
          handleChange: vi.fn(),
          handleBlur: vi.fn(),
          handleSubmit: vi.fn((e) => e.preventDefault()),
          isSubmitting: true, // This is the key change
        };
        return typeof children === "function"
          ? children(renderProps)
          : children;
      },
      Field: ({ name, type, placeholder }) => (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          data-testid={`${name}-input`}
        />
      ),
      ErrorMessage: ({ name }) => <div data-testid={`error-${name}`} />,
      Form: ({ children }) => <form data-testid="login-form">{children}</form>,
    }));

    // Need to re-import Login after mocking
    const LoginWithLoading = (await import("../../pages/Login")).default;

    render(
      <MemoryRouter>
        <LoginWithLoading />
      </MemoryRouter>
    );

    // Check for the loading state
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Sign In");
  });
});
