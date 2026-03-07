import React, { useState } from "react";
import { Lock, Mail, User } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../../features/hooks";
import { UserRegister } from "../../features/authActions";
import { notifyError, notifySuccess } from "../../lib/toast";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formValue.name.trim() ||
      !formValue.email.trim() ||
      !formValue.password.trim()
    ) {
      return notifyError(null, "Please fill in all fields.");
    }

    setLoading(true);
    try {
      const response = await dispatch(UserRegister(formValue));

      if (UserRegister.fulfilled.match(response)) {
        notifySuccess(
          response.payload,
          "Registration successful. Please verify your email.",
        );
        setLoading(false);
        return navigate("/login");
      }

      setLoading(false);
      notifyError(response.payload, "Registration failed. Please try again.");
    } catch {
      setLoading(false);
      notifyError(null, "An unexpected error occurred.");
    }
  };

  return (
    <>
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gray-50 px-4 py-10">
        <div className="absolute -top-40 -left-60 h-96 w-96 animate-pulse rounded-full bg-primary-200/50 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-primary-100/40 blur-3xl opacity-60"></div>
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary-50 to-transparent"></div>

        <div className="relative z-10 w-full max-w-md space-y-8 rounded-3xl border border-white/60 bg-white/85 p-8 shadow-xl shadow-primary-900/5 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100">
              <User className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary-700">
              Kuri<span className="text-gray-900">Admin</span>
            </h1>
            <h2 className="text-xl font-semibold text-gray-700">
              Create Account
            </h2>
            <p className="text-sm text-gray-500">
              Register and verify your email to sign in
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                className="ml-1 text-sm font-medium text-gray-700"
                htmlFor="name"
              >
                Name
              </label>
              <div className="relative group">
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="h-11 bg-gray-50/60 pl-10 shadow-sm"
                  name="name"
                  value={formValue.name}
                  onChange={handleChange}
                />
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="ml-1 text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative group">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-11 bg-gray-50/60 pl-10 shadow-sm"
                  name="email"
                  value={formValue.email}
                  onChange={handleChange}
                />
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="ml-1 text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative group">
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  className="h-11 bg-gray-50/60 pl-10 shadow-sm"
                  name="password"
                  value={formValue.password}
                  onChange={handleChange}
                />
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              disabled={loading}
              size="lg"
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>

            <div className="border-t border-gray-100 pt-5 text-center">
              <span className="text-sm text-gray-500">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline transition-colors"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
