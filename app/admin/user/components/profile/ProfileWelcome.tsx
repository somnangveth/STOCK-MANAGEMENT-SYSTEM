"use client";

import { getLoggedInUser } from "@/app/auth/actions";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProfileWelcome() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const res = await getLoggedInUser();
      setProfile(res);
      setLoading(false);
    }
    fetchProfile();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <p className="flex items-center gap-2 text-gray-600">
        <span className="animate-spin">⏳</span> Loading...
      </p>
    );
  }

  // Not logged in
  if (!profile) {
    return <p>Please log in to see your profile...</p>;
  }

  return (
    <div className="flex items-center gap-3">
      <Image
        className="rounded-full"
        src={profile.profile_image || "/default-user.png"}
        alt={profile.name || "User"}
        height={50}
        width={50}
      />
      <h1 className="text-lg font-semibold">Welcome Back, {profile.name}</h1>
    </div>
  );
}
