import type { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import type { WebhookEvent } from "@clerk/express";
import {prisma} from "../../db/prisma.js"

const handleWebhook = async(req: Request, res: Response) =>{

    console.log("ENV CHECK:", {
        CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    });


    try{
        const evt = (await verifyWebhook(req)) as WebhookEvent;
        const {id} = evt.data
        const eventType = evt.type

        console.log(`Received webhook with the ID: ${id} and the event type: ${eventType}`)
        console.log(`Webhook payload: ${evt.data}`)

        switch (eventType){
            case "user.created":
                await handleUserCreated(evt);
                break;
            case "user.updated":
                await handleUserUpdate(evt);
                break;
            case "user.deleted":
                await handleUserDeleted(evt);
                break;
            default:
                console.log(`Unhandled event type: ${eventType}`)
        }
        return res.status(200).json({recieved: true})
    } catch(error){
        console.error(`Error verifying the webhook: ${error}`)
        return res.status(400).json({error: `Error verifying the webhook: ${error}`})
    }
}

async function handleUserCreated(evt: WebhookEvent){
    if(evt.type !== "user.created") return;

    const {id, first_name, last_name, username, email_addresses, image_url} = evt.data;

    try{
        const user = await prisma.user.create({
            data: {
                clerkId: id,
                username: username || "",
                firstName: first_name || "",
                lastName: last_name || "",
                email: email_addresses?.[0]?.email_address || "",
                imageUrl: image_url
            }
        });
        console.log(`User created: ${user}`)
    } catch(error){
        console.log(`Error while creating user: ${error}`);
        throw error;
    }

}

async function handleUserUpdate(evt: WebhookEvent){
    if(evt.type !== "user.updated") return;

    const {id, first_name, last_name, username, email_addresses, image_url} = evt.data

    try{
        const user = await prisma.user.update({
            where: {clerkId: id},
            data: {
                username: username || "",
                firstName: first_name || "",
                lastName: last_name || "",
                email: email_addresses?.[0]?.email_address || "",
                imageUrl: image_url
            }
        });
        console.log(`User Updated Successfully: ${user}`)
    } catch(error){
        console.log(`Error while updating the user: ${error}`);
        throw error
    }
}

async function handleUserDeleted(evt: WebhookEvent){
    if(evt.type !== "user.deleted") return

    const {id} = evt.data;

    try{
        const user = await prisma.user.delete({
            where: {clerkId: id}
        })
        console.log(`User deletion successfull: ${user}`)
    } catch(error){
        console.log(`Error while deleating the User: ${error}`);
        throw error
    }

}

export default handleWebhook;