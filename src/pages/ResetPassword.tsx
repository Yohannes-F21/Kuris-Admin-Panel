import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useDispatch } from "react-redux";
import { UserResetPassword } from "../features/authActions";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button"; // Import shadcn/ui Button
// import { AppDispatch } from "../features/store"; // Import AppDispatch for typed dispatch
import { useAppDispatch } from "../features/hooks"; // Custom hook for typed dispatch

// Define types for form values
interface FormValues {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}

// Custom hook to parse query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Notification function
const notify = (text: string) => toast(text);

const ResetPassword: React.FC = () => {
  const dispatch = useAppDispatch(); // Use the custom hook for typed dispatch
  const navigate = useNavigate();
  const query = useQuery();

  // State for form values and loading
  const [formValue, setFormValue] = useState<FormValues>({
    email: query.get("email") || "",
    token: query.get("token") || "",
    password: "",
    confirmPassword: "",
  });
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  // Regular expression for strong password validation
  const regEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,}$/;

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));

    // Revalidate fields
    if (name === "password") {
      validatePassword(value);
    }
    if (name === "confirmPassword") {
      validateConfirmPassword(value);
    }
  };

  // Validate password strength
  const validatePassword = (password: string) => {
    if (!regEx.test(password)) {
      setIsDisabled(true);
      return "Password must be 8+ characters long & contain at least a special character, a number, an uppercase, and a lowercase character!";
    }
    setIsDisabled(false);
    return "";
  };

  // Validate confirm password field
  const validateConfirmPassword = (confirmPassword: string) => {
    if (formValue.password !== confirmPassword) {
      setIsDisabled(true);
      return "The two passwords that you entered do not match!";
    }
    setIsDisabled(false);
    return "";
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passwordError = validatePassword(formValue.password);
    const confirmPasswordError = validateConfirmPassword(
      formValue.confirmPassword
    );

    if (passwordError || confirmPasswordError) {
      notify(passwordError || confirmPasswordError);
      return;
    }

    setLoading(true);

    try {
      const response = await dispatch(UserResetPassword(formValue));
      // const payload = response.payload as { message?: string }; // Type assertion for payload

      if (response.meta.requestStatus === "fulfilled") {
        notify("Reset Successful");
        setLoading(false);
        return navigate("/dashboard");
      }

      if (response.meta.requestStatus === "rejected") {
        console.log(response.payload.message);

        setLoading(false);
        notify("There's something wrong");
      }
    } catch (error) {
      setLoading(false);
      notify("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Reset your Password</h1>
        </div>
        <form className=" space-y-4" onSubmit={handleSubmit}>
          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Enter your new password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your new password"
              value={formValue.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm your Password:
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formValue.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 px-12 py-3 rounded-3xl"
              disabled={isDisabled || loading}
            >
              {loading ? "Loading..." : "Reset Password"}
            </Button>
          </div>
        </form>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
