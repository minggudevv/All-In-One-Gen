"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StoredPassword } from "@/types";
import { format } from "date-fns";
import { ActionsMenu } from "./actions-menu";
import { KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const columns = ({ deletePassword }: { deletePassword: (id: string) => void }): ColumnDef<StoredPassword>[] => [
    {
        accessorKey: 'icon',
        header: '',
        cell: () => <KeyRound className="h-5 w-5 text-muted-foreground" />,
        enableSorting: false,
        enableHiding: false,
    },
  {
    accessorKey: "password",
    header: "Password",
    cell: ({ row }) => <span className="font-mono">{row.original.password}</span>,
  },
  {
    accessorKey: 'strength',
    header: 'Strength',
    cell: ({ row }) => {
      const p = row.original;
      let strength = 0;
      if (p.length >= 12) strength++;
      if (p.length >= 16) strength++;
      if (p.includeUppercase) strength++;
      if (p.includeNumbers) strength++;
      if (p.includeSymbols) strength++;

      if (strength < 2) return <Badge variant="destructive">Weak</Badge>;
      if (strength < 4) return <Badge variant="secondary">Medium</Badge>;
      return <Badge>Strong</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Saved On",
    cell: ({ row }) => {
        const { createdAt } = row.original;
        if (!createdAt || typeof createdAt.toDate !== 'function') {
            return "Just now";
        }
        return format(createdAt.toDate(), "PPpp");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const password = row.original;
      return (
        <ActionsMenu
          onDelete={() => deletePassword(password.id!)}
          copyItems={[
            { label: 'Copy Password', value: password.password },
          ]}
        />
      );
    },
  },
];
