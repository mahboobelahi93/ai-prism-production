"use client";

import { useEffect, useState } from "react";
import { getUserRoleFromDb } from "@/actions/get-user-role";
import { useUser } from "@clerk/nextjs";
import { UserRole } from "@prisma/client"; // Assuming you have this enum in your Prisma schema

// Define the shape of the data returned by your custom hook
interface AuthUserWithRole {
  isLoaded: boolean;
  isSignedIn?: boolean;
  user: any;
  userRole: UserRole | null;
  isRoleLoading: boolean;
}

/**
 * Custom hook to get Clerk user data along with their role fetched from the database.
 * This hook manages loading states for both Clerk and the database fetch.
 *
 * @returns An object containing Clerk's user data, the user's role from the DB,
 * and loading/signed-in statuses.
 */
export function useAuthUserWithRole(): AuthUserWithRole {
  const { isLoaded: isClerkLoaded, isSignedIn, user } = useUser();

  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      // Only fetch role if Clerk user data is loaded and user is signed in
      if (isClerkLoaded && isSignedIn && user?.id) {
        setIsRoleLoading(true);
        try {
          const role = await getUserRoleFromDb(user.id);
          setUserRole(role);
        } catch (error) {
          console.error("Failed to fetch user role from DB in hook:", error);
          setUserRole(null); // Set to null on error
        } finally {
          setIsRoleLoading(false);
        }
      } else if (isClerkLoaded && !isSignedIn) {
        // If Clerk is loaded but user is not signed in, reset role and loading
        setUserRole(null);
        setIsRoleLoading(false);
      }
    };

    fetchRole();
  }, [isClerkLoaded, isSignedIn, user?.id]); // Re-run effect when Clerk user state changes

  return {
    isLoaded: isClerkLoaded, // Overall loading for Clerk
    isSignedIn,
    user,
    userRole,
    isRoleLoading, // Loading specifically for the role fetch
  };
}
