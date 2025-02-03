import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "../components/ui/Input";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useDispatch } from "react-redux";
import { UserSendOTP } from "../features/authActions";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../features/hooks"; // Import custom `useAppDispatch` hook
import { Button } from "../components/ui/Button";

// Define types for form values
interface FormValues {
  email: string;
  otp: string;
}

// Custom hook to parse query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Notification function
const notify = (text: string) => toast(text);

const OTPScreen: React.FC = () => {
  const dispatch = useAppDispatch(); // Use the custom hook for typed dispatch
  const navigate = useNavigate();
  const query = useQuery();

  // State for form values and loading
  const [formValue, setFormValue] = useState<FormValues>({
    email: query.get("email") || "",
    otp: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await dispatch(UserSendOTP(formValue));
      // const payload = response.payload as { message?: string }; // Type assertion for payload

      if (response.meta.requestStatus === "fulfilled") {
        notify("Login Successful");
        setLoading(false);
        return navigate("/dashboard");
      }

      if (response.meta.requestStatus === "rejected") {
        setLoading(false);
        notify("Please Input Correct OTP value!");
      }
    } catch (error) {
      setLoading(false);
      notify("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-4">
      <ToastContainer />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="otp">
            Enter your OTP (One Time Password) sent to your email:
          </label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter your OTP"
            name="otp"
            value={formValue.otp}
            onChange={handleChange}
            required={true}
          />
        </div>

        <Button className="w-full" disabled={loading}>
          {loading ? "Loading..." : "Verify OTP"}
        </Button>
      </form>
    </div>
  );
};

export default OTPScreen;
