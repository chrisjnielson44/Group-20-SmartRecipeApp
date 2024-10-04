import Link from "next/link";
import SignUp from "./SignUp";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = getServerSession(authOptions);
  if (await session) {
    redirect('/dashboard');
  }


  return (
    <main>
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col dark:bg-background p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <p className="text-4xl font-bold">Recipe App</p>
          </div>
          <div className="relative z-20 flex items-center mt-auto">
          </div>
        </div>

        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="absolute right-4 top-4 md:right-8 md:top-8">
              <ModeToggle />
            </div>
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Sign Up
              </h1>
            </div>
            <SignUp />
            <p className="px-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
