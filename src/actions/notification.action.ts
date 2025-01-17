"use server"
import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action"

export const getNotifications = async () => {
    try {
        const userId = await getDbUserId();
        if (!userId) throw new Error("user not found");

        const notification = await prisma.notification.findMany({
            where: {
                userId: userId,
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true
                    }
                },
                post: {
                    select: {
                        id: true,
                        content: true,
                        image: true
                    }
                },
                comment: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return notification;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw new Error("Failed to fetch notifications");
    }
}

export const markNotificationAsRead = async (notificationsArray: string[]) => {
    try {
        await prisma.notification.updateMany({
            where: {
                id: {
                    in: notificationsArray
                }
            },
            data: {
                read: true
            }
        })
        return { success: true }
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        return { success: false };
    }
}