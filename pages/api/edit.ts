import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method !== "PATCH") {
        return res.status(401).json({message: "Method not allowed"});
    }
    try {
        const { id, name, username, bio, profileImage, coverImage } = req.body; 

        if(!name || !username) {
            throw new Error("Missing fileds");
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                name,
                username,
                bio,
                profileImage,
                coverImage
            }
        });

        return res.status(200).json(updatedUser);

    } catch(error) {
        console.log(error);
        return res.status(400).json({mesagge: error});
    }
}