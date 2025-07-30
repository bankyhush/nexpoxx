"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeroHeader } from "@/components/hero8-header";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { CgSpinnerTwoAlt } from "react-icons/cg";

export default function LoginForms() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    toast.dismiss();

    try {
      const response = await fetch("/api/auth_api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Login failed");

      toast.success("Login successful!");
      router.push(data.redirectPath || "/wallet");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
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
          <div className="bg-white w-full -mt-6 md:w-1/2 p-8 md:p-16 flex flex-col">
            <div className="max-w-md mx-auto md:mx-0 md:mr-auto flex-1 flex flex-col justify-center">
              <h1 className="text-4xl font-bold mb-10 text-black">Log in</h1>

              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid grid-cols-3 mb-3">
                  <TabsTrigger
                    value="email"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:rounded-none data-[state=active]:shadow-none"
                  >
                    Email / Sub-account
                  </TabsTrigger>
                  <TabsTrigger
                    value="qr"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:rounded-none data-[state=active]:shadow-none"
                  >
                    QR code
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="email">
                  <form
                    onSubmit={handleSubmit}
                    className="max-w-md mx-auto p-6 bg-white dark:bg-background shadow-md rounded-lg"
                  >
                    {/* Email Field */}
                    <div className="mb-6 relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <Input
                        type="email"
                        placeholder="Email or Sub-account"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
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
                        required
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

                    {/* Submit Button */}
                    <Button
                      disabled={isLoading}
                      className={`${
                        isLoading
                          ? "cursor-not-allowed bg-gray-500"
                          : "cursor-pointer"
                      } w-full bg-primary text-white hover:shadow-lg dark:bg-primary-dark py-3 rounded-md`}
                    >
                      {isLoading ? (
                        <CgSpinnerTwoAlt className="animate-spin text-4xl" />
                      ) : (
                        "Next"
                      )}
                    </Button>
                  </form>
                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      Don&apos;t have an account?{" "}
                      <Link href="/register" className="text-black font-medium">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="qr">
                  <div className="mb-6 flex justify-center">
                    <div className="w-40 h-40 bg-gray-100 rounded-md flex items-center justify-center">
                      <Image
                        src="/clips/br.png"
                        alt="QR Code"
                        width={160}
                        height={160}
                      />
                    </div>
                    <div>
                      <video className="w-40 h-40" autoPlay muted>
                        <source src="/clips/sc.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      Don&apos;t have an account?{" "}
                      <Link href="/register" className="text-black font-medium">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

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
