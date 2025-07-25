"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StoredEmail } from "@/types";
import { format } from "date-fns";
import { ActionsMenu } from "./actions-menu";
import { Mail } from "lucide-react";


export const columns = ({ deleteEmail, translations }: { deleteEmail: (id: string) => void, translations: any }): ColumnDef<StoredEmail>[] => [
    {
        accessorKey: 'icon',
        header: '',
        cell: () => <Mail className="h-5 w-5 text-muted-foreground" />,
        enableSorting: false,
        enableHiding: false,
    },
  {
    accessorKey: "email",
    header: translations.dashboard.columns.email,
  },
  {
    accessorKey: "createdAt",
    header: translations.dashboard.columns.savedOn,
    cell: ({ row }) => {
        const { createdAt } = row.original;
        if (!createdAt || typeof createdAt.toDate !== 'function') {
            return translations.dashboard.columns.justNow;
        }
        return format(createdAt.toDate(), "PPpp");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const email = row.original;
      return (
        <ActionsMenu
          onDelete={() => deleteEmail(email.id!)}
          copyItems={[
            { label: translations.dashboard.actions.copyEmail, value: email.email },
          ]}
        />
      );
    },
  },
];
