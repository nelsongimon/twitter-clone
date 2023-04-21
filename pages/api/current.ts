import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method !== "GET") {
        res.status(405).json({message: "Method not allowed"});
    }

    try {
        const { currentUser } = await serverAuth(req, res);
        return res.status(200).json(currentUser);

    } catch(error) {
        res.status(400).json({message: "Something went wrong"});
    }
}