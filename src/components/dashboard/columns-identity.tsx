"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Identity } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActionsMenu } from "./actions-menu";
import { useRouter } from "next/navigation";


export const columns = ({ deleteIdentity, correctIdentityLocation }: { deleteIdentity: (id: string) => void; correctIdentityLocation: (identity: Identity) => void; }): ColumnDef<Identity>[] => [
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
      const router = useRouter();
      
      const handleViewOnWeb = () => {
        sessionStorage.setItem('view-identity', JSON.stringify(identity));
        router.push('/identity/view');
      };

      return (
        <ActionsMenu
          onDelete={() => deleteIdentity(identity.id!)}
          onView={handleViewOnWeb}
          onCorrectLocation={() => correctIdentityLocation(identity)}
          copyItems={[
            { label: 'Copy JSON', value: JSON.stringify(identity, null, 2) },
            { label: 'Copy Email', value: identity.email },
            { label: 'Copy Phone', value: identity.phone },
          ]}
        />
      );
    },
  },
];
