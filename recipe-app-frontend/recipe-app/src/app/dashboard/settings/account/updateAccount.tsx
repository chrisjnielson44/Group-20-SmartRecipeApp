"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    firstName: z.string().refine(value => !/\d/.test(value), {
      message: "First name must not contain numbers",
    }),
    lastName: z.string().refine(value => !/\d/.test(value), {
      message: "Last name must not contain numbers",
    }),
    password: z.string()
      .min(3)
      .refine(value => /[A-Z]/.test(value), {
        message: "Password must contain at least one capital letter",
      })
      .refine(value => /[0-9]/.test(value), {
        message: "Password must contain at least one number",
      })
      .refine(value => /[^a-zA-Z0-9]/.test(value), {
        message: "Password must contain at least one special character",
      }),
    passwordConfirm: z.string(),
  })
  .refine(
    (data) => {
      return data.password === data.passwordConfirm;
    },
    {
      message: "Passwords do not match",
      path: ["passwordConfirm"],
    }
  );

export default function UpdateAccount() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });


  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/api/auth/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error('The email address is already in use.');

      } else {
        const data = await response.json();
        console.log(data);
        // Handle successful sign-up (e.g., redirect to a different page)
        toast.success('Sign up successful!');
        // Add pause to allow toast to display
        await new Promise(resolve => setTimeout(resolve, 2000));
        router.push('/');
      }
    } catch (error) {
      console.error('There was an error!', error);
      toast.error('An unexpected error occurred.');
    }

  };

  return (
    <main className="flex flex-col items-center justify-between">
      <Toaster />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-lg w-full flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit" className="w-full text-white">
            Submit
          </Button>
        </form>
      </Form>
    </main>
  );
}