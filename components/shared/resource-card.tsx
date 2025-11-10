import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface ResourceCardProps {
  id: number;
  name: string;
  image: string;
  description: string;
  fullDescription?: string; // Make this optional as it's not displayed in the card
  detailsLink?: string;
  documentationUrl?: string;
}

export function ResourceCard({
  id,
  name,
  image,
  description,
  detailsLink,
  documentationUrl,
}: ResourceCardProps) {
  return (
    <Card className="flex p-4">
      <div className="mr-4 flex-shrink-0">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={80}
          height={80}
          className="rounded-md object-cover"
        />
      </div>
      <div className="flex flex-grow flex-col">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-4">
          <p className="line-clamp-10 text-sm text-muted-foreground">
            {description}
          </p>
        </CardContent>
        <CardFooter className="mt-auto p-0">
          {/* <Link href={detailsLink} passHref>
            <Button variant="outline" size="sm" className="mr-2">
              Details
            </Button>
          </Link> */}
          <Link
            href={documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm">Documentation</Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
}
