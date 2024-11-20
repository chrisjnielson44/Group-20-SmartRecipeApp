import prisma, { PrismaJsonValue } from "./prisma"; // Import both prisma and the type
import { authOptions } from "./authOptions";
import { getServerSession } from "next-auth";
import { compare } from "bcrypt";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export async function getConversations() {
  try {
    const userId = await getServerSessionUserId();
    const conversations = await prisma.conversation.findMany({
      where: { userId: userId },
      orderBy: { updatedAt: "desc" },
    });
    return conversations;
  } catch (error) {
    console.error("Error in getConversations:", error);
    throw error;
  }
}

export async function createConversation(title: string) {
  try {
    const userId = await getServerSessionUserId();
    const newConversation = await prisma.conversation.create({
      data: {
        title,
        userId: userId,
      },
    });
    return newConversation;
  } catch (error) {
    console.error("Error in createConversation:", error);
    throw error;
  }
}

export async function updateConversationTitle(
    conversationId: string,
    newTitle: string,
) {
  try {
    const userId = await getServerSessionUserId();

    // Verify that the conversation belongs to the user
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!conversation || conversation.userId !== userId) {
      throw new Error("Conversation not found or access denied");
    }

    // Update the conversation and return the updated object
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        title: newTitle,
      },
    });
    return updatedConversation;
  } catch (error) {
    console.error("Error in updateConversationTitle:", error);
    throw error;
  }
}

export async function generateConversationTitle(message: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
              "You are an AI assistant that generates concise, descriptive titles based on a user's initial message. The title should be no more than 5 words and capture the main topic or intent of the message. Do not include any additional text or explanations.",
        },
        {
          role: "user",
          content: message,
        },
        {
          role: "assistant",
          content: "Please provide a suitable title for this conversation.",
        },
      ],
      max_tokens: 10,
    });

    const title = response.choices?.[0]?.message?.content?.trim();
    if (!title) {
      throw new Error("Failed to generate a title");
    }
    return title;
  } catch (error) {
    console.error("Error in generateConversationTitle:", error);
    throw error;
  }
}

export async function getConversationMessages(
    conversationId: string,
    page = 1,
    pageSize = 50,
) {
  try {
    const userId = await getServerSessionUserId();
    const skip = (page - 1) * pageSize;

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
        conversation: { userId: userId },
      },
      orderBy: { createdAt: "asc" }, // Changed to ascending order
      take: pageSize,
      skip: skip,
    });

    return messages; // Removed reverse() since messages are in correct order
  } catch (error) {
    console.error("Error in getConversationMessages:", error);
    throw error;
  }
}

export async function addMessageToConversation(
    conversationId: string,
    content: string,
    role: string,
    reasoning?: string,
) {
  try {
    const userId = await getServerSessionUserId();
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: userId,
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }


    const newMessage = await prisma.message.create({
      data: {
        content,
        role,
        reasoning,
        conversationId: conversationId,
      },
    });

    // Update the conversation's updatedAt timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return newMessage;
  } catch (error) {
    console.error("Error in addMessageToConversation:", error);
    throw error;
  }
}


export async function deleteConversation(conversationId: string) {
  try {
    const userId = await getServerSessionUserId();

    await prisma.$transaction(async (tx) => {
      // Delete all messages associated with the conversation
      await tx.message.deleteMany({
        where: {
          conversationId: conversationId,
        },
      });

      // Delete the conversation
      await tx.conversation.deleteMany({
        where: {
          id: conversationId,
          userId: userId,
        },
      });
    });

    console.log(
        `Conversation ${conversationId} and its messages deleted successfully`,
    );
  } catch (error) {
    console.error("Error in deleteConversation:", error);
    throw error;
  }
}

interface DietaryPreferences {
  dietaryTags: string[];
  excludedIngredients?: string[];
  calorieGoal?: number;
  proteinGoal?: number;
  carbsGoal?: number;
  fatsGoal?: number;
}

export async function getUserPreferences() {
  try {
    const userId = await getServerSessionUserId();
    const preferences = await prisma.userPreference.findUnique({
      where: { userId },
    });
    return preferences;
  } catch (error) {
    console.error("Error in getUserPreferences:", error);
    throw error;
  }
}

export async function updateUserPreferences(preferences: DietaryPreferences) {
  try {
    const userId = await getServerSessionUserId();

    const updatedPreferences = await prisma.userPreference.upsert({
      where: {
        userId,
      },
      update: {
        dietaryTags: preferences.dietaryTags,
        excludedIngredients: preferences.excludedIngredients || [],
        calorieGoal: preferences.calorieGoal,
        proteinGoal: preferences.proteinGoal,
        carbsGoal: preferences.carbsGoal,
        fatsGoal: preferences.fatsGoal,
      },
      create: {
        userId,
        dietaryTags: preferences.dietaryTags,
        excludedIngredients: preferences.excludedIngredients || [],
        calorieGoal: preferences.calorieGoal,
        proteinGoal: preferences.proteinGoal,
        carbsGoal: preferences.carbsGoal,
        fatsGoal: preferences.fatsGoal,
      },
    });

    return updatedPreferences;
  } catch (error) {
    console.error("Error in updateUserPreferences:", error);
    throw error;
  }
}

export async function deleteDietaryPreferences() {
  try {
    const userId = await getServerSessionUserId();
    await prisma.userPreference.delete({
      where: { userId },
    });
  } catch (error) {
    console.error("Error in deleteDietaryPreferences:", error);
    throw error;
  }
}