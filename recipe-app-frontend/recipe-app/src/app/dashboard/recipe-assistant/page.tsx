import React from "react";
import { Metadata } from "next";
import { Nav } from "@/app/dashboard/components/nav/Nav";
import { UserNav } from "@/app/dashboard/components/nav/ProfileAvatar";
import { AgentPage } from "./RecAssistPage";

export const metadata: Metadata = {
  title: "Compliance Assistant",
  description: "Chat Assistant for Compliance and Regulatory Information",
};

export default function RecipeAssistant() {
  return (
    <>
      <Nav desktopProfile={<UserNav />} mobileNav={<UserNav />} />
      <AgentPage />
    </>
  );
}
