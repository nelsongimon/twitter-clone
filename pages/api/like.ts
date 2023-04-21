import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if(req.method !== "POST" && req.method !== "DELETE") {
        res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { currentUser }  = await serverAuth(req, res);
        const { postId } = req.method === "POST" ? req.body : req.query;

        if(!postId || typeof postId !== "string") {
            throw new Error("Invalid post id");
        }

        const post = await prisma.post.findUnique({
            where: { 
                id: postId 
            }
        });

        if(!post) {
            throw new Error("Post not found");
        }

        let updatedLinkedIds = [...(post.linkedIds || [])];

        if(req.method === "POST") {
            updatedLinkedIds.push(currentUser.id);
            try {
                const post = await prisma.post.findUnique({
                    where: { 
                        id: postId 
                    }
                });
                if(post?.userId) {
                    await prisma.notification.create({
                        data: {
                            body: "Someone liked your tweet",
                            userId: post.userId
                        }
                    });

                    await prisma.user.update({
                        where: {
                            id: post.userId
                        },
                        data: {
                            hasNotifications: true
                        }
                    });
                }

            } catch (error) {
                console.log(error);
            }
        }

        if(req.method === "DELETE") {
            updatedLinkedIds = updatedLinkedIds.filter(id => id !== currentUser.id);
        }

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: {
                linkedIds: updatedLinkedIds
            }
        });

        return res.status(200).json(updatedPost);

    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }


}