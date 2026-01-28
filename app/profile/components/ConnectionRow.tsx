"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useResolvedMediaUrl } from "@/app/profile/utils/useResolvedMediaUrl";

type Props = {
  user: {
    id: string;
    username: string;
    title?: string;
    profilePic?: string;
  };
  onClose: () => void;
};

export default function ConnectionRow({ user, onClose }: Props) {
  const router = useRouter();

  const avatarUrl = useResolvedMediaUrl(
    user.profilePic,
    "/default_profile.jpg"
  );

  return (
    <div
      onClick={() => {
        onClose();
        router.push(`/profile/${user.id}`);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClose();
          router.push(`/profile/${user.id}`);
        }
      }}
      role="button"
      tabIndex={0}
      className="group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-[0.98]"
    >
      {/* Avatar with online indicator */}
      <div className="relative flex-shrink-0">
        <div className="relative w-12 h-12 rounded-full ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-200">
          <Image
            src={avatarUrl}
            alt={user.username}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        </div>
        {/* Optional online indicator */}
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
      </div>

      {/* User info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate">
          {user.username}
        </div>
        {user.title && (
          <div className="text-sm text-gray-500 truncate mt-0.5">
            {user.title}
          </div>
        )}
      </div>

      {/* Arrow icon */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
}