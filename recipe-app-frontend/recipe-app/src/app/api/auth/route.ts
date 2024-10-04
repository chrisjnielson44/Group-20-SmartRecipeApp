import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import prisma from '@/app/lib/prisma';
import { getUserData } from '@/app/lib/data';

export async function POST(request: Request) {
   const body = await request.json();
   const { firstName, lastName, emailAddress, password } = body;

   // Validate the input (e.g., check if email is already in use)
   const existingUser = await prisma.user.findUnique({
      where: { email: emailAddress },
   });

   if (existingUser) {
      return new NextResponse(JSON.stringify({ error: 'Email already in use' }), { status: 400 });
   }

   // Hash the password
   const hashedPassword = await bcrypt.hash(password, 10);

   // Create the user in the database
   const user = await prisma.user.create({
      data: {
         firstName,
         lastName,
         email: emailAddress,
         password: hashedPassword,
         // access_token: null,
         // item_id: null,
         // request_id: null,
         // institution_id: null,
      },
   });

   return new NextResponse(JSON.stringify({ message: 'User created successfully', user }), { status: 200 });
}


export async function GET() {
   const session = await getServerSession(authOptions);
   if (!session) {
      return new NextResponse(JSON.stringify({ error: 'No session found' }), { status: 400 });
   }

   const data = await prisma.user.findMany(
   );
   console.log(data)
   return NextResponse.json(data);

}

// update user info
export async function PUT(request: Request) {
   const session = await getServerSession(authOptions);
   if (!session) {
      return new NextResponse(JSON.stringify({ error: 'No session found' }), { status: 400 });
   }
   const user = await getUserData();

   const body = await request.json();
   const { firstName, lastName, emailAddress, password } = body;

   // Hash the password
   const hashedPassword = await bcrypt.hash(password, 10);

   // Update the user in the database
   const updateUser = await prisma.user.update({
      where: { email: user?.email },
      data: {
         firstName,
         lastName,
         email: emailAddress,
         password: hashedPassword,
      },
   });

   return new NextResponse(JSON.stringify({ message: 'User updated successfully', updateUser }), { status: 200 });
}