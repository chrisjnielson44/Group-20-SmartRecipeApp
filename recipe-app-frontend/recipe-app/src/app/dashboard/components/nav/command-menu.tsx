"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"

import {
    Calculator,
    CoinsIcon,
    LineChartIcon,
    Settings,
    User,
    MessageCircle
} from "lucide-react"
import { PlusSmallIcon } from "@heroicons/react/20/solid"
import { useEffect, useState } from "react"
import Link from "next/link"
import {Chat} from "./ChatAgent"

export function CommandMenu(props: React.JSX.IntrinsicAttributes & ButtonProps & React.RefAttributes<HTMLButtonElement>) {
    const router = useRouter();
    // const { setTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);


    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.defaultPrevented) {
                return; // Skip if the default action has been prevented
            }

            const isCommandK = (event.key === "k" && (event.metaKey || event.ctrlKey));
            const isSlash = event.key === "/";

            if (isCommandK || isSlash) {
                if (
                    event.target instanceof HTMLElement &&
                    (
                        event.target.isContentEditable ||
                        event.target instanceof HTMLInputElement ||
                        event.target instanceof HTMLTextAreaElement ||
                        event.target instanceof HTMLSelectElement
                    )
                ) {
                    return; // Ignore editable elements
                }

                event.preventDefault(); // Prevent default to stop other handlers
                setOpen((currentOpen) => !currentOpen); // Safely toggle based on current state
            }
        };

        // Add event listener once
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            // Remove event listener on cleanup
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []); // Empty dependency array to ensure setup and cleanup run only once

    const runCommand = (command: any) => {
        setOpen(false);
        command();
    };



    return (
        <>
            <Button
                variant="outline"
                className={cn(
                    "relative w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-5 lg:w-64"
                )}
                onClick={() => setOpen(true)}
                {...props}
            >
                <span className="hidden lg:inline-flex">Type a command or search...</span>
                <span className="inline-flex lg:hidden">Search...</span>
                <kbd className="pointer-events-none text-xs absolute right-[0.3rem] mt-1 top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem>
                            <PlusSmallIcon className="mr-2 h-4 w-4" />
                            <span>Add New Widget</span>
                        </CommandItem>
                        <CommandItem>
                            <LineChartIcon className="mr-2 h-4 w-4" />
                            <span>Trade</span>
                        </CommandItem>
                        <CommandItem>
                            <CoinsIcon className="mr-2 h-4 w-4" />
                            <span>View Crypto</span>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Pages">
                        <Link href={'/dashboard'}>
                            
                            <CommandItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Overview</span>
                                <CommandShortcut>⌘O</CommandShortcut>
                            </CommandItem>
                        </Link>
                        <Link href={'/dashboard/budgeting'}>
                            <CommandItem>
                                <Calculator className="mr-2 h-4 w-4" />
                                <span>Budgeting</span>
                                <CommandShortcut>⌘B</CommandShortcut>
                            </CommandItem>
                        </Link>
                        <Link href={'/dashboard/investments'}>
                            <CommandItem>
                                <LineChartIcon className="mr-2 h-4 w-4" />
                                <span>Investments</span>
                                <CommandShortcut>⌘S</CommandShortcut>
                            </CommandItem>
                        </Link>
                        <Link href={'/dashboard/crypto'}>
                            <CommandItem>
                                <CoinsIcon className="mr-2 h-4 w-4" />
                                <span>Crypto</span>
                                <CommandShortcut>⌘H</CommandShortcut>
                            </CommandItem>
                        </Link>

                    </CommandGroup>

                    <CommandSeparator />
                    <CommandGroup heading="AI Assistant">
                        <CommandItem>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            <span>Chat with AI</span>
                            <CommandShortcut>⌘C</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>


                    <CommandGroup heading="Settings">
                        <Link href={'/dashboard/settings/profile'}>
                        <CommandItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                            <CommandShortcut>⇧⌘P</CommandShortcut>
                        </CommandItem>
                        </Link>


                        <Link href={'/dashboard/settings/account'}>
                       <CommandItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                            <CommandShortcut>⌘S</CommandShortcut>

                        </CommandItem>
                        </Link>
                    </CommandGroup>

                    <CommandSeparator />
                    {/* <CommandGroup heading="Theme">
                        <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
                            <LaptopIcon className="mr-2 h-4 w-4" />
                            System
                        </CommandItem>
                    </CommandGroup> */}
                </CommandList>
            </CommandDialog>
        </>
    )
}
