"use client";
import Link from "next/link";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";

import { marketingConfig } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { useAuthUserWithRole } from "@/hooks/use-auth-user-with-role";

interface NavBarProps {
  scroll?: boolean;
  large?: boolean;
}

export function NavBar({ scroll = false }: NavBarProps) {
  const scrolled = useScroll(50);
  const router = useRouter();
  const links = marketingConfig.mainNav;
  const selectedLayout = useSelectedLayoutSegment();

  const { isLoaded: isClerkAndRoleLoaded, isSignedIn, userRole, isRoleLoading } = useAuthUserWithRole();
  const isLoading = !isClerkAndRoleLoaded || isRoleLoading;
  // Determine if the user has the "PILOTOWNER" role based on the fetched DB data
  const isPilotOwner = userRole === "PILOTOWNER";

  console.log({ isLoaded: isClerkAndRoleLoaded, isSignedIn, userRole, isRoleLoading, isPilotOwner });

  return (
    <header
      className={`sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all ${scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
        }`}
    >
      <MaxWidthWrapper className="flex h-14 items-center justify-between py-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-1.5">
            <img
              src="/favicon.ico"
              alt="Logo"
              className="h-6 w-6" // Adjust size as needed
            />
            <span className="font-satoshi text-xl font-bold">
              {siteConfig.name}
            </span>
          </Link>

          {links && links.length > 0 ? (
            <nav className="hidden gap-6 md:flex">
              {links.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? "#" : item.href}
                  prefetch={true}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                    item.href.startsWith(`/${selectedLayout}`)
                      ? "text-foreground"
                      : "text-foreground/60",
                    item.disabled && "cursor-not-allowed opacity-80",
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>

        <div className="flex items-center space-x-3">
          {isLoading ? (
            // Show skeleton while Clerk user data or DB role is loading
            <Skeleton className="hidden h-9 w-24 rounded-xl lg:flex" />
          ) : isSignedIn ? (
            // User is signed in and role is loaded
            <Link
              href={
                isPilotOwner ? "/admin" : "/dashboard" // Use the 'isPilotOwner' derived from 'userRole'
              }
              className="hidden md:block"
            >
              <Button
                className="gap-2 px-4"
                variant="default"
                size="sm"
                rounded="xl"
              >
                <span>Dashboard</span>
              </Button>
            </Link>
          ) : (
            // User is not signed in
            <Button
              className="hidden gap-2 px-4 md:flex"
              variant="default"
              size="sm"
              rounded="lg"
              onClick={() => router.push("/login")} // Direct to your Clerk login page
            >
              <span>Sign In</span>
              <Icons.arrowRight className="size-4" />
            </Button>
          )}
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
