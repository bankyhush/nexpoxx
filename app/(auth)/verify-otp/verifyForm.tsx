"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HeroHeader } from "@/components/hero8-header";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function VerifysForm() {
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(43);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    const verifySession = localStorage.getItem("verifySession");
    const storedEmail = localStorage.getItem("verifyEmail");

    if (!verifySession) {
      router.replace("/register");
    }

    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [router]);

  useEffect(() => {
    if (resendTimer > 0 && isResendDisabled) {
      const timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setIsResendDisabled(false);
    }
  }, [resendTimer, isResendDisabled]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1 || (value && !/^\d$/.test(value))) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const updated = code.map((_, i) => pasted[i] || "");
    setCode(updated);

    const next = updated.findIndex((d) => d === "");
    inputRefs.current[next === -1 ? 5 : next]?.focus();
  };

  const isCodeComplete = code.every((d) => d !== "");

  const handleNext = async () => {
    if (!isCodeComplete || !email) return;
    const fullCode = code.join("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth_api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Verification failed");

      toast.success("Verification successful!");
      router.push(data.redirectPath || "/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (isResendDisabled) return;
    setResendTimer(43);
    setIsResendDisabled(true);

    try {
      const res = await fetch("/api/auth_api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend");

      toast.success("Verification code resent!");
    } catch (err: any) {
      toast.error(err.message || "Could not resend code");
    }
  };

  const handleChangeEmail = () => {
    localStorage.removeItem("verifyEmail");
    localStorage.removeItem("verifySession");
    router.replace("/login");
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
            <div className="hidden max-w-md mx-auto md:mx-0 md:ml-auto flex-1 md:flex flex-col justify-center ">
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
              <h1 className="text-4xl font-bold mb-1 text-black">
                Verify it's you
              </h1>
              <span className="text-sm mb-8 text-gray-600 font-light">
                Look out for the code we've sent to {email}
              </span>
              <Tabs defaultValue="email" className="w-full">
                <TabsContent value="email">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleNext();
                    }}
                    className="max-w-md mx-auto p-6 bg-white dark:bg-background shadow-md rounded-lg"
                  >
                    <div className="mb-8">
                      <div className="flex justify-center space-x-3 mb-8">
                        {code.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                              handleInputChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            className="w-10 h-10 md:w-10 md:h-10 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-background dark:bg-background dark:border-gray-700 dark:focus:border-blue-500"
                            autoComplete="off"
                          />
                        ))}
                      </div>

                      <Button
                        onClick={handleNext}
                        disabled={!isCodeComplete || loading}
                        className={`w-full py-4 text-lg font-medium rounded-lg transition-all ${
                          isCodeComplete
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {loading ? "Verifying..." : "Next"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="text-center text-gray-600 mt-5">
                <span>Didn't receive anything? </span>
                <button
                  onClick={handleResendCode}
                  disabled={isResendDisabled}
                  className={`font-medium underline ${
                    isResendDisabled
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-black hover:text-gray-700"
                  }`}
                >
                  Resend code {isResendDisabled && `(${resendTimer})`}
                </button>
                <span> or </span>
                <button
                  onClick={handleChangeEmail}
                  className="font-medium text-black underline hover:text-gray-700"
                >
                  change email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
