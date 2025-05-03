import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import countries from "../data/countries";
import WorldMapBackground from "../assets/world-map-texture.png";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    countryOfResidence: "",
    nationality: "",
    dateOfBirth: null,
    gender: "prefer-not-to-say",
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Must be at least 3 characters")
      .max(20, "Must be 20 characters or less")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(8, "Must be at least 8 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    countryOfResidence: Yup.string().required("Required"),
    nationality: Yup.string().required("Required"),
    dateOfBirth: Yup.date()
      .max(new Date(), "Cannot be in the future")
      .test("age", "Must be at least 13 years", (value) => {
        if (!value) return true;
        return new Date().getFullYear() - value.getFullYear() >= 13;
      }),
  });

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await register({
        ...values,
        dateOfBirth: values.dateOfBirth?.toISOString().split("T")[0],
      });
      navigate("/profile");
      toast.success("Registration successful!");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${WorldMapBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "800px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2
            style={{
              marginTop: "0",
              fontSize: "2.25rem",
              fontWeight: "800",
              color: "#1a202c",
              background: "linear-gradient(to right, #4f46e5, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            Join GeoExplorer
          </h2>
          <p style={{ marginTop: "0.5rem", color: "#4a5568" }}>
            Create your account to explore the world's countries
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form
              style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "0.5rem",
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#4a5568",
                      marginBottom: "0.25rem",
                    }}
                  >
                    First Name
                  </label>
                  <Field
                    name="firstName"
                    type="text"
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.375rem",
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      outline: "none",
                      transition: "all 0.2s",
                      fontSize: "0.875rem",
                    }}
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    style={{
                      marginTop: "0.25rem",
                      fontSize: "0.75rem",
                      color: "#e53e3e",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#4a5568",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Last Name
                  </label>
                  <Field
                    name="lastName"
                    type="text"
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.375rem",
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      outline: "none",
                      transition: "all 0.2s",
                      fontSize: "0.875rem",
                    }}
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    style={{
                      marginTop: "0.25rem",
                      fontSize: "0.75rem",
                      color: "#e53e3e",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#4a5568",
                    marginBottom: "0.25rem",
                  }}
                >
                  Username
                </label>
                <Field
                  name="username"
                  type="text"
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.375rem",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    outline: "none",
                    transition: "all 0.2s",
                    fontSize: "0.875rem",
                  }}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  style={{
                    marginTop: "0.25rem",
                    fontSize: "0.75rem",
                    color: "#e53e3e",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#4a5568",
                    marginBottom: "0.25rem",
                  }}
                >
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.375rem",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    outline: "none",
                    transition: "all 0.2s",
                    fontSize: "0.875rem",
                  }}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  style={{
                    marginTop: "0.25rem",
                    fontSize: "0.75rem",
                    color: "#e53e3e",
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#4a5568",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.375rem",
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      outline: "none",
                      transition: "all 0.2s",
                      fontSize: "0.875rem",
                    }}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    style={{
                      marginTop: "0.25rem",
                      fontSize: "0.75rem",
                      color: "#e53e3e",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#4a5568",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Confirm Password
                  </label>
                  <Field
                    name="confirmPassword"
                    type="password"
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.375rem",
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      outline: "none",
                      transition: "all 0.2s",
                      fontSize: "0.875rem",
                    }}
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    style={{
                      marginTop: "0.25rem",
                      fontSize: "0.75rem",
                      color: "#e53e3e",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#4a5568",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Country of Residence
                  </label>
                  <div style={{ position: "relative" }}>
                    <Field
                      as="select"
                      name="countryOfResidence"
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid #e2e8f0",
                        borderRadius: "0.375rem",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        outline: "none",
                        transition: "all 0.2s",
                        fontSize: "0.875rem",
                        appearance: "none",
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                        backgroundPosition: "right 0.5rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1.5em 1.5em",
                        paddingRight: "2.5rem",
                      }}
                    >
                      <option value="">Select country</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="countryOfResidence"
                    component="div"
                    style={{
                      marginTop: "0.25rem",
                      fontSize: "0.75rem",
                      color: "#e53e3e",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#4a5568",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Nationality
                  </label>
                  <div style={{ position: "relative" }}>
                    <Field
                      as="select"
                      name="nationality"
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid #e2e8f0",
                        borderRadius: "0.375rem",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        outline: "none",
                        transition: "all 0.2s",
                        fontSize: "0.875rem",
                        appearance: "none",
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                        backgroundPosition: "right 0.5rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1.5em 1.5em",
                        paddingRight: "2.5rem",
                      }}
                    >
                      <option value="">Select nationality</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="nationality"
                    component="div"
                    style={{
                      marginTop: "0.25rem",
                      fontSize: "0.75rem",
                      color: "#e53e3e",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#4a5568",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Date of Birth
                  </label>
                  <DatePicker
                    selected={values.dateOfBirth}
                    onChange={(date) => setFieldValue("dateOfBirth", date)}
                    placeholderText="Select date"
                    showYearDropdown
                    dropdownMode="select"
                    maxDate={new Date()}
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.375rem",
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      outline: "none",
                      fontSize: "0.875rem",
                    }}
                  />
                  <ErrorMessage
                    name="dateOfBirth"
                    component="div"
                    style={{
                      marginTop: "0.25rem",
                      fontSize: "0.75rem",
                      color: "#e53e3e",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#4a5568",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Gender
                  </label>
                  <div style={{ position: "relative" }}>
                    <Field
                      as="select"
                      name="gender"
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid #e2e8f0",
                        borderRadius: "0.375rem",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        outline: "none",
                        transition: "all 0.2s",
                        fontSize: "0.875rem",
                        appearance: "none",
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                        backgroundPosition: "right 0.5rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1.5em 1.5em",
                        paddingRight: "2.5rem",
                      }}
                    >
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Field>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  border: "none",
                  borderRadius: "0.375rem",
                  boxShadow:
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "white",
                  background: "linear-gradient(to right, #4f46e5, #06b6d4)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  opacity: isSubmitting ? "0.7" : "1",
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      style={{
                        animation: "spin 1s linear infinite",
                        marginRight: "0.5rem",
                        height: "1rem",
                        width: "1rem",
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        style={{ opacity: "0.25" }}
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        style={{ opacity: "0.75" }}
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.875rem", color: "#4a5568" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                fontWeight: "600",
                color: "#4f46e5",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
