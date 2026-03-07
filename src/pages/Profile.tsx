import React, { useMemo, useState } from "react";
import { UserChangePassword } from "../features/authActions";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { notifyError, notifySuccess } from "../lib/toast";

interface FormValues {
  _id: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const [formValue, setFormValue] = useState<FormValues>({
    _id: typeof user?._id === "string" ? user._id : "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const passwordError = useMemo(() => {
    if (!formValue.newPassword) return "";

    const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    if (!regEx.test(formValue.newPassword)) {
      return "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
    }

    if (
      formValue.confirmPassword &&
      formValue.newPassword !== formValue.confirmPassword
    ) {
      return "New password and confirmation do not match.";
    }

    return "";
  }, [formValue.confirmPassword, formValue.newPassword]);

  const isDisabled =
    loading ||
    !formValue._id ||
    !formValue.oldPassword.trim() ||
    !formValue.newPassword.trim() ||
    !formValue.confirmPassword.trim() ||
    Boolean(passwordError);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formValue._id) {
      notifyError(null, "Unable to identify the current user.");
      return;
    }

    if (passwordError) {
      notifyError(passwordError, "Please fix the password errors.");
      return;
    }

    setLoading(true);

    try {
      const response = await dispatch(
        UserChangePassword({
          _id: formValue._id,
          oldPassword: formValue.oldPassword.trim(),
          newPassword: formValue.newPassword.trim(),
        }),
      );

      if (UserChangePassword.fulfilled.match(response)) {
        notifySuccess(response.payload, "Password changed successfully.");
        setLoading(false);
        setFormValue((prev) => ({
          ...prev,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        return navigate("/dashboard");
      }

      setLoading(false);
      notifyError(response.payload, "Unable to change password.");
    } catch (error) {
      setLoading(false);
      notifyError(error, "An unexpected error occurred.");
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-center">Change Password</h1>
          <p className="mt-2 text-sm text-gray-500">
            Update your password to keep your account secure.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Old Password
            </label>
            <Input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={formValue.oldPassword}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <Input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formValue.newPassword}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formValue.confirmPassword}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          {passwordError && (
            <p className="text-sm text-red-600">{passwordError}</p>
          )}

          <Button type="submit" className="w-full" disabled={isDisabled}>
            {loading ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
