import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MessageError from "@/components/ui/MessageError";
import { useLogin } from "@/hooks/controllers/useLogin";
import UseUserList from "@/hooks/controllers/UseUserList";
import { useProfileProgress } from "@/store/completeProfileStore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleError, setRoleError] = useState("");
  const loginMutation = useLogin();
  const { data: userList = [] } = UseUserList();
const { setCompleteProfileModal} = useProfileProgress()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const existingUser = userList.find((user:any) => user.email === email);

    if (existingUser && existingUser.role !== "FUNERAL_SERVICE") {
      setRoleError(
        `Your email is registered as ${existingUser.role}. You are not allowed to access this page.`
      );
      return;
    }

    setRoleError("");

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/")
          setCompleteProfileModal(true)
        },
        onError: (error: any) => {
          console.error("Login failed:", error.response?.data?.message || error.message);
        },
      }
    );
  };

  return (
    <div className="w-full min-h-screen text-white flex flex-col justify-center relative">
      <div className="max-w-md w-full mx-auto">
        <div className="flex items-center gap-2 cursor-pointer mb-5">
          <img src="/mockLogo.png" alt="Memorial" className="h-10 w-10" />
          <span className="font-bold hidden sm:inline-block">Memorial Services</span>
        </div>

        <h2 className="text-2xl font-bold mb-2 text-gradient">Log in to your account</h2>
        <p className="text-sm text-gray-400 mb-6">
          Welcome back! Please enter your details.
        </p>

        {loginMutation.isError && (
          <MessageError message="Invalid credentials. Please verify your email and password, then try again." />
        )}
        {roleError && <MessageError message={roleError} />}

        <form className="space-y-5 relative z-20 mt-3" onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <Button
            type="submit"
            className="w-full py-6 bg-sky-500 shadow-2xl shadow-sky-500/20 hover:bg-sky-600 rounded-full font-semibold"
          >
            {loginMutation.isPending ? "Loading..." : "Sign in"}
          </Button>
        </form>

        <p className="text-sm mt-6 text-center text-gray-400 relative z-20">
          Don’t have an account?{" "}
          <Link to="/register" className="text-sky-400 hover:underline">
            Sign Up
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

export default Login;
