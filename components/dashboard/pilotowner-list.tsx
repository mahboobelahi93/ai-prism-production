"use client";

import { useEffect, useState } from "react";
import { getAllPilots } from "@/actions/pilots";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PilotDetailsView from "@/components/pilotdetailsview";

type Pilot = {
  id: string;
  title: string;
  owner: {
    name: string;
    email: string;
  };
};

export default function PilotOwnerList() {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOwner, setExpandedOwner] = useState<string | null>(null);
  const [selectedPilotId, setSelectedPilotId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPilots() {
      try {
        const response = await getAllPilots();

        if (response.success && response.data?.pilots) {
          setPilots(response?.data?.pilots);
        } else {
          console.error(
            "Failed to fetch pilots:",
            response.error || response.message,
          );
          setError(
            response.error || response.message || "Failed to load pilots",
          );
        }
      } catch (err) {
        console.error("Error fetching pilots:", err);
        setError("Failed to load pilots");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPilots();
  }, []);

  const toggleOwnerExpansion = (ownerEmail: string) => {
    setExpandedOwner(expandedOwner === ownerEmail ? null : ownerEmail);
  };

  const groupPilotsByOwner = () => {
    const groupedPilots: { [key: string]: Pilot[] } = {};

    if (!Array.isArray(pilots)) {
      console.error("pilots is not an array:", pilots);
      return groupedPilots;
    }

    pilots.forEach((pilot) => {
      if (!pilot || !pilot?.ownerEmail) {
        console.warn("Invalid pilot structure:", pilot);
        return;
      }

      const ownerEmail = pilot?.ownerEmail;
      if (!groupedPilots[ownerEmail]) {
        groupedPilots[ownerEmail] = [];
      }
      groupedPilots[ownerEmail].push(pilot);
    });

    return groupedPilots;
  };

  if (error) {
    return (
      <Card className="xl:col-span-2">
        <CardContent className="pt-6">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  const groupedPilots = groupPilotsByOwner();

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>PILOT OWNERS</CardTitle>
          <CardDescription>List of all available Pilot Owners.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pilot Owner</TableHead>
              <TableHead>Number of Pilots</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="mt-2 h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-48" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="ml-auto h-6 w-16" />
                      </TableCell>
                    </TableRow>
                  ))
              : Object.entries(groupedPilots).map(
                  ([ownerEmail, ownerPilots]) => (
                    <>
                      <TableRow key={ownerEmail}>
                        <TableCell>
                          <div className="font-medium">
                            {ownerPilots[0]?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {ownerEmail}
                          </div>
                        </TableCell>
                        <TableCell>{ownerPilots.length} pilots</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => toggleOwnerExpansion(ownerEmail)}
                            className="flex items-center justify-end gap-2"
                          >
                            <span>
                              {expandedOwner === ownerEmail ? "Hide" : "View"}
                            </span>
                            {expandedOwner === ownerEmail ? (
                              <ChevronUp className="size-4" />
                            ) : (
                              <ChevronDown className="size-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedOwner === ownerEmail && (
                        <TableRow>
                          <TableCell colSpan={3}>
                            <Table>
                              <TableBody>
                                {ownerPilots.map((pilot) => (
                                  <TableRow key={pilot.id}>
                                    <TableCell>{pilot.title}</TableCell>
                                    <TableCell className="text-right">
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button
                                            variant="link"
                                            className="flex items-center justify-end gap-2"
                                            onClick={() =>
                                              setSelectedPilotId(pilot.id)
                                            }
                                          >
                                            <span>View Details</span>
                                            <ArrowUpRight className="size-4" />
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                                          <PilotDetailsView
                                            pilotId={pilot.id}
                                          />
                                        </DialogContent>
                                      </Dialog>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ),
                )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
