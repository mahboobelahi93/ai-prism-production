import { useEffect, useState } from "react";
import { getPilotDetailsById } from "@/actions/pilots";
import { Check, User, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
}

export default function UserDialog({ pilotId }: { pilotId: string }) {
  const [userList, setUserList] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDialogOpen && pilotId) {
      const fetchPilotDetails = async () => {
        try {
          setError(null); // Reset error state before fetching
          const data = await getPilotDetailsById(pilotId);
          setUserList(data.length ? data : []); // Set data or empty array if no users
        } catch (error) {
          console.error("Error fetching pilot details:", error);
          setError("Failed to load user data. Please try again later.");
        }
      };
      fetchPilotDetails();
    }
  }, [isDialogOpen, pilotId]);

  const handleAccept = (userId: number) => {
    setUserList(
      userList?.map((user) =>
        user.id === userId ? { ...user, status: "Accepted" } : user,
      ),
    );
  };

  const handleReject = (userId: number) => {
    setUserList(
      userList?.map((user) =>
        user.id === userId ? { ...user, status: "Rejected" } : user,
      ),
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-center p-3 transition-colors hover:bg-gray-50 sm:p-4"
        >
          <User className="size-5 text-gray-600" />
          <span className="sr-only">Users</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>User List for Pilot</DialogTitle>
        </DialogHeader>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : userList.length === 0 ? (
          <p className="text-center text-gray-500">No data available</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userList.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAccept(user.id)}
                        disabled={user.status !== "Pending"}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(user.id)}
                        disabled={user.status !== "Pending"}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
