"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import BubbleLoader from "@/components/loaders/BubbleLoader";
import Link from "next/link";
import LogoutButton from "../../DLogout";

const InfoRow = ({
  label,
  value,
  action,
}: {
  label: string;
  value: React.ReactNode;
  action?: string;
}) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
      {label}
    </span>
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      {action && (
        <button className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
          {action}
        </button>
      )}
    </div>
  </div>
);

export default function ProfileDashboard() {
  const { data: user, isLoading, error } = useUser();

  if (isLoading) return <BubbleLoader />;
  if (error)
    return <p className="text-red-500 py-10 text-center">{error.message}</p>;
  if (!user)
    return <p className="text-center py-10 dark:text-white">User not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-gray-50 dark:bg-background/50 min-h-screen transition-colors duration-300">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-10">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden shadow">
            {/* Placeholder avatar */}
            <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Account Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your personal information
          </p>
        </div>
      </div>

      {/* Personal Info Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          Personal Info
        </h2>
        <span className="capitalize">
          <InfoRow label="Full Name" value={user.fullName || "Not set"} />
        </span>
        <InfoRow label="Wallet Address" value={user.walletAddress} />
      </div>

      {/* Verification Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          Verification
        </h2>
        <InfoRow
          label="Identity Verification"
          value={
            <div className="flex items-center gap-2">
              {user.kycStatus === "Verified" ? (
                <Check size={16} className="text-green-500" />
              ) : user.kycStatus === "Pending" ? (
                <X size={16} className="text-yellow-500" />
              ) : (
                <X size={16} className="text-gray-500 dark:text-gray-400" />
              )}
              <span className="font-bold text-sm">
                {user.kycStatus === "Verified" ? (
                  user.kycStatus
                ) : user.kycStatus === "Pending" ? (
                  <Link
                    href="/dashboard/profile/kyc"
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    passHref
                  >
                    VERIFY NOW &#8594;
                  </Link>
                ) : (
                  "Not Verified"
                )}
              </span>
            </div>
          }
        />
        <InfoRow
          label="Country/Region"
          value={user.country || "Not provided"}
        />
      </div>

      {/* Account Details Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 mb-18">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Account Details
        </h2>
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Phone" value={user.phoneNumber || "Not provided"} />
        <span className="capitalize">
          <InfoRow label="Account Type" value={user.accountType} />
        </span>
        <InfoRow label="Password" value="••••••••" />

        <div className="flex justify-between items-center mt-6">
          <Link href="/dashboard/profile/edit">
            <button className="cursor-pointer float-right mt-10 mb-10 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-200">
              Edit Profile
            </button>
          </Link>

          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
