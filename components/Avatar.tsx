import React, { useCallback } from "react";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/router";
import Image from "next/image";

interface AvatarProps {
    userId: string;
    isLarge?: boolean;
    hasBorder?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ 
    userId,
    isLarge,
    hasBorder
}) => {
    const router = useRouter();
    const { data: fetchedUser } = useUser(userId);
    const handleClick = useCallback((event: any) => {
        event.stopPropagation();
        const url = `/users/${userId}`;
        router.push(url);
    }, [userId, router]);
    return (
        <div className={`
            ${hasBorder ? 'border-4 border-black' : ''}
            ${isLarge ? 'w-32 h-32' : 'w-12 h-12'}
            rounded-full
            hover:opacity-90
            transition
            cursor-pointer
            relative
        `}>
            <Image 
                fill
                style={{ objectFit: "cover", borderRadius: "100%"}}
                alt="Avatar"
                onClick={handleClick}
                src={fetchedUser?.profileImage || "/images/default-avatar.png"}
            />
        </div>
    );
}

export default Avatar;