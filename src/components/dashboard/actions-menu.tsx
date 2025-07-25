"use client"

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
import { MoreHorizontal, Copy, Trash2, Eye, Compass } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ActionsMenuProps {
    onDelete: () => void;
    onView?: () => void;
    onCorrectLocation?: () => void;
    copyItems: { label: string; value: string }[];
}

export function ActionsMenu({ onDelete, onView, onCorrectLocation, copyItems }: ActionsMenuProps) {
    const { toast } = useToast();

    const copyToClipboard = (value: string, label: string) => {
        navigator.clipboard.writeText(value);
        toast({ title: "Copied!", description: `${label} copied to clipboard.` });
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
            {onView && (
                <DropdownMenuItem onClick={onView}>
                    <Eye className="mr-2 h-4 w-4" />
                    View on Web
                </DropdownMenuItem>
            )}
            {onCorrectLocation && (
                 <DropdownMenuItem onClick={onCorrectLocation}>
                    <Compass className="mr-2 h-4 w-4" />
                    Correct Location
                </DropdownMenuItem>
            )}
            {copyItems.map(item => (
                <DropdownMenuItem key={item.label} onClick={() => copyToClipboard(item.value, item.label)}>
                    <Copy className="mr-2 h-4 w-4" />
                    {item.label}
                </DropdownMenuItem>
            ))}
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
                item from our servers.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    );
}
