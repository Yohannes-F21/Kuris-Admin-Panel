import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  // State for form fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // State for error messages
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // State for loading
  const [isLoading, setIsLoading] = useState(false);

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    };

    // Validate Old Password
    if (!oldPassword.trim()) {
      newErrors.oldPassword = "Old password is required.";
      isValid = false;
    }

    // Validate New Password
    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required.";
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters.";
      isValid = false;
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        newPassword
      )
    ) {
      newErrors.newPassword =
        "Password must include uppercase, lowercase, number, and special character.";
      isValid = false;
    }

    // Validate Confirm New Password
    if (!confirmNewPassword.trim()) {
      newErrors.confirmNewPassword = "Confirm password is required.";
      isValid = false;
    } else if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match.";
      isValid = false;
    }

    // Update errors state
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate an API call to change the password
      console.log("Form Values:", { oldPassword, newPassword });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
      toast.success("Password changed successfully!");
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
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
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.oldPassword ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.oldPassword && (
              <p className="text-sm text-red-500">{errors.oldPassword}</p>
            )}
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
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password Field */}
          <div>
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.confirmNewPassword ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.confirmNewPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmNewPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
