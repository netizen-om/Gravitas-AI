"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { z } from "zod";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import Link from "next/link";
import LeftArrow from "@/components/icons/LeftArrow";

// Validation schemas
const profileImageSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      "Only JPG, PNG, and GIF files are allowed"
    ),
});

const usernameSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
});

const bioSchema = z.object({
  bio: z.string().max(500, "Bio must be less than 500 characters"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function UserSettingsPage() {
  const [profileImage, setProfileImage] = useState<string>(
    "/diverse-user-avatars.png"
  );
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState({
    image: false,
    username: false,
    bio: false,
    password: false,
  });

  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("profileImage") as File;

    if (!file) {
      toast.error("Please select an image file");
      return;
    }

    try {
      profileImageSchema.parse({ file });
      setIsLoading((prev) => ({ ...prev, image: true }));

      const response = await fetch("/api/user/update-profileimage", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setProfileImage(result.imageUrl);
        toast.success("Profile image updated successfully!");
      } else {
        toast.error("Failed to update profile image");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred while updating profile image");
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, image: false }));
    }
  };

  const handleUsernameUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      usernameSchema.parse({ username });
      setIsLoading((prev) => ({ ...prev, username: true }));

      const response = await fetch("/api/user/update-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        toast.success("Username updated successfully!");
      } else {
        toast.error("Failed to update username");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred while updating username");
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, username: false }));
    }
  };

  const handleBioUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      bioSchema.parse({ bio });
      setIsLoading((prev) => ({ ...prev, bio: true }));

      const response = await fetch("/api/user/update-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });

      if (response.ok) {
        toast.success("Bio updated successfully!");
      } else {
        toast.error("Failed to update bio");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred while updating bio");
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, bio: false }));
    }
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      passwordSchema.parse({ currentPassword, newPassword, confirmPassword });
      setIsLoading((prev) => ({ ...prev, password: true }));

      const response = await fetch("/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password updated successfully!");
      } else {
        toast.error("Failed to update password");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred while updating password");
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, password: false }));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Link
        href="/dashboard"
        className="flex absolute top-6 left-6 z-10 gap-0 gap-y-0 justify-center items-center px-4 h-10 text-sm font-semibold leading-5 rounded-2xl border-solid ease-in-out cursor-pointer select-none border-[0.8px] border-black border-opacity-0 decoration-neutral-400 duration-[0.2s] outline-neutral-400 text-neutral-400 transition-[color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,visibility,content-visibility,overlay,pointer-events]"
      >
        <LeftArrow />
        Home
      </Link>
      {/* Leave space for drawer at top-left */}
      <div className="pl-16 pt-4">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-gray-400">
              Manage your account preferences and security
            </p>
          </div>

          <div className="space-y-8">
            {/* Profile Image Section */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-white">
                  Update Profile Image
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Upload a new profile picture (JPG, PNG, GIF - max 5MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleImageUpload} className="space-y-4">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-gray-700 text-white">
                        U
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Input
                        type="file"
                        name="profileImage"
                        accept="image/jpeg,image/png,image/gif"
                        className="bg-neutral-800 border-neutral-700 text-white file:bg-neutral-700 file:text-white file:border-0 file:rounded-md file:px-4 file:py-0.5 file:mr-4 hover:bg-neutral-700 focus:ring-2 focus:ring-white/20"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading.image}
                    className="bg-white text-black hover:bg-gray-200 focus:ring-2 focus:ring-white/20"
                  >
                    {isLoading.image ? "Uploading..." : "Update Image"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Separator className="bg-gray-800" />

            {/* Username Section */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-white">Update Username</CardTitle>
                <CardDescription className="text-gray-400">
                  Change your display name (minimum 3 characters)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUsernameUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-white">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 hover:bg-neutral-8 00 focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading.username}
                    className="bg-white text-black hover:bg-gray-200 focus:ring-2 focus:ring-white/20"
                  >
                    {isLoading.username ? "Updating..." : "Update Username"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Separator className="bg-gray-800" />

            {/* Bio Section */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-white">Update Bio</CardTitle>
                <CardDescription className="text-gray-400">
                  Tell others about yourself (max 500 characters)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBioUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="bio" className="text-white">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write something about yourself..."
                      maxLength={500}
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-white/20 min-h-[100px]"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {bio.length}/500 characters
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading.bio}
                    className="bg-white text-black hover:bg-gray-200 focus:ring-2 focus:ring-white/20"
                  >
                    {isLoading.bio ? "Updating..." : "Update Bio"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Separator className="bg-gray-800" />

            {/* Password Section */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-white">Reset Password</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your account password for security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-white">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-white">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 hover:bg-neutral-700 focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-white">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white placeholder:text-neutral-500  focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading.password}
                    className="bg-white text-black hover:bg-gray-200 focus:ring-2 focus:ring-white/20"
                  >
                    {isLoading.password ? "Updating..." : "Reset Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
