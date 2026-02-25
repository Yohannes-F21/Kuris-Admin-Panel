import React, { useEffect, useState } from "react";
import { Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserLogin, UserForgetPassword } from "../../features/authActions";
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

        if (UserLogin.fulfilled.match(response)) {
          notify("Login Successful");
          setLoading(false);
          return navigate("/dashboard");
        }

        if (UserLogin.rejected.match(response)) {
          setLoading(false);
          const message =
            (response.payload as { message?: string } | undefined)?.message ||
            "Wrong credentials!";
          notify(message);
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

  const [open, setOpen] = useState(false);

  interface ForgetPasswordForm {
    email: string;
  }

  // State for form values and loading
  const [forgetPassword, setForgetPassword] = useState<ForgetPasswordForm>({
    email: "",
  });
  const [forgetLoading, setForgetLoading] = useState<boolean>(false);

  // Handle input changes
  const handleForgetPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForgetPassword((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password reset request
  const handleChangePassword = async () => {
    const { email } = forgetPassword;

    if (!email.trim()) {
      return notify("Please fill in all details");
    }

    setForgetLoading(true);
    try {
      const response = await dispatch(UserForgetPassword({ email }));

      if (UserForgetPassword.rejected.match(response)) {
        setForgetLoading(false);
        return notify(
          (response.payload as { message?: string } | undefined)?.message ||
            "User not found",
        );
      }

      // Reset form and close modal
      setForgetPassword({ email: "" });
      setOpen(false);
      setForgetLoading(false);
      notify("Please check your email for the reset password link!");
    } catch (error) {
      setForgetLoading(false);
      notify("An unexpected error occurred.");
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-40 -left-60 w-96 h-96 bg-primary-200/50 rounded-full blur-3xl opacity-50 z-0 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-3xl opacity-60 z-0"></div>

        <div className="w-full max-w-md p-8 space-y-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 relative z-10 transition-all duration-300 hover:shadow-2xl">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-extrabold text-primary-700 tracking-tight">
              Kuri<span className="text-gray-900">Admin</span>
            </h1>
            <h2 className="text-xl font-semibold text-gray-700">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm">
              Sign in to manage your content
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700 block ml-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-10 h-11 bg-gray-50/50 focus:bg-white transition-all shadow-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  name="email"
                  value={formValue.email}
                  onChange={handleChange}
                />
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700 block ml-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type="password"
                  placeholder=""
                  className="w-full pl-10 h-11 bg-gray-50/50 focus:bg-white transition-all shadow-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  name="password"
                  value={formValue.password}
                  onChange={handleChange}
                />
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-end">
              <span
                onClick={() => setOpen(true)}
                className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline cursor-pointer transition-colors"
              >
                Forgot password?
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center pt-2">
              <span className="text-sm text-gray-500">
                Don`t have an account?{" "}
              </span>
              <Link
                to="/register"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline transition-colors"
              >
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>

      {
        /* Forgot Password Dialog */
        open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm transition-opacity">
            {/* Modal Container */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all scale-100 border border-gray-100">
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Reset Password
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Enter your email address and we`ll send you a link to reset
                  your password.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChangePassword();
                }}
                className="space-y-6"
              >
                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="reset-email"
                    className="block text-sm font-medium text-gray-700 ml-1"
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      id="reset-email"
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      value={forgetPassword.email}
                      onChange={handleForgetPassword}
                      required
                      className="w-full pl-10 h-11 bg-gray-50/50 focus:bg-white transition-all shadow-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11 shadow-md hover:shadow-lg transition-all bg-primary-600 hover:bg-primary-700 text-white"
                  disabled={forgetLoading}
                >
                  {forgetLoading ? "Sending Link..." : "Send Reset Link"}
                </Button>

                {/* Footer */}
                <div className="mt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors px-4 py-2 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </>
  );
};
