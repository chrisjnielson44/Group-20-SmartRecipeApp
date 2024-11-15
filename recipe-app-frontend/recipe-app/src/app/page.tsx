import SignIn from "./SignIn";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";
import Image from "next/image";

export default async function Home() {
  const session = getServerSession(authOptions);
  if (await session) {
    redirect("/dashboard");
  }

  return (
    <main>
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col p-10 text-white lg:flex border-r dark:border-r">
          <div className="absolute inset-0 dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2]" />
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="relative z-20 flex items-center space-x-3 text-lg font-medium">
            <Image src="/carrot.png" height={50} width={50} alt="Carrot"/>
            <p className="text-4xl font-bold text-black dark:text-white">
              Recipe App
            </p>
          </div>
          <div className="relative z-20 flex items-center mt-auto"></div>
        </div>

        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="absolute right-4 top-4 md:right-8 md:top-8">
              <ModeToggle />
            </div>
            <div className="flex flex-col space-y-2 text-center"></div>
            <SignIn />
            <p className="px-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
