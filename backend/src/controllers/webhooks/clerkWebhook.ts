import type { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import type { WebhookEvent } from "@clerk/express";
import {prisma} from "../../db/prisma.js"

const handleWebhook = async(req: Request, res: Response) =>{
    try{
        const evt = (await verifyWebhook(req)) as WebhookEvent;
        const {id} = evt.data
        const eventType = evt.type

        console.log(`Received webhook with the ID: ${id} and the event type: ${eventType}`)
        console.log(`Webhook payload: `, evt.data)

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

    const {id: clerkId, first_name, last_name, username: clerkUsername, email_addresses, image_url} = evt.data;

    const email =
        email_addresses?.find(
            e => e.id === evt.data.primary_email_address_id
        )?.email_address;

    if (!email) {
        throw new Error("No email in Clerk webhook");
    }

    const baseUsername = clerkUsername ?? generateBaseUsername(email, first_name || "")
    
    const uniqueUsername = await generateUniqueUsername(baseUsername)

    try{
        const user = await prisma.user.upsert({
            where: {clerkId},
            update: {},
            create:{
                clerkId,
                email,
                username: uniqueUsername,
                firstName: first_name ?? "",
                lastName: last_name ?? "",
                imageUrl: image_url ?? "",
            }
        });
        console.log(`User created: `, JSON.stringify(user))
    } catch(error){
        console.log(`Error while creating user: ${error}`);
        throw error;
    }

}

async function handleUserUpdate(evt: WebhookEvent){
    if(evt.type !== "user.updated") return;

    const {id: clerkId, first_name, last_name, username: clerkUsername, email_addresses, image_url, primary_email_address_id} = evt.data

    const email =
        email_addresses?.find(
            e => e.id === primary_email_address_id
        )?.email_address;

    if (!email) {
        throw new Error("No email in user.updated webhook");
    }

    const existingUser = await prisma.user.findUnique({
        where: { clerkId },
        select: { username: true },
    });

    if (!existingUser) {
        throw new Error(`User with clerkId ${clerkId} not found`);
    }

    let finalUsername = existingUser.username;

    if (!finalUsername) {
        const baseUsername =
        clerkUsername ??
        generateBaseUsername(email, first_name ?? "");

        finalUsername = await generateUniqueUsername(baseUsername);
    }

    try{
        const user = await prisma.user.update({
            where: {clerkId},
            data: {
                email,
                username: finalUsername,
                firstName: first_name ?? "",
                lastName: last_name ?? "",
                imageUrl: image_url ?? "",
            }
        });
        console.log(`User Updated Successfully: `, JSON.stringify(user))
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

function generateBaseUsername(email: string, firstName?: string){
    if(firstName) return firstName.toLowerCase();
    return email.split("@")[0].toLowerCase()
}

async function generateUniqueUsername(base: string){
    let username = base;
    let suffix = 0;

    while(true){
        const existing = await prisma.user.findUnique({
            where: {username},
            select: {id: true},
        });
        if(!existing) return username
        suffix++;
        username = `${base}${suffix}`;
    }
}

export default handleWebhook;