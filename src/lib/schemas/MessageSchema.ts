
import {z} from 'zod';

export const messageSchema = z.object({
    text:z.string().min(1,{
        message:'Content is required'
    })
})

export type messageSchema = z.infer<typeof messageSchema>