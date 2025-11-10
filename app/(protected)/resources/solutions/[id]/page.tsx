import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { solutions } from "@/app/data/solutions";

export default function SolutionDetails({
  params,
}: {
  params: { id: string };
}) {
  const solution = solutions.find((s) => s.id === Number.parseInt(params.id));

  if (!solution) {
    notFound();
  }

  const { name, description, fullDescription, documentationUrl } = solution;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">{solution.name}</h1>
      {/* <div className="mb-6">
        <Image
          src={solution.image || "/placeholder.svg"}
          alt={solution.name}
          width={400}
          height={300}
          className="rounded-lg"
        />
      </div> */}
      <p className="mb-6 text-lg">{solution.fullDescription}</p>
      <div className="space-x-4">
        {documentationUrl && ( // Only show documentation button if URL exists
          <Button asChild>
            <Link
              href={solution.documentationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Documentation
            </Link>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href="/resources/solutions">Back to Solutions</Link>
        </Button>
      </div>
    </div>
  );
}
