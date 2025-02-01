import React, { useEffect, useState } from "react";
import { Lock, Mail } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "../../features/authActions";
import { useAppDispatch } from "../../features/hooks"; // Import the custom hook

// Define types for form values
interface FormValues {
  email: string;
  password: string;
}

// Notification function
const notify = (text: string) => toast(text);

export const LoginPage: React.FC = () => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch(); // Use the custom hook here

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const [loading, setLoading] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<FormValues>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (formValue.email.trim() !== "" && formValue.password.trim() !== "") {
      try {
        const response = await dispatch(UserLogin(formValue));
        const payload = response.payload as { message?: string }; // Type assertion for payload

        if (response.meta.requestStatus === "fulfilled") {
          notify("Login Successful");
          setLoading(false);
          return navigate(`/verify-otp?email=${formValue.email}`);
        }

        if (response.meta.requestStatus === "rejected") {
          setLoading(false);
          notify("Wrong credentials!");
        }

        if (payload.message === "Error") {
          setLoading(false);
          notify("Something went wrong, please try again.");
        }
      } catch (error) {
        setLoading(false);
        notify("An unexpected error occurred.");
      }
    } else {
      setLoading(false);
      notify("Please fill in all fields.");
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-gray-500">Sign in to your admin account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-9"
                  name="email"
                  value={formValue.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-9"
                  name="password"
                  value={formValue.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </div>

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </>
  );
};
