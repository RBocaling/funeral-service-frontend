import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks/controllers/useRegister";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const registerMutation = useRegister();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(
      { email, password, role: "FUNERAL_SERVICE",username,},
      {
        onSuccess: () => {
          navigate("/login");
        },
        onError: (error: any) => {
          console.error("register failed:", error.response?.data?.message || error.message);
        },
      }
    );
  };

  return (
    <div className="w-full min-h-screen   text-white flex flex-col justify-center relative">
      <div className="max-w-md w-full mx-auto">
        <div className="flex items-center gap-2 cursor-pointer mb-5">
          <img src="/mockLogo.png" alt="Memorial" className="h-10 w-10" />
          <span className="font-bold hidden sm:inline-block">
            Memorial Services
          </span>
        </div>

        <h2 className="text-2xl font-bold mb-2 text-gradient">Registration</h2>
        <p className="text-sm text-gray-400 mb-6">
          Join us today and book funeral services with ease. Track, manage, and
          stay informed every step of the way.
        </p>

        <form className="space-y-5 relative z-20">
          {/* <Input
            type="User name"
            placeholder="Email"
            className="w-full px-4 py-3 bg-neutral-800 focus:bg-neutral-800/70 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          /> */}
          <Input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-800 focus:bg-neutral-800/70 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <Input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-800 focus:bg-neutral-800/70 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-800 focus:bg-neutral-800/70 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <Button
            onClick={handleRegister}
            disabled={registerMutation?.isPending}
            className="w-full py-6 bg-sky-500 shadow-2xl shadow-sky-500/20 hover:bg-sky-600 rounded-full font-semibold"
          >
            {
              registerMutation?.isPending ? "Registering...":"Sign Up"
            }
          </Button>
        </form>

        <p className="text-sm mt-6 text-center text-gray-400 relative z-20">
          Don’t have an account?{" "}
          <Link to="/login" className="text-sky-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
      <img
        src="/grid-bg.png"
        className="absolute top-0 left-0 w-full h-full -z-10s opacity-60"
        alt=""
      />
    </div>
  );
};

export default Register;
