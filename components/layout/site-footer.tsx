import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { footerLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";

import { NewsletterForm } from "../forms/newsletter-form";
import { Icons } from "../shared/icons";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t", className)}>
      <div className="container max-w-6xl py-6">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
          {/* Left section - EU funding */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <Image
                src="/europe-flag-icon.svg"
                alt="EU Logo"
                width={50}
                height={20}
              />
              <span className="text-xs">Funded by the European Union</span>
            </div>
            <p className="justify-content mx-auto max-w-xs text-xs md:mx-0">
              Horizon Europe - Grant Agreement number 101055589 Funded by the
              European Union. Views and opinions expressed are however those of
              the author(s) only and do not necessarily reflect those of the
              European Union. The European Union cannot be held responsible for
              them. Neither the European Union nor the granting authority can be
              held responsible for them.
            </p>
          </div>

          {/* Middöe section - Logo */}
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/favicon.ico"
              alt="AI-PRISM Logo"
              width={120}
              height={120}
            />
            <span className="mt-2 text-center text-xl font-bold">AI-PRISM</span>
          </div>

          {/* Right section - Social links */}
          <div className="flex flex-col items-center gap-4 md:items-end">
            <div className="flex gap-4">
              <Link
                href="https://x.com/AIPRISMEU"
                aria-label="Twitter/X"
                target="_blank"
              >
                <Icons.twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/ai-prism-eu/"
                aria-label="LinkedIn"
                target="_blank"
              >
                <Icons.linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.youtube.com/@ai-prismEU"
                aria-label="YouTube"
                target="_blank"
              >
                <Icons.youtube className="h-5 w-5" />
              </Link>
              <Link
                href="https://bsky.app/profile/ai-prism.bsky.social"
                aria-label="buttefly"
                target="_blank"
              >
                <Icons.butterfly className="h-5 w-5" />
              </Link>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white"></span>
              <Link
                href="https://aiprism.eu/privacy-policies/"
                className="hover:underline"
              >
                Privacy Policy
              </Link>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white"></span>
              <Link
                href="https://aiprism.eu/terms-of-use/"
                className="hover:underline"
              >
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t py-4">
        <div className="container flex max-w-6xl items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Copyright &copy; {new Date().getFullYear()}. All rights reserved.
          </span>
          {/* <p className="text-left text-sm text-muted-foreground">
            Built by{" "}
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              mickasmt
            </Link>
            . Hosted on{" "}
            <Link
              href="https://vercel.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Vercel
            </Link>
            . Illustrations by{" "}
            <Link
              href="https://popsy.co"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Popsy
            </Link>
          </p> */}

          <div className="flex items-center gap-3">
            {/* <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              <Icons.gitHub className="size-5" />
            </Link> */}
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
