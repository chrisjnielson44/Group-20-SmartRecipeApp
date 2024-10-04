import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import React from "react";
import SignOutButton from "./signout";
import { getUserData } from "@/app/lib/data";

export async function UserNav() {

    const data = await getUserData();

    // first letter of first name and last name
    const initials = (`${data?.firstName.charAt(0)}${data?.lastName.charAt(0)}`)

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gray-300 dark:text-black">{`${initials}`}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-2">
                            <p className="text-md font-semibold leading-none">
                                {`${data?.firstName} ${data?.lastName}`}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {`${data?.email}`}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <Link href={'/dashboard/settings/profile'} >
                            <DropdownMenuItem>
                                Profile
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </Link>

                        <Link href={'/dashboard/settings/account'}>
                            <DropdownMenuItem>
                                Settings
                                <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </Link>

                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <SignOutButton />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

    )
}