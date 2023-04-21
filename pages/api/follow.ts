import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method !== "POST" && req.method !== "DELETE") {
        return res.status(405).json({message: "Method not allowed"});
    }

    try {
        if(req.method === "POST") {
            const { userId } = req.body;
            const { currentUser } = await serverAuth(req, res);

            if(!userId || typeof userId !== "string") {
                throw new Error("Invalid Id");
            }

            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            });

            if(!user) {
                throw new Error("Invalid user");
            }

            const updatedFollowingIds = [...(user.followingIds || [])];
            updatedFollowingIds.push(userId);

            const updatedUser = await prisma.user.update({
                where: {
                    id: currentUser.id
                },
                data: {
                    followingIds: updatedFollowingIds
                }
            });
            return res.status(200).json(updatedUser);
        }

        if(req.method === "DELETE") {
            const { userId } = req.query;
            const { currentUser } = await serverAuth(req, res);

            if(!userId || typeof userId !== "string") {
                throw new Error("Invalid userId");
            }
    
            // if(!currentUserId || typeof currentUserId !== "string") {
            //     throw new Error("Invalid currentUserId");
            // }

            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            });
    
            if(!user) {
                throw new Error("Invalid user");
            }
    
            let updatedFollowingIds = [...(user.followingIds || [])];
            updatedFollowingIds = updatedFollowingIds.filter(id => id !== userId);

            const updatedUser = await prisma.user.update({
                where: {
                    id: currentUser.id
                },
                data: {
                    followingIds: updatedFollowingIds
                }
            });
            return res.status(200).json(updatedUser);
        }


    } catch(error) {
        console.log(error);
        return res.status(400).json(error);
    }
}