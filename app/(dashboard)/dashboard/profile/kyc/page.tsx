"use client";

import { useUser } from "@/hooks/useUser";
import BubbleLoader from "@/components/loaders/BubbleLoader";
import { useEffect, useState } from "react";

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
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const file = files?.[0] || null;
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
      setMessage("All fields are required, including certificate type.");
      return;
    }

    const data = new FormData();
    data.append("frontImage", frontFile);
    data.append("backImage", backFile);
    data.append("certificateType", certificateType);

    setUploading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/upload-verification", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Upload failed");

      setMessage("Documents uploaded successfully.");
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading || !user) return <BubbleLoader />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 bg-gray-50 text-black min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Verify Your Identity
        </h1>
        <p className="text-gray-600">
          Please upload a clear photo of the front and back of your
          government-issued ID and select the correct certificate type.
        </p>

        <div className="text-sm bg-[#F8D7DA] py-3 px-4 rounded-md text-red-800 border border-red-200">
          <b> Please submit Following 4 Documents </b>
          <br />
          -Document Front
          <br /> -Document Rear
          <br /> -Selfie with Document near
          <br /> -Proof of Residence
          <br /> Only JPG or PNG or PDF format [upto 4MB per file max]. Ensure
          the images are clear and legible. Accepted formats: JPG, PNG.
        </div>

        {message && (
          <div className="p-3 text-sm rounded bg-blue-50 text-blue-800 border border-blue-200">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Certificate Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certificate Type
            </label>
            <select
              name="certificateType"
              value={formData.certificateType}
              onChange={handleSelectChange}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              required
            >
              <option value="" disabled>
                -- Select Certificate Type --
              </option>
              <option value="passport">Passport</option>
              <option value="national_id">National ID</option>
              <option value="driver_license">Driver’s License</option>
              <option value="voter_card">Voter Card</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Front ID */}
            <div className="border border-gray-300 rounded-lg p-4 text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Front of ID
              </label>
              {previewFront ? (
                <img
                  src={previewFront}
                  className="w-full max-h-60 object-cover rounded-md mb-2"
                />
              ) : user.frontImage ? (
                <img
                  src={user.frontImage}
                  className="w-full max-h-60 object-cover rounded-md mb-2"
                />
              ) : (
                <div className="text-sm text-gray-400 mb-2">
                  No front image uploaded
                </div>
              )}
              <input
                type="file"
                name="frontFile"
                accept="image/*"
                onChange={handleFileChange}
                className="file:px-4 file:py-1 file:bg-blue-600 file:text-white file:rounded-md text-sm"
              />
            </div>

            {/* Back ID */}
            <div className="border border-gray-300 rounded-lg p-4 text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Back of ID
              </label>
              {previewBack ? (
                <img
                  src={previewBack}
                  className="w-full max-h-60 object-cover rounded-md mb-2"
                />
              ) : user.backImage ? (
                <img
                  src={user.backImage}
                  className="w-full max-h-60 object-cover rounded-md mb-2"
                />
              ) : (
                <div className="text-sm text-gray-400 mb-2">
                  No back image uploaded
                </div>
              )}
              <input
                type="file"
                name="backFile"
                accept="image/*"
                onChange={handleFileChange}
                className="file:px-4 file:py-1 file:bg-blue-600 file:text-white file:rounded-md text-sm"
              />
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={uploading}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md transition"
            >
              {uploading ? "Uploading..." : "Submit for Verification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
