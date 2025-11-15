"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex h-screen">
      {/* Left side - Background image + Welcome text */}
      <div className="relative w-1/2 hidden md:block">
        <Image
          src="/au-bg.png" 
          alt="AU background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute bottom-20 left-10 text-white">
          <h1 className="text-4xl font-semibold">Welcome to</h1>
          <h1 className="text-5xl font-bold mt-1">AU Connect</h1>
        </div>
      </div>

      {/* Right side - Form card */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-[90%] max-w-md">
          {/* Logo + Title */}
          <div className="flex flex-col items-center mb-4">
            <Image
              src="/au-connect-logo.png" 
              width={60}
              height={60}
              alt="Logo"
            />

            <p className="mt-2 text-xl font-semibold text-center text-gray-900">
              Connect with fellow AU Students!
            </p>
          </div>

          {/* Email */}
          <div className="mt-6">
            <label className="block mb-1 text-sm font-semibold text-gray-900">
              Email or phone number
            </label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="mt-4">
            <label className="block mb-1 text-sm font-semibold text-gray-900">
              Password
            </label>
            <input
              type="password"
              className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
              placeholder="Enter password"
            />
          </div>

          {/* Remember me & forgot password */}
          <div className="flex justify-between items-center mt-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Sign in button */}
          <button className="w-full mt-5 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition">
            Sign in
          </button>

          {/* Google login */}
          <button
            onClick={() => signIn("google")}
            className="w-full mt-3 bg-black text-white py-2 rounded-md hover:bg-gray-800 flex items-center justify-center gap-2"
          >
            <Image src="/google-icon.png" width={20} height={20} alt="Google" />
            Sign in with Google
          </button>

          {/* Signup link */}
          <div className="mt-6 text-center text-sm">
            Don’t have an account?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Sign up now
            </a>
          </div>

          <p className="text-center text-xs mt-6 text-gray-500">
            © AU Connect Team 2025
          </p>
        </div>
      </div>
    </div>
  );
}
