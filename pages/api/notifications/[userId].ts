import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if(req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { userId } = req.query;

        if(!userId || typeof userId !== "string") {
            return res.status(400).json({ message: "Invalid userId" });
        }
        
        const notifications = await prisma.notification.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        await prisma.user.update({
            where: {
                id: userId
            }, 
            data: {
                hasNotifications: false,
            }
        });

        return res.status(200).json(notifications);


    } catch (error) {
        console.log(error);
        return res.status(400).json({ error });
    }
}