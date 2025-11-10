"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { SignIn, SignUp } from "@clerk/nextjs"; // NEW: Import Clerk's components
import { toast } from "sonner"; // Still useful for general notifications

import { cn } from "@/lib/utils";
import { useAuthUserWithRole } from "@/hooks/use-auth-user-with-role";
import { PilotOwnerRequestForm } from "./pilot-owner-request-form";
// No longer need userAuthSchema for form validation as Clerk handles it
// No longer need buttonVariants, Input, Label, Icons directly for the auth forms
// PilotOwnerRequestForm might still be relevant if it's a separate, non-auth-related form

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "login" | "register"; // Explicitly define types
}

export function UserAuthForm({ className, type = "login", ...props }: UserAuthFormProps) {
  const { isLoaded: isClerkAndRoleLoaded, isSignedIn, userRole, isRoleLoading } = useAuthUserWithRole();
  const isLoading = !isClerkAndRoleLoaded || isRoleLoading;
  // Determine if the user has the "PILOTOWNER" role based on the fetched DB data
  const isPilotOwner = userRole === "PILOTOWNER";
  const callbackUrl = isPilotOwner ? "/admin" : "/dashboard";
  console.log({ isLoaded: isClerkAndRoleLoaded, isSignedIn, userRole, isRoleLoading, isPilotOwner });

  // Clerk components handle loading states internally, so isLoading states are often not needed here.
  // However, if you have other custom elements that depend on auth state, you might use Clerk's hooks.

  // You can still use toast if you want to show custom messages based on Clerk's events
  // For example, you can use Clerk's <SignIn afterSignInUrl="..." /> which handles redirects.
  // If you need more granular control, you can use Clerk's useSignIn / useSignUp hooks.

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {/* Conditionally render Clerk's SignIn or SignUp component */}
      {type === "login" ? (
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white", // Example custom styling
              footerActionLink: "text-blue-600 hover:text-blue-700",
            },
          }}
          // Redirect to the dashboard or specified URL after successful sign-in
          fallbackRedirectUrl={callbackUrl}
        // Optional: You can add a custom sign-in URL if needed
        // signInUrl="/sign-in"
        />
      ) : (
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white", // Example custom styling
              footerActionLink: "text-blue-600 hover:text-blue-700",
            },
          }}
          // Redirect to the dashboard or specified URL after successful sign-up
          fallbackRedirectUrl={callbackUrl}
        // Optional: You can add a custom sign-up URL if needed
        // signUpUrl="/sign-up"
        />
      )}

      {/*
        The PilotOwnerRequestForm and the "Or continue with" section
        for Google are typically handled directly by Clerk's components.
        Clerk's SignIn/SignUp components include options for social logins
        (like Google) and email/password fields by default.
        You might keep PilotOwnerRequestForm if it's a completely separate form.
      */}
      {/* If PilotOwnerRequestForm is unrelated to auth, keep it */}
      <PilotOwnerRequestForm disabled={false} />

      {/* The "Or continue with" divider and Google button are usually redundant with Clerk's components */}
      {/*
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          // Clerk's components handle social login clicks internally
          // You would typically not have this button when using Clerk's pre-built UI
          // If you need a custom Google button, you'd use Clerk's useSignIn hook.
          toast.info("Redirecting to Google login via Clerk...");
        }}
        disabled={false}
      >
        <Icons.google className="mr-2 size-4" />{" "}
        Google
      </button>
      */}
    </div>
  );
}
