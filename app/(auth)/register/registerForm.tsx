"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeroHeader } from "@/components/hero8-header";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.dismiss();
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      toast.dismiss();
      await toast.promise(
        fetch("/api/auth_api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
          }),
        }).then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Registration failed");
          return data;
        }),
        {
          loading: "Loading...",
          success: "Registration successful! OTP sent to your email.",
          error: (err) => err.message || "Failed to register",
        }
      );
      localStorage.setItem("verifySession", "true");
      localStorage.setItem("verifyEmail", formData.email);
      router.push("/verify-otp");
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="pb-[50px]">
        <HeroHeader />
      </div>

      <div className="min-h-screen flex flex-col">
        <div className="flex flex-col md:flex-row flex-1">
          {/* Left Side */}
          <div className="bg-black text-white w-full md:w-1/2 p-8 md:p-16 flex flex-col">
            <div className="hidden max-w-md mx-auto md:mx-0 md:ml-auto flex-1 md:flex flex-col justify-center">
              <h1 className="text-4xl md:text-3xl font-bold mb-6">
                Trade with confidence
              </h1>
              <p className="text-lg text-gray-300 mb-12">
                Trusted by millions, delivering the fastest trade execution,
                with powerful trading tools and a self-custody wallet.
              </p>
              <div className="hidden bg-zinc-900 max-w-2xl rounded-3xl overflow-hidden border border-zinc-800 md:block">
                <center>
                  <Image
                    src="/assets/f4.webp"
                    alt="Trading Chart Preview"
                    height={340}
                    width={300}
                  />
                </center>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="bg-white w-full -mt-14 md:w-1/2 p-8 md:p-16 flex flex-col">
            <div className="max-w-md mx-auto md:mx-0 md:mr-auto flex-1 flex flex-col justify-center">
              <h1 className="text-4xl font-bold mb-2 text-black">
                Create your account
              </h1>
              <span className="text-sm text-gray-500 mb-6">
                Ensure this email can receive verification codes.
              </span>

              {loading ? (
                <div className="flex items-center justify-center h-[280px]">
                  <div className="w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="w-full mx-auto p-6 bg-white dark:bg-background shadow-md rounded-lg"
                >
                  {/* Full Name Field */}
                  <div className="mb-6 relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="mb-6 relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <Input
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="mb-6 relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-6 relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>

                  <Button
                    disabled={isLoading}
                    className={`${
                      isLoading
                        ? "cursor-not-allowed bg-gray-500 text-white hover:bg-gray-500"
                        : "cursor-pointer"
                    } w-full bg-primary text-white hover:shadow-lg dark:bg-primary-dark py-3 rounded-md`}
                  >
                    {isLoading ? (
                      <CgSpinnerTwoAlt className="animate-spin text-4xl" />
                    ) : (
                      "Sign up"
                    )}
                  </Button>
                </form>
              )}

              <div className="mt-8 text-center text-sm text-gray-500">
                <p>
                  This site is protected by Google reCAPTCHA to ensure
                  you&apos;re not a bot.{" "}
                  <a href="#" className="text-black underline">
                    Learn more
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
