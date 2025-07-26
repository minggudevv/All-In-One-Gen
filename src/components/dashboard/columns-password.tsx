"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StoredPassword } from "@/types";
import { format } from "date-fns";
import { ActionsMenu } from "./actions-menu";
import { KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const columns = ({ deletePassword, translations }: { deletePassword: (id: string) => void; translations: any }): ColumnDef<StoredPassword>[] => [
    {
        accessorKey: 'icon',
        header: '',
        cell: () => <KeyRound className="h-5 w-5 text-muted-foreground" />,
        enableSorting: false,
        enableHiding: false,
    },
  {
    accessorKey: "password",
    header: translations.dashboard.columns.password,
    cell: ({ row }) => <span className="font-mono">{row.original.password}</span>,
  },
  {
    accessorKey: 'strength',
    header: translations.dashboard.columns.strength,
    cell: ({ row }) => {
      const p = row.original;
      let strength = 0;
      if (p.length >= 12) strength++;
      if (p.length >= 16) strength++;
      if (p.includeUppercase) strength++;
      if (p.includeNumbers) strength++;
      if (p.includeSymbols) strength++;
      
      const strengthLabels = translations.password.strength;
      if (strength < 2) return <Badge variant="destructive">{strengthLabels.weak}</Badge>;
      if (strength < 4) return <Badge variant="secondary">{strengthLabels.medium}</Badge>;
      return <Badge>{strengthLabels.strong}</Badge>;
    },
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
      const password = row.original;
      return (
        <ActionsMenu
          onDelete={() => deletePassword(password.id!)}
          copyItems={[
            { label: translations.dashboard.actions.copyPassword, value: password.password },
          ]}
        />
      );
    },
  },
];
