'use client'
import { DropdownMenuItem, DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import React from "react";


export default function SignOutButton() {
    return (
        <DropdownMenuItem onClick={() => signOut()}>
            Log out
            <DropdownMenuShortcut>⇧⌘X</DropdownMenuShortcut> {/* Adjusted to match the actual keys used */}
        </DropdownMenuItem>
    );
}