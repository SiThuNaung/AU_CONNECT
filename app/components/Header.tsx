"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Home,
  UserPlus,
  PlusCircle,
  Bell,
  Search,
  Menu,
  X,
  MessageCircleMore,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

import {
  CONNECT_PAGE_PATH,
  MAIN_PAGE_PATH,
  NOTIFICATION_PAGE_PATH,
  SIGNIN_PAGE_PATH,
  ONBOARD_PAGE_PATH,
  MESSAGES_PAGE_PATH,
  PROFILE_PAGE_PATH,
} from "@/lib/constants";
import { fetchUser, handleLogout } from "../profile/utils/fetchfunctions";
import { useResolvedMediaUrl } from "@/app/profile/utils/useResolvedMediaUrl";
import { useFeedStore } from "@/lib/stores/feedStore";
import { buildSlug } from "@/app/profile/utils/buildSlug";
import PopupModal from "./PopupModal";

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Component to properly resolve profile pic for each search result
const SearchResultItem = ({
  user,
  onClick,
}: {
  user: any;
  onClick: () => void;
}) => {
  const resolvedProfilePic = useResolvedMediaUrl(
    user.profilePic,
    "/default_profile.jpg",
  );

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
    >
      <Image
        src={resolvedProfilePic}
        alt={user.username}
        width={40}
        height={40}
        className="rounded-full object-cover"
      />
      <div className="flex flex-col">
        <div className="font-medium text-gray-900">{user.username}</div>
        {user.title && (
          <div className="text-sm text-gray-500">{user.title}</div>
        )}
      </div>
    </div>
  );
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // 🔍 search state
  const [query, setQuery] = useState("");
  const [openResults, setOpenResults] = useState(false);

  const pathName = usePathname();
  const router = useRouter();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  const { data: searchResults = [], isFetching } = useQuery({
    queryKey: ["search-users", query],
    queryFn: async () => {
      const res = await fetch(
        `/api/connect/v1/search/users?q=${encodeURIComponent(query)}`,
      );
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: query.length >= 2,
  });

  const resolvedProfilePicUrl = useResolvedMediaUrl(
    user?.profilePic,
    "/default_profile.jpg",
  );

  const navBarIndicatedPages = [
    MAIN_PAGE_PATH,
    CONNECT_PAGE_PATH,
    MESSAGES_PAGE_PATH,
    NOTIFICATION_PAGE_PATH,
    PROFILE_PAGE_PATH,
  ];

  const currentPage = navBarIndicatedPages.includes(pathName)
    ? pathName
    : "not-valid-path";

  const hidden = [SIGNIN_PAGE_PATH, ONBOARD_PAGE_PATH].includes(pathName);

  const handleProfileClick = () => {
    if (!user?.slug) return;
    router.push(`/profile/${user.slug}`);
  };

  const scrollFeedToTop = useFeedStore((s) => s.scrollToTop);

  return hidden ? null : (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => {
              if (currentPage === MAIN_PAGE_PATH) {
                scrollFeedToTop();
              } else {
                router.push(MAIN_PAGE_PATH);
              }
            }}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-1"
          >
            <Image
              src="/au-connect-logo.png"
              alt="AU Connect"
              width={40}
              height={40}
              className="object-contain"
            />
            <div className="text-xl font-bold text-black">AU Connect</div>
          </div>

          {/* 🔍 DESKTOP SEARCH */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <div
              className="w-full relative"
              onBlur={() => setTimeout(() => setOpenResults(false), 150)}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpenResults(true);
                }}
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-600 rounded-full focus:outline-none focus:border-red-400"
              />

              {/* 🔧 SEARCH RESULTS */}
              {openResults && query.length >= 2 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  {isFetching ? (
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((u: any) => {
                      const userSlug = u.slug || buildSlug(u.username, u.id);

                      return (
                        <SearchResultItem
                          key={u.id}
                          user={u}
                          onClick={() => {
                            router.push(`/profile/${userSlug}`);
                            setQuery("");
                            setOpenResults(false);
                          }}
                        />
                      );
                    })
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      No results
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: MAIN_PAGE_PATH, icon: Home, label: "Home" },
              { href: CONNECT_PAGE_PATH, icon: UserPlus, label: "Connect" },
              {
                href: MESSAGES_PAGE_PATH,
                icon: MessageCircleMore,
                label: "Messaging",
              },
              {
                href: NOTIFICATION_PAGE_PATH,
                icon: Bell,
                label: "Notification",
              },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  currentPage === item.href
                    ? "text-red-600"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}

            {/* PROFILE */}
            <div className="relative">
              {userLoading ? (
                <Skeleton className="w-10 h-10 rounded-full" />
              ) : (
                <Image
                  src={resolvedProfilePicUrl}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-red-400"
                  onClick={handleProfileClick}
                />
              )}
            </div>

            {/* LOGOUT BUTTON */}
            <button
              onClick={() => setShowModal(true)}
              className="cursor-pointer text-gray-600 hover:text-red-600 transition-colors hover:bg-red-50 p-2 rounded-full cursor-pionter"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-red-600"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* 🔍 MOBILE SEARCH BAR */}
        <div className="md:hidden pb-4 relative">
          <div
            className="relative"
            onBlur={() => setTimeout(() => setOpenResults(false), 150)}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpenResults(true);
              }}
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-600 rounded-full focus:outline-none focus:border-red-400"
            />

            {/* MOBILE SEARCH RESULTS */}
            {openResults && query.length >= 2 && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                {isFetching ? (
                  <div className="px-4 py-3 text-gray-500 text-sm">
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((u: any) => {
                    const userSlug = u.slug || buildSlug(u.username, u.id);

                    return (
                      <SearchResultItem
                        key={u.id}
                        user={u}
                        onClick={() => {
                          router.push(`/profile/${userSlug}`);
                          setQuery("");
                          setOpenResults(false);
                          setMobileMenuOpen(false);
                        }}
                      />
                    );
                  })
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-sm">
                    No results
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {[
              { href: MAIN_PAGE_PATH, icon: Home, label: "Home" },
              { href: CONNECT_PAGE_PATH, icon: UserPlus, label: "Connect" },
              {
                href: MESSAGES_PAGE_PATH,
                icon: MessageCircleMore,
                label: "Messaging",
              },
              {
                href: NOTIFICATION_PAGE_PATH,
                icon: Bell,
                label: "Notification",
              },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                  currentPage === item.href
                    ? "bg-red-100 text-red-600"
                    : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {/* MOBILE PROFILE LINK */}
            <div
              onClick={() => {
                handleProfileClick();
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
                currentPage === PROFILE_PAGE_PATH
                  ? "bg-red-100 text-red-600"
                  : "text-gray-600 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              {userLoading ? (
                <Skeleton className="w-5 h-5 rounded-full" />
              ) : (
                <Image
                  src={resolvedProfilePicUrl}
                  alt="Profile"
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                />
              )}
              <span className="font-medium">Profile</span>
            </div>

            {/* MOBILE LOGOUT */}
            <button
              onClick={() => {
                setShowModal(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        )}
      </div>

      <PopupModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false);
          handleLogout(() => router.push(SIGNIN_PAGE_PATH));
        }}
      />
    </header>
  );
}
