import prisma from './prisma';
import { authOptions } from './authOptions';
import { getServerSession } from 'next-auth';
import { compare } from 'bcrypt';

export async function getUserData() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            throw new Error('User session not found');
        }

        const userid = parseInt(session.user.id);
        if (isNaN(userid)) {
            throw new Error('Invalid user ID');
        }

        const data = await prisma.user.findUnique({
            where: { id: userid },
        });

        return data;
    } catch (error) {
        console.error('Error in getUserData:', error);
        throw error;
    }
}


export async function deleteUserData() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            throw new Error('User session not found');
        }

        const userid = parseInt(session.user.id);
        if (isNaN(userid)) {
            throw new Error('Invalid user ID');
        }

        await prisma.user.delete({
            where: { id: userid },
        });
    } catch (error) {
        console.error('Error in deleteUserData:', error);
        throw error;
    }
}


export async function checkUserPassword(password: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            throw new Error('User session not found');
        }

        const userid = parseInt(session.user.id);
        if (isNaN(userid)) {
            throw new Error('Invalid user ID');
        }

        const data = await prisma.user.findUnique({
            where: { id: userid },
        });

        if (!data) {
            throw new Error('User not found');
        }

        const passwordCorrect = await compare(password, data.password);
        if (!passwordCorrect) {
            throw new Error('Password is incorrect');
        }

        return passwordCorrect;
    } catch (error) {
        console.error('Error in checkUserPassword:', error);
        throw error;
    }
}