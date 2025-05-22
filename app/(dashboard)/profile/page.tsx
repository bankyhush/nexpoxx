import React from 'react';
import { Camera, Check } from 'lucide-react';

const ProfileDashboard = () => {
  const profileData = {
    nickname: "ban***@gmail.com",
    userId: "552530027221811262",
    email: "ban***@gmail.com",
    phone: "****624",
    identityVerification: "Verified",
    country: "Nigeria",
    tradingTier: "Level 1",
    linkedAccounts: "--"
  };

  const InfoRow = ({ label, value, action }: { label: string; value: React.ReactNode; action?: string }) => (
    <div className="flex items-center justify-between py-6 border-b border-gray-100">
      <span className="text-gray-900 font-medium">{label}</span>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">{value}</span>
        {action && (
          <button className="px-4 py-1.5 rounded-full border border-gray-300 text-sm hover:border-gray-400 transition-colors">
            {action}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-black">
      {/* Profile Header */}
      <div className="flex items-start gap-6 mb-12">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full" />
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <Camera size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Personal Info Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Personal info</h2>
        <InfoRow label="Nickname" value={profileData.nickname} action="Change" />
        <InfoRow label="User ID" value={profileData.userId} action="Copy" />
      </div>

      {/* Verification Info Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Verification info</h2>
        <InfoRow 
          label="Identity verification" 
          value={
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              <span>{profileData.identityVerification}</span>
            </div>
          } 
          action="View details" 
        />
        <InfoRow label="Country/Region" value={profileData.country} action="View details" />
      </div>

      {/* Account Details Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Account details</h2>
        <InfoRow label="Email" value={profileData.email} action="Change" />
        <InfoRow label="Phone" value={profileData.phone} action="Change" />
        <InfoRow label="Linked accounts" value={profileData.linkedAccounts} action="Link now" />
        <InfoRow label="Trading fee tier" value={profileData.tradingTier} action="View details" />
      </div>
    </div>
  );
};

export default ProfileDashboard;