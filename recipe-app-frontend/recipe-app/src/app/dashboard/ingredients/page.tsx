import React from "react";
import { Metadata } from "next";
import { Nav } from "@/app/dashboard/components/nav/Nav";
import { UserNav } from "@/app/dashboard/components/nav/ProfileAvatar";

export const metadata: Metadata = {
  title: "Ingredients",
  description: "Ingredients",
};

export default async function AnalyticsPage() {
  return (
    <>
      <div>
        <Nav desktopProfile={<UserNav />} mobileNav={<UserNav />} />
      </div>
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-4">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Ingredients</h2>
          </div>
        </div>
      </div>
    </>
  );
}
