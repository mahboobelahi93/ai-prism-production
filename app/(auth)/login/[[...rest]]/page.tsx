import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/forms/user-auth-form";
import { Icons } from "@/components/shared/icons";

// This ensures the page is rendered dynamically, which is required because
// UserAuthForm uses `useSearchParams` (a dynamic function).
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "absolute left-4 top-4 md:left-8 md:top-8",
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 size-4" />
          Back
        </>
      </Link>
      <div className="hidden h-full bg-muted lg:flex lg:items-center lg:justify-center">
        <div className="flex flex-col items-center space-y-2">
          <img src="/favicon.ico" alt="Logo" className="h-24 w-24" />
          <h2 className="text-2xl font-bold text-foreground">AI-PRISM</h2>
        </div>
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        {/* <div className="flex justify-center">
          <img src="/favicon.ico" alt="Logo" className="h-12 w-12" />
        </div>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div> */}
        <Suspense>
          {/* Explicitly set type="login" for the login page */}
          <UserAuthForm type="login" />
        </Suspense>
        {/* <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p> */}
      </div>
    </div>
  );
}
