import { z } from "zod";

export const likedMemberSchema = z.object({
    targetUserId:z.string(),
    isLiked:z.boolean(),
    userId:z.string()
});


export type LikedMemberSchema = z.infer<typeof likedMemberSchema>


