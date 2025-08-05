"use client";
import { useUser } from "@/hooks/useUser";
import BubbleLoader from "@/components/loaders/BubbleLoader";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CgSpinnerTwoAlt } from "react-icons/cg";

export default function EditProfilePage() {
  const { data: user, isLoading } = useUser();
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    country: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updating, setUpdating] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        country: user.country || "",
      });
    }
  }, [user]);

  if (isLoading || !user) return <BubbleLoader />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    toast.dismiss();
    await toast.promise(
      fetch("/api/dashboard_api/profile/edit", {
        method: "PUT",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.details?.map((d: any) => d.message).join(", ") ||
              "Failed to update profile"
          );
        }
        return res;
      }),
      {
        loading: "Updating profile...",
        success: "Profile updated!",
        error: (err) => err.message || "Failed to update profile",
      }
    );
    setUpdating(false);
  };

  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPwError("New password and confirmation do not match.");
      return;
    }
    setPwError("");
    setPasswordUpdating(true);
    toast.dismiss();
    await toast.promise(
      fetch("/api/dashboard_api/profile/password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
        headers: { "Content-Type": "application/json" },
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.details?.map((d: any) => d.message).join(", ") ||
              "Failed to change password"
          );
        }
        return res;
      }),
      {
        loading: "Changing password...",
        success: "Password changed!",
        error: (err) => err.message || "Failed to change password",
      }
    );
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordUpdating(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 bg-gray-50 text-black min-h-screen dark:bg-background/50">
      <div className="bg-white shadow-md rounded-lg p-8 dark:bg-gray-900 dark:text-white">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
          Edit Profile
        </h1>

        <form onSubmit={onUpdateProfile} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter full name"
              maxLength={100}
              aria-label="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium  mb-1">
              Phone Number
            </label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter phone number"
              maxLength={20}
              aria-label="Phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium  mb-1">Country</label>
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter country"
              maxLength={50}
              aria-label="Country"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className={`cursor-pointer bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-md shadow transition w-40 flex items-center justify-center ${
              updating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {updating ? (
              <CgSpinnerTwoAlt className="animate-spin text-xl" />
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8 mt-12 dark:bg-gray-900 dark:text-white">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Change Password
        </h2>

        <form onSubmit={onChangePassword} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Current password"
              required
              aria-label="Current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="New password"
              required
              minLength={8}
              maxLength={255}
              aria-label="New password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Confirm new password"
              required
              minLength={8}
              maxLength={255}
              aria-label="Confirm new password"
            />
          </div>

          {pwError && (
            <p className="text-red-600 text-sm font-bold">{pwError}</p>
          )}

          <button
            type="submit"
            disabled={passwordUpdating}
            className={`cursor-pointer bg-red-800 hover:bg-red-900 text-white font-semibold py-3 px-6 rounded-md shadow transition w-48 flex items-center justify-center ${
              passwordUpdating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {passwordUpdating ? (
              <CgSpinnerTwoAlt className="animate-spin text-xl" />
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
