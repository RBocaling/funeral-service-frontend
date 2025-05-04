import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks/controllers/useRegister";
import UseUserList from "@/hooks/controllers/UseUserList";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const registerMutation = useRegister();
  const { data: userList = [] } = UseUserList();

  useEffect(() => {
    const emailExists = userList.some((user:any )=> user.email === email);
    setEmailError(emailExists ? "Email already exists." : "");
  }, [email, userList]);

  useEffect(() => {
    const usernameExists = userList.some((user:any) => user.username === username);
    setUsernameError(usernameExists ? "Username already exists." : "");
  }, [username, userList]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError || usernameError) return;

    registerMutation.mutate(
      { email, password, role: "FUNERAL_SERVICE", username },
      {
        onSuccess: () => navigate("/login"),
        onError: (error: any) => {
          console.error("Registration failed:", error.response?.data?.message || error.message);
        },
      }
    );
  };

  return (
    <div className="w-full min-h-screen text-white flex flex-col justify-center relative">
      <div className="max-w-md w-full mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <img src="/mockLogo.png" alt="Memorial" className="h-10 w-10" />
          <span className="font-bold hidden sm:inline-block">Memorial Services</span>
        </div>

        <h2 className="text-2xl font-bold mb-2 text-gradient">Registration</h2>
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
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {usernameError && <p className="text-sm text-red-500 mt-1">{usernameError}</p>}
          </div>

          <div>
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
          </div>

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <Button
            type="submit"
            disabled={registerMutation.isPending || !!emailError || !!usernameError}
            className="w-full py-6 bg-sky-500 hover:bg-sky-600 rounded-full font-semibold shadow-2xl shadow-sky-500/20"
          >
            {registerMutation.isPending ? "Registering..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-sm mt-6 text-center text-gray-400">
          Don’t have an account?{" "}
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
