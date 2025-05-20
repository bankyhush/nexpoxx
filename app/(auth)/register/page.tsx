"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeroHeader } from "@/components/hero8-header";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterPageUI() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

              <form className="w-full mx-auto p-6 bg-white dark:bg-background shadow-md rounded-lg">
                {/* Email Field */}
                <div className="mb-6 relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="w-full pl-10 pr-3 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Password Field */}
                <div className="mb-6 relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
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
                    className="w-full pl-10 pr-10 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <Button className="cursor-pointer w-full bg-primary text-white hover:shadow-lg dark:bg-primary-dark py-3 rounded-md">
                  Register
                </Button>
              </form>

              <div className="mt-8 text-center text-sm text-gray-500">
                <p>
                  This site is protected by Google reCAPTCHA to ensure you're not a bot.{" "}
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
