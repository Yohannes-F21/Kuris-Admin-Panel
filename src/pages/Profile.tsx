import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserChangePassword } from "../features/authActions";
import { useNavigate } from "react-router-dom";
// import { Button } from "../components/ui/Button"; // Import shadcn/ui Button
// import { AppDispatch } from "../features/store"; // Import AppDispatch for typed dispatch
import { useAppDispatch } from "../features/hooks";
const notify = (text: string) => toast(text);
const storedUser = localStorage.getItem("userInfo");

const user = storedUser ? JSON?.parse(storedUser) : null;

interface FormValues {
  _id: string;
  email: string;
  oldPassword: string;
  newPassword: string;
}
const Profile = () => {
  const dispatch = useAppDispatch(); // Use the custom hook for typed dispatch
  const navigate = useNavigate();
  //  const query = useQuery();

  // State for form values and loading
  const [formValue, setFormValue] = useState<FormValues>({
    _id: user._id,
    email: user.email,
    oldPassword: "",
    newPassword: "",
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
    if (name === "newPassword") {
      validatePassword(value);
    }
  };

  // Validate password strength
  const validatePassword = (password: string) => {
    if (!regEx.test(password)) {
      setIsDisabled(true);
      console.log(isDisabled);

      return "Password must be 8+ characters long & contain at least a special character, a number, an uppercase, and a lowercase character!";
    }
    setIsDisabled(false);
    return "";
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await dispatch(UserChangePassword(formValue));
      // const payload = response.payload as { message?: string }; // Type assertion for payload

      if (response.meta.requestStatus === "fulfilled") {
        notify("Password Changed Successfully");
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
    <div className="flex items-center justify-center mt-5  ">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg ">
        <h1 className="text-2xl font-bold text-center">Change Password</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Old Password Field */}
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              // value={formValue.oldPassword}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
          </div>

          {/* New Password Field */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              // value={formValue.newPassword}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
          </div>

          {/* Confirm New Password Field */}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
