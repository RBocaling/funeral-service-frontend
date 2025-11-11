import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useRegister } from "@/hooks/controllers/useRegister";
import UseUserList from "@/hooks/controllers/UseUserList";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAlertStore } from "@/store/alertStore";
import TermsAgreement from "@/components/TermsAgreement/TermsAgreement";

import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import OtpInput from "@/components/ui/otp-input";
import { generateRandomText } from "@/utils/generae";

const Register = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlertStore();
  const ss = generateRandomText();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(ss);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agreed, setAgreed] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ OTP modal and OTP value holder
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otpValue, setOtpValue] = useState(""); // ✅ this stores the OTP digits

  const otpVerify = useMutation({
    mutationFn: async () => {
      return await api.post("/auth/verify-account", {
        otp: otpValue,
        email,
      });
    },
    onSuccess: async () => {
      await showAlert("success", {
        title: "OTP Verified!",
        message: "Account successfully verified.",
        autoClose: true,
      });

      navigate("/login");
    },
    onError: async () => {
      await showAlert("error", {
        title: "OTP Invalid",
        message: "The OTP code is incorrect. Try again.",
        autoClose: true,
      });
    },
  });

  const registerMutation = useRegister();
  const { data: userList = [] } = UseUserList();

  // ✅ Check if email exists
  useEffect(() => {
    const emailExists = userList.some((user: any) => user.email === email);
    setEmailError(emailExists ? "Email already exists." : "");
  }, [email, userList]);

  // ✅ Check if username exists
  useEffect(() => {
    const usernameExists = userList.some(
      (user: any) => user.username === username
    );
    setUsernameError(usernameExists ? "Username already exists." : "");
  }, [username, userList]);

  const isPasswordValid = {
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
    hasMinLength: password.length >= 8,
  };

  const allValid = Object.values(isPasswordValid).every(Boolean);
  const confirmPasswordError =
    confirmPassword && confirmPassword !== password
      ? "Passwords do not match."
      : "";

  console.log("Sss", ss);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError || usernameError || !allValid || confirmPasswordError)
      return;

    registerMutation.mutate(
      { email, password, role: "FUNERAL_SERVICE", username },
      {
        onSuccess: async () => {
          setRegisteredEmail(email);
          setShowOtpModal(true); // ✅ open OTP modal
        },
        onError: async () => {
          await showAlert("error", {
            title: "Error",
            message: "Something went wrong. Please try again.",
            autoClose: true,
          });
        },
      }
    );
  };

  const handleOtpSubmit = () => {
    if (!otpValue) {
      console.log("No OTP entered");
      return;
    }

    otpVerify.mutate();
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col justify-center relative">
      <div className="max-w-md w-full mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <img
            src="/logo-funeral-dark.png"
            alt="Memorial"
            className="w-[70%]"
          />
        </div>

        <h2 className="text-2xl font-bold mb-2 text-gradient">
          Customer Registration
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Join us today and book funeral services with ease. Track, manage, and
          stay informed every step of the way.
        </p>

        <form className="space-y-5" onSubmit={handleRegister}>
          <div className="hidden">
            <Input
              type="text"
              placeholder="Username"
              value={ss}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-200 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-sky-500"
            />
            {usernameError && (
              <p className="text-sm  text-red-500 mt-1">{usernameError}</p>
            )}
          </div>

          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-200 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-sky-500"
            />
            {emailError && (
              <p className="text-sm text-red-500 mt-1">{emailError}</p>
            )}
          </div>

          {/* PASSWORD FIELD */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordTouched(true)}
              className="w-full px-4 py-3 bg-neutral-200 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-sky-500 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="w-6 h-6" />
              ) : (
                <Eye className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* PASSWORD VALIDATION */}
          {passwordTouched && (
            <div className="mt-2 text-sm space-y-1">
              {[
                ["an uppercase letter", isPasswordValid.hasUpper],
                ["a lowercase letter", isPasswordValid.hasLower],
                ["a number", isPasswordValid.hasNumber],
                ["a special character", isPasswordValid.hasSpecial],
                ["8 characters minimum", isPasswordValid.hasMinLength],
              ].map(([label, valid], i) => (
                <p
                  key={i}
                  className={`flex items-center gap-2 ${
                    valid ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {label}
                </p>
              ))}
            </div>
          )}

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-200 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-sky-500 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-6 h-6" />
              ) : (
                <Eye className="w-6 h-6" />
              )}
            </button>
            {confirmPasswordError && (
              <p className="text-sm text-red-500 mt-1">
                {confirmPasswordError}
              </p>
            )}
          </div>

          <TermsAgreement
            title="Customer Registration"
            onAgreeChange={setAgreed}
          />

          <Button
            type="submit"
            disabled={
              registerMutation.isPending ||
              !!emailError ||
              !!usernameError ||
              !allValid ||
              !!confirmPasswordError ||
              !agreed
            }
            className="w-full py-6 bg-sky-500 hover:bg-sky-600 rounded-full font-semibold shadow-2xl shadow-sky-500/20"
          >
            {registerMutation.isPending ? "Registering..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-sm mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>

      {/* ✅ OTP MODAL */}
      <Dialog open={showOtpModal} onOpenChange={() => console.log("d")}>
        <DialogContent className="max-w-sm rounded-3xl border-none shadow-xl backdrop-blur-2xl bg-white/75">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-semibold">
              Verify Email
            </DialogTitle>
          </DialogHeader>

          <p className="text-center text-sm text-gray-500">
            We've sent a verification code to:
          </p>
          <p className="text-center text-sky-600 font-medium">
            {registeredEmail}
          </p>

          <div className="mt-6 flex justify-center">
            <OtpInput
              length={6}
              onChange={(value: string) => setOtpValue(value)} // ✅ Update while typing
              onComplete={(value: string) => setOtpValue(value)} // ✅ Update when full
            />
          </div>

          <Button
            onClick={handleOtpSubmit}
            className="rounded-full py-5 w-full mt-6 bg-sky-600 hover:bg-sky-700"
          >
            Submit Code
          </Button>
        </DialogContent>
      </Dialog>

      <img
        src="/grid-bg.png"
        className="absolute top-0 left-0 w-full h-full -z-10 opacity-60"
        alt=""
      />
    </div>
  );
};

export default Register;
