import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn, nFormatter } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export default async function HeroLanding() {
  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-24">
      <div className="container flex max-w-screen-md flex-col items-center gap-5 text-center">
        {/* <Link
          href="https://next-saas-stripe-starter.vercel.app/"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "xl" }),
            "px-4",
          )}
          target="_blank"
        >
          <span className="mr-3">🎉</span> Free Next SaaS Starter Here!
        </Link> */}

        <h1 className="text-balance font-satoshi text-[40px] font-black leading-[1.15] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.15]">
          {/* Next.js Template with{" "} */}
          <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text font-orbitron text-transparent">
            AI-PRISM ALLIANCE
          </span>
        </h1>

        <p className="max-w-2xl text-balance font-orbitron text-muted-foreground sm:text-lg">
          <b>Open access</b> network portal <br />
          Giving access to our infrastructure remotely for certification and
          training, and its network of open Access pilots.!
        </p>

        <div className="flex justify-center space-x-2">
          <Link
            href="https://aiprism.eu/ai-alliance/"
            rel="noreferrer"
            target="_blank"
            prefetch={true}
            className={cn(
              buttonVariants({ rounded: "xl", size: "lg" }),
              "gap-2 px-5 text-[15px]",
            )}
          >
            <span>Learn More</span>
            <Icons.arrowRight className="size-4" />
          </Link>
          {/* <Link
            href="#"
            // target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({
                variant: "outline",
                rounded: "xl",
                size: "lg",
              }),
              "px-4 text-[15px]",
            )}
          >
            <Icons.laptop className="mr-2 size-4" />
            <p>
              Live Demo
            </p>
          </Link> */}
        </div>
      </div>
    </section>
  );
}
