"use server"
import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action"
import { revalidatePath } from "next/cache";

export const createPost = async (content: string, imageUrl: string) => {
    try {
        const userId = await getDbUserId();
        if (!userId) return { success: false, message: "failed to create post" }
        const post = await prisma.post.create({
            data: {
                content,
                image: imageUrl,
                authorId: userId
            },

        });

        revalidatePath("/");
        return { success: true, post };
    } catch (error) {
        console.error(error)
        return { success: false, message: "failed to create post" }
    }
}

export const getPosts = async () => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: "desc"
            }
            ,
            include: {
                author: {
                    select: {
                        name: true,
                        image: true,
                        username: true,
                        id: true

                    }
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                name: true,
                                image: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                },
                likes: {
                    select: {
                        userId: true,
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                }

            }
        })
        return posts;
    } catch (error) {
        console.log(error);
        return []
    }
}

export const toggleLikes = async (postId: string) => {
    try {
        const userId = await getDbUserId()
        if (!userId) return;
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: userId,
                    postId: postId
                }
            }
        })
        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
            , select: {
                authorId: true
            }
        })
        if (!post) throw new Error("there is no such post");

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId
                    }
                }

            })

        } else {
            await prisma.$transaction([
                prisma.like.create({
                    data: {
                        userId,
                        postId,
                    }
                }),
                ...(userId !== post.authorId ? [prisma.notification.create({
                    data: {
                        type: "LIKE",
                        userId: post.authorId,
                        creatorId: userId,
                        postId,
                    }
                })] : []),
            ])
        }
        revalidatePath("/");
        return { success: true }
    } catch (error) {
        console.log(error);
        return { success: false, message: "post did not liked by anyone" }
    }
}

export async function createComment(postId: string, content: string) {
    try {
        const userId = await getDbUserId();

        if (!userId) return;
        if (!content) throw new Error("Content is required");

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { authorId: true },
        });

        if (!post) throw new Error("Post not found");

        // Create comment and notification in a transaction
        const [comment] = await prisma.$transaction(async (tx) => {
            // Create comment first
            const newComment = await tx.comment.create({
                data: {
                    content,
                    authorId: userId,
                    postId,
                },
            });

            // Create notification if commenting on someone else's post
            if (post.authorId !== userId) {
                await tx.notification.create({
                    data: {
                        type: "COMMENT",
                        userId: post?.authorId,
                        creatorId: userId,
                        postId,
                        commentId: newComment.id,
                    },
                });
            }

            return [newComment];
        });

        revalidatePath(`/`);
        return { success: true, comment };
    } catch (error) {
        console.error("Failed to create comment:", error);
        return { success: false, error: "Failed to create comment" };
    }
}

export const deletePost = async (postId: string) => {
    try {
        const userId = await getDbUserId();
        if (!userId) throw new Error("userId not found");

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            },
            select: {
                authorId: true
            }
        })
        if (!post) throw new Error("there is no post ");
        if (post?.authorId !== userId) throw new Error("unauthorized user");

        await prisma.post.delete({
            where: { id: postId }
        })
        revalidatePath("/");
        return { success: true, message: "successfully deleted the post" };


    }
    catch (error) {
        console.error("Failed to delete post:", error);
        return { success: false, error: "Failed to delete post" };
    }
}

