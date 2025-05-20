import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks/controllers/useRegister";
import UseUserList from "@/hooks/controllers/UseUserList";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAlertStore } from "@/store/alertStore";
import TermsAgreement from "@/components/TermsAgreement/TermsAgreement";

const Register = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlertStore();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agreed, setAgreed] = useState(false);

  const handleAgreeChange = (value: boolean) => {
    setAgreed(value);
  };

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = useRegister();
  const { data: userList = [] } = UseUserList();

  useEffect(() => {
    const emailExists = userList.some((user: any) => user.email === email);
    setEmailError(emailExists ? "Email already exists." : "");
  }, [email, userList]);

  useEffect(() => {
    const usernameExists = userList.some((user: any) => user.username === username);
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
    confirmPassword && confirmPassword !== password ? "Passwords do not match." : "";

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError || usernameError || !allValid || confirmPasswordError) return;

    registerMutation.mutate(
      { email, password, role: "FUNERAL_SERVICE", username },
      {
        onSuccess: async () => {
           await  showAlert('success', {
            title: 'Success Updated!',
            message: 'Your action was completed successfully.',
            autoClose: true,
           });
          navigate("/login")
        },
        onError:async (error: any) => {
           await showAlert('error', {
            title: 'Error Add',
            message: 'Something went wrong. Please try again.',
            autoClose: true,
          });
          console.error("Registration failed:", error.response?.data?.message || error.message);
        },
      }
    );
  };

  return (
    <div className="w-full min-h-screen text-white flex flex-col justify-center relative">
      <div className="max-w-md w-full mx-auto">
        <div className="flex items-center gap-2 mb-5">
 <img src="/logo-funeral-dark.png" alt="Memorial" className=" w-[70%]" />        </div>

        <h2 className="text-2xl font-bold mb-2 text-gradient">Funeral Service Registration</h2>
        <p className="text-sm text-gray-400 mb-6">
          Join us today and book funeral services with ease. Track, manage, and stay informed every step of the way.
        </p>

        <form className="space-y-5" onSubmit={handleRegister}>
          <div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg"
            />
            {usernameError && <p className="text-sm text-red-500 mt-1">{usernameError}</p>}
          </div>

          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg"
            />
            {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
          </div>

          {/* Password Field */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordTouched(true)}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Password Checklist */}
          {passwordTouched && (
            <div className="mt-2 text-sm space-y-1">
              {[
                ["an uppercase letter", isPasswordValid.hasUpper],
                ["a lowercase letter", isPasswordValid.hasLower],
                ["a number", isPasswordValid.hasNumber],
                ["a special character", isPasswordValid.hasSpecial],
                ["8 characters minimum", isPasswordValid.hasMinLength],
              ].map(([label, valid], i) => (
                <p key={i} className={`flex items-center gap-2 ${valid ? "text-green-400" : "text-gray-400"}`}>
                  <CheckCircle className="w-4 h-4" />
                  {label}
                </p>
              ))}
            </div>
          )}

          {/* Confirm Password Field */}
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {confirmPasswordError && <p className="text-sm text-red-500 mt-1">{confirmPasswordError}</p>}
          </div>

          <TermsAgreement
        title="Funeral Registration"
        onAgreeChange={handleAgreeChange}
        termsText={`1. You agree to provide valid identification.\n2. Booking is final once confirmed.\n3. Cancellations are subject to service policies.`}
          />
          
          {/* Submit */}
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

      <img
        src="/grid-bg.png"
        className="absolute top-0 left-0 w-full h-full -z-10 opacity-60"
        alt=""
      />
    </div>
  );
};

export default Register;
