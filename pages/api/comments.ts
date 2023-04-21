import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { currentUser } = await serverAuth(req, res);
        const { body, postId } = req.body;

        if(!postId || typeof postId !== "string") {
            throw new Error("Invalid post id");
        }

        const comment = await prisma.comment.create({
            data: {
                body,
                userId: currentUser.id,
                postId
            }
        })

        //--------------- Send notification to post owner ---------------
        try {
            const post = await prisma.post.findUnique({
                where: { 
                    id: postId 
                }
            });
            if(post?.userId) {
                await prisma.notification.create({
                    data: {
                        body: "Someone replied your tweet",
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

        return res.status(200).json(comment);
        
    } catch (error) {
        return res.status(400).json({ error });
    }
}