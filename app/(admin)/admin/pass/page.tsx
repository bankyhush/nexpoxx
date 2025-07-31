"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function EditProfilePage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/admin_api/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setForm({ email: data.email, password: "", confirmPassword: "" });
      } catch {
        toast.error("Failed to load profile data");
      } finally {
        setFetching(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    // Validate passwords match
    if (form.password && form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    const payload = {
      email: form.email,
      ...(form.password && { password: form.password }),
    };

    const res = await toast.promise(
      fetch("/api/admin_api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
      {
        loading: "Updating...",
        success: "Profile Updated!",
        error: (err) => {
          if (err instanceof Response) {
            return `Failed to update profile (${err.status})`;
          }
          return "Failed to update profile";
        },
      }
    );

    setLoading(false);
    if (res.ok) {
      setForm((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
      router.push("/admin/pass");
    }
  };

  if (fetching) return <p className="p-6">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

      <label>
        Email <span className="text-red-500">(required)</span>
      </label>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        maxLength={255}
        required
        className="w-full border p-2 rounded"
        aria-label="Admin email"
      />

      <label>
        New Password{" "}
        <span className="text-red-500">(optional, min 8 characters)</span>
      </label>
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        maxLength={255}
        minLength={8}
        className="w-full border p-2 rounded"
        aria-label="New password"
      />

      <label>Confirm New Password</label>
      <input
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        maxLength={255}
        minLength={8}
        className="w-full border p-2 rounded"
        aria-label="Confirm new password"
        required
      />

      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } cursor-pointer text-white px-4 py-2 rounded`}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
        <Link href="/admin">
          <button
            type="button"
            className="cursor-pointer bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </Link>
      </div>
    </form>
  );
}
