"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Identity } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { MoreHorizontal, Copy, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ColumnsProps {
    deleteIdentity: (id: string) => void;
}

export const columns = ({ deleteIdentity }: ColumnsProps): ColumnDef<Identity>[] => [
  {
    accessorKey: "picture",
    header: "",
    cell: ({ row }) => {
      const identity = row.original;
      const fallback = identity.name.first.charAt(0) + identity.name.last.charAt(0);
      return (
        <Avatar>
          <AvatarImage src={identity.picture.thumbnail} alt="Profile" />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const identity = row.original;
      return `${identity.name.first} ${identity.name.last}`;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const { location } = row.original;
      return `${location.city}, ${location.country}`;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const identity = row.original;
      const { toast } = useToast();

      const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(identity, null, 2));
        toast({ title: "Copied!", description: "Identity data copied to clipboard." });
      };

      return (
        <AlertDialog>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={copyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy JSON
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </AlertDialogTrigger>
            </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this saved
                    identity from our servers.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteIdentity(identity.id!)} className="bg-destructive hover:bg-destructive/90">
                    Delete
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
