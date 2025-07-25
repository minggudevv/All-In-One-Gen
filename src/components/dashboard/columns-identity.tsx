"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Identity } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActionsMenu } from "./actions-menu";
import { useRouter } from "next/navigation";


export const columns = ({ deleteIdentity, correctIdentityLocation, translations }: { deleteIdentity: (id: string) => void; correctIdentityLocation: (identity: Identity) => void; translations: any }): ColumnDef<Identity>[] => {
  const router = useRouter();
  
  return [
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
    header: translations.dashboard.columns.name,
    cell: ({ row }) => {
      const identity = row.original;
      return `${identity.name.first} ${identity.name.last}`;
    },
  },
  {
    accessorKey: "email",
    header: translations.dashboard.columns.email,
  },
  {
    accessorKey: "phone",
    header: translations.dashboard.columns.phone,
  },
  {
    accessorKey: "location",
    header: translations.dashboard.columns.location,
    cell: ({ row }) => {
      const { location } = row.original;
      return `${location.city}, ${location.country}`;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const identity = row.original;
      
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
            { label: translations.dashboard.actions.copyJson, value: JSON.stringify(identity, null, 2) },
            { label: translations.dashboard.actions.copyEmail, value: identity.email },
            { label: translations.dashboard.actions.copyPhone, value: identity.phone },
          ]}
        />
      );
    },
  },
]};
