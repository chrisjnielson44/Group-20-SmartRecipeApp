import prisma from "./prisma";
import { authOptions } from "./authOptions";
import { getServerSession } from "next-auth";
import { compare } from "bcrypt";



async function getServerSessionUserId() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    throw new Error("User session not found");
  }
  return session.user.id;
}

export async function getUserData() {
  try {
    const userId = await getServerSessionUserId();
    const data = await prisma.user.findUnique({
      where: { id: userId },
    });
    return data;
  } catch (error) {
    console.error("Error in getUserData:", error);
    throw error;
  }
}

export async function deleteUserData() {
  try {
    const userId = await getServerSessionUserId();
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.error("Error in deleteUserData:", error);
    throw error;
  }
}

export async function CheckUserPassword(password: string) {
  try {
    const userId = await getServerSessionUserId();
    const data = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!data) {
      throw new Error("User not found");
    }
    const passwordCorrect = await compare(password, data.password);
    if (!passwordCorrect) {
      throw new Error("Password is incorrect");
    }
    return passwordCorrect;
  } catch (error) {
    console.error("Error in CheckUserPassword:", error);
    throw error;
  }
}


