"use client";

import { useUser } from "@/hooks/useUser";
import BubbleLoader from "@/components/loaders/BubbleLoader";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // Import the useRouter hook for redirection

export default function VerificationPage() {
  const { data: user, isLoading } = useUser();
  const [formData, setFormData] = useState({
    certificateType: "",
    frontFile: null as File | null,
    backFile: null as File | null,
  });
  const [previewFront, setPreviewFront] = useState<string | null>(null);
  const [previewBack, setPreviewBack] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const router = useRouter(); // Initialize the router for redirection

  const MAX_SIZE_MB = 4;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG or PDF files allowed.");
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File must be smaller than ${MAX_SIZE_MB}MB.`);
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const file = files?.[0] || null;
    if (file && !validateFile(file)) return;

    setFormData((prev) => ({ ...prev, [name]: file }));

    if (name === "frontFile" && file) {
      setPreviewFront(URL.createObjectURL(file));
    } else if (name === "backFile" && file) {
      setPreviewBack(URL.createObjectURL(file));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, certificateType: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { frontFile, backFile, certificateType } = formData;

    if (!frontFile || !backFile || !certificateType) {
      toast.error("All fields are required.");
      return;
    }

    const data = new FormData();
    data.append("frontImage", frontFile);
    data.append("backImage", backFile);
    data.append("certificateType", certificateType);

    setUploading(true);

    try {
      const res = await fetch("/api/dashboard_api/profile/kyc", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.details?.map((d: any) => d.message).join(", ") ||
            result.message ||
            "Failed to upload documents"
        );
      }

      toast.success("Documents uploaded successfully.");
      router.push("/dashboard/profile"); // Redirect user after successful submission
    } catch (err: any) {
      toast.error(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewFront) URL.revokeObjectURL(previewFront);
      if (previewBack) URL.revokeObjectURL(previewBack);
    };
  }, [previewFront, previewBack]);

  // Check if the user is verified, redirect them to the profile page
  useEffect(() => {
    if (user && user.kycStatus === "Verified") {
      router.replace("/dashboard/profile"); // Use replace for faster redirection
    }
  }, [user, router]);

  if (isLoading || !user) return <BubbleLoader />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 min-h-screen bg-gray-50 text-black dark:bg-background/50">
      <div className="bg-white rounded-xl shadow-md p-8 space-y-8 dark:bg-gray-900 dark:text-gray-100">
        <h1 className="text-3xl font-bold ">Identity Verification</h1>
        <p className="text-gray-600">
          Please upload the required documents to verify your identity. Ensure
          all images are clear and legible.
        </p>

        <div className="text-sm bg-yellow-50 py-3 px-4 rounded-md text-yellow-800 border border-yellow-200">
          <b>Documents required:</b>
          <ul className="list-disc ml-6 mt-2">
            <li>Front of ID</li>
            <li>Back of ID</li>
          </ul>
          <p className="mt-2">
            Only JPG, PNG, or PDF files under 4MB each are accepted.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Certificate Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certificate Type
            </label>
            <select
              required
              value={formData.certificateType}
              onChange={handleSelectChange}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="">-- Select Certificate Type --</option>
              <option value="passport">Passport</option>
              <option value="national_id">National ID</option>
              <option value="driver_license">Driver’s License</option>
              <option value="voter_card">Voter Card</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Front ID */}
            <div className="border border-gray-300 rounded-md p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Front of ID
              </label>
              {previewFront && (
                <img
                  src={previewFront}
                  alt="Front preview"
                  className="w-full h-48 object-contain rounded mb-2"
                />
              )}
              <input
                type="file"
                name="frontFile"
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>

            {/* Back ID */}
            <div className="border border-gray-300 rounded-md p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Back of ID
              </label>
              {previewBack && (
                <img
                  src={previewBack}
                  alt="Back preview"
                  className="w-full h-48 object-contain rounded mb-2"
                />
              )}
              <input
                type="file"
                name="backFile"
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={uploading}
              className={`cursor-pointer bg-gray-800 text-white font-medium py-2 px-6 rounded-md hover:bg-gray-900 transition ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? "Uploading..." : "Submit for Verification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
