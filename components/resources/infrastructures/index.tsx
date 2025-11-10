import Image from "next/image";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { infrastructures } from "@/app/data/infrastructures";

export default function InfrastructuresContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Infrastructures</h1>

      <div className="space-y-6">
        {infrastructures.map((infrastructure) => (
          <Card key={infrastructure.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Image on the left */}
              <div className="relative h-64 w-full md:h-auto md:w-1/3 md:min-w-[250px]">
                <Image
                  src={infrastructure.image || "/placeholder.svg"}
                  alt={infrastructure.heading}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content on the right */}
              <div className="flex flex-1 flex-col">
                <CardContent className="flex-1 p-6">
                  <h2 className="mb-3 text-xl font-semibold leading-tight">
                    {infrastructure.heading}
                  </h2>
                  <p className="text-muted-foreground">
                    {infrastructure.description}
                  </p>
                </CardContent>
                <CardFooter className="px-6 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    asChild
                  >
                    <a
                      href={infrastructure.descriptionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      Learn More
                      <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </a>
                  </Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
