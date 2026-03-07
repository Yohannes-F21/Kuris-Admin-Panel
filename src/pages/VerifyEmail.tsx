import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../features/hooks";
import { UserVerifyEmail } from "../features/authActions";
import api from "../axios";
import { getToastMessage, notifyError, notifySuccess } from "../lib/toast";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VerifyEmail: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const query = useQuery();

  const token = query.get("token") || "";
  const email = query.get("email") || "";
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      if (!token) return;

      setLoading(true);
      setErrorText("");
      const response = await dispatch(UserVerifyEmail({ token, email }));

      if (UserVerifyEmail.fulfilled.match(response)) {
        notifySuccess(response.payload, "Email verified. You can now sign in.");
        setLoading(false);
        navigate("/login", { replace: true });
        return;
      }

      setLoading(false);
      const payload = (response as any)?.payload;
      const message = getToastMessage(
        payload,
        "Verification failed. Please request a new link.",
      );
      setErrorText(message);
      notifyError(payload, "Verification failed. Please request a new link.");
    };

    run();
  }, [dispatch, navigate, token]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold">Verify Email</h1>

        {!token ? (
          <>
            <p className="text-gray-600">Missing verification token.</p>
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Go to login
            </Link>
          </>
        ) : (
          <>
            <p className="text-gray-600">
              {loading ? "Verifying your email..." : "Processing..."}
            </p>

            {!loading && !email && (
              <p className="text-sm text-red-600">
                Your verification link is missing the email. Ask the backend to
                send a link like
                <br />
                <span className="break-all">
                  /verify-email?email=you@example.com&token=...
                </span>
              </p>
            )}

            {!!errorText && (
              <div className="space-y-2">
                <p className="text-sm text-red-600">{errorText}</p>
                <a
                  className="text-sm text-blue-600 hover:underline"
                  href={`${(api.defaults.baseURL || "").toString().replace(/\/$/, "")}/user/auth/verify-email?token=${encodeURIComponent(token)}${email ? `&email=${encodeURIComponent(email)}` : ""}`}
                >
                  Try backend verification link
                </a>
              </div>
            )}
            <div>
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:underline"
              >
                Go to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
