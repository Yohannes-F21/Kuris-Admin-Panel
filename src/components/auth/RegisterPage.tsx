import React, { useState } from "react";
import { Lock, Mail, User } from "lucide-react";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../../features/hooks";
import { UserRegister } from "../../features/authActions";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const notify = (text: string) => toast(text);

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
      return notify("Please fill in all fields.");
    }

    setLoading(true);
    try {
      const response = await dispatch(UserRegister(formValue));

      if (response.meta.requestStatus === "fulfilled") {
        notify("Registration successful. Please verify your email.");
        setLoading(false);
        return navigate("/login");
      }

      setLoading(false);
      notify("Registration failed. Please try again.");
    } catch {
      setLoading(false);
      notify("An unexpected error occurred.");
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-gray-500">
              Register and verify your email to sign in
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="name">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="pl-9"
                  name="name"
                  value={formValue.name}
                  onChange={handleChange}
                />
              </div>
            </div>

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

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  className="pl-9"
                  name="password"
                  value={formValue.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:underline"
              >
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
