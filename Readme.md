# Issue as of now 02-01-2026
Have to implement webhook to send the clerk user to Neon db

# Issue and resolve for Prisma generate and `@prisma/client`
## Issue
The main error that i encountered is that prisma 7 requires an output path for generated clients, meaning before when we used `npx prisma generate` it used to generate the folder in node_modules but due to the latest files and mainly prisma going back to `provider = "prisma-client"` the files are generated in TS. But you cannot directly use TS files in imports, like in Prisma.ts we did this
```ts
import {PrismaClient}  from '../generated/prisma/client.js';
```
This is because there is onle a Typescript file in `/generated/prisma/` this location, for this reason we need to first compile the folder ourselves and then import it.
## Resolve
To resolve this first we need to make sure that our files are present correctly, and all of our main code like `index.ts` files are in `src/` folder.
Then we will build the folder with tcs. In package.json, add/replace the following script
```json
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
```

Also in your `tsconfig.json` file make sure to have the following

```json
"compilerOptions": {
    
    // Rest of the options

    "rootDir": "src",
    "outDir": "dist",
    
    "include": ["src/**/*"],

    "exclude": [
        "node_modules",
        "dist",
        "prisma",
        "prisma.config.ts"
    ]
}
```

This will basically make a TS compiled folder with the name `dist/` and then we are gonna start `index.js` this will also have the compiled `client.ts` file a.k.a `client.js` which we are using in out `prisma.ts`, so we can continue to use our regular
```ts
import {PrismaClient}  from '../generated/prisma/client.js'; // in the end .js file
```
for development we can just use the regular **npm run dev** command to run the server

### Deployment
Don't forget during deployment, you might encounter the error saying something like cannot find files for client.js, the trick here is to have the prebuild commands, in your package.json add these lines
```json
    "prebuild": "prisma generate",
```
what this is that this command runs before the build command, so if we go in flow

prebuild -> generates prisma generate folder files that are in TS

build -> converts files from TS into JS  so they can run and used internally (in a dist folder)

start -> sttarts the src/index.js file

# Issue and resolve CLERK_WEBHOOK_SIGNING_SECRET 04/01/2025

The error was simple yet it took me kinda some time to figure out, the webhook was not being verified by `verifyWebhook` because the railway was not importing the env variable `CLERK_WEBHOOK_SIGNING_SECRET`. so just like we did with the `DATABASE_URL`. I added that at runtime.
Do note that i cannot test this feature in localhost, this is because for the user creation event it requires svix headers, so i had to install clerk CLI and then send it out.

# using /api
with this push, i am gonna be using /api/webhooks/clerk . I will be changing the api endpoint in clerk webhooks as well for safety and upgrading apis

# Model for user sign-up/creation

```json
Frontend (Next.js)
   ↓
User signs up via Clerk UI
   ↓
Clerk creates user in Clerk system
   ↓
Clerk sends webhook → /webhooks/clerk
   ↓
Backend stores user in YOUR DB
```

The frontend should hit a proctected backend API, not the webhook

# Small Issue and fix 07-01-2025

Got error because i was using express middleware and then defining the routes, another error i got was of `CLERK_PUBLISHABLE_KEY` before in my env variables i had `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` but for express you dont use the keyword `NEXT_PUBLIC` so removed that and it worked

Remaining Issue? I just got to know that there is a way using which we can add a username field in clerk so it has to take a unique username, this will be help full in because then i wont have to make a seperate page. I will implement it, that would also mean that i can get rid of baseUsername and UniqueUsername functions in clerkWebhooks in backend

# Issue and Fixes during Jotai, users.controller store and type management 12-01-2026

So the first issue i encountered was of type management, for this i simply created a types folder and added a user type in it, then i simply exported the file in other components and then i just extended the user with the `User` in the component.

Then came Jotai state management, for this i made a declaration in user.atoms.ts, then i made the writable atoms in the same folder "store/users/" with the name user.controllers.ts. This is basically writable atoms, then using i used axios and useEffect to store the data in the user atoms, so now i dont have to useEffect again in the SideBarChat/ChatMain. I simply imported it, and using the api/Auth.ts i made a api call and then fetchUsers(api) in the useEffect.

If you notice in the useEffect the dependency array is Empty, and that is because when i put the dependency there like this (It caused Loop)

```tsx
  useEffect(() => {
    fetchUsers(api);
  }, [fetchUser, api]);
```

It caused circular dependency which caused an infinite loop, so to avoid that i just kept it empty, so that it only loads up on the initial load. So that is why currently i am using this -:

```tsx
  useEffect(() => {
    fetchUsers(api);
  }, []);
```

Other types were also handled in the user controller, the `isAxiosError`, `instanceof Error` or if they are not in any of these, then simply "Something went wrong"

# Introducing States 12/01/2026
I am implementing a new mechanism, now the user can only chat when the other user accepts the invite.
Hence **A DM can exist in multiple states, Messages are allowed in only one state**

Now the DM has this life cycle -:
```bash
NONE → INVITED → ACTIVE
```
User B accepts the invite, then chat exists, status becomes Active

User B declines the invite, then Delete the chat entirely, set the Invited status to declined.

For this app i am gonna stick with a softer policy, i will allow re invite, and declined will be rarely used

*What is dmkey?*

it guarantees that only 1 DM object exists per user pair, invitations dont duplicate and we can safely upsert.

Every sendMessage endpoint must check for this state, chat.status === ACTIVE

## State = Invited
2 levels of DM lifecycles, `chat.status` and `chatUsers.status` per user, Invited means pending handshake.

A DM exists because one user initiated it, other hasnt accepted it. `invitedByUserId` tells who invited the user.

Chat users:

Inviter → ACCEPTED | cannot invite again, cannot accept (already accepted)

Invitee → PENDING | can accept, cannot re-invite

## Status = Active
Both users have accepted, the chat is fully usable. Both `chatUsers.status = "ACCEPTED"` and `chat.status = "ACTIVE"`. Any future invite attempt will return "DM already exists".

## Status = Declined
invitee said "no". Chat is frozen but not deleated. A new invite can resurrect it. Re-invite behaviour goes back to Invited, Roles reset:

New inviter → ACCEPTED

Other user → PENDING

Backend | state | Inviter sees | 	Invitee sees
NONE	| “Start chat” |	“Start chat”
INVITED |	“Invite sent” (disabled)	| “Accept / Decline”
ACTIVE	| Chat messages	| Chat messages
DECLINED	| “Invite declined / Re-invite”	| “You declined”

# Issues 20/01/2026
So my previous push was done in a rush and ofcourse it has a bunch of things that i had to look over, in the `DeclineDMInvite` there was a bug which was in the final update prisma function, i was updating in the **where** clause and was using **chatId**, which dosent makes sense, so it is now. I was also gone for a few days and was a bit confused as to what i was doing, so i have added some comments as to explain what i was doing. Expect more pushes and code reviews in a few days. 
```ts
        await prisma.$transaction([
            prisma.chatUser.update({
                where: {id: chatUser.id},
                data: {status: "DECLINED"},
            }),
            prisma.chat.update({
                where: {id: chatId},
                data:{ status: "DECLINED"}
            })
        ]);
```

## So what is happening now? (When is DM created?)
We are CREATING A DM WHEN THE INVITE IS SENT, not when it is accepted, we are creating it before.

User A sends Invite: calls inviteToDM -> Creates Chat in DB with status INVITED.

User B loads page: calls getChatId (Lookup) -> Sees chat exists with status INVITED.

User B clicks Accept: calls acceptDMInvite -> Updates Chat status to ACTIVE.

Since we are gonna be sending a GET request for chat, i am gonna have to remove the `req.body` from it, and send the data back to the frontend and a few more changes. I was planning to keep a single file for both GET and POST and that has come to bite me in the end, so i am just gonna keep the Distinction i think. Also gonna rename the function from `getChatId` to `getDMBetweenUsers` because now i wont just return the Id, i will return the whole chat.

Now that i have updated the code base, there is a new thing, since its now a GET, in the *frontend/app/chat/[id]/page.tsx*
i have to use params, and since `params` are god damn promises we have to use `await`, and since i have to use await, the funciton has to be `async` in the function, butttttt we cannot do that becauseeee its a god damn client component, thankfull the most sane thing to do now is to use `use` from react.
so i just did this
```ts
const {id: otherUserId} = use(params);
```

But i am having troubles with Axios now, Oh wait NVM it was because i am just stupid, basically i forgot to add a `/api`, before i was using it WRONG `api`, also i was sending the whole `...chat` in the backend `Chat.ts`, now i am sending -:
```ts
chatId: chat.id, status: chat.status, invitedByUserId: chat.invitedByUserId
```
The mismatch was that backend was sending object from prisma which uses the key `Id`, but the frontend `ChatPage` and `InviteActions` expected `chatId`

While fixing type errors, i got an error for `status = NONE`, in my DB there is no chat status as **NONE** they are as follows

```ts
enum ChatStatus{
  INVITED
  ACTIVE
  DECLINED
}
```

So just for the frontend when it encounters any error i have added an enum as NONE in types/chat.ts

Also make sure that in the `controller/Chat.ts` we are sending `id: chat.id` because that is what matters. just got the bug because frontend expects 
```bash
interface Chat { id: string; status: string }
```
but because i am using `setChat(res.data)` in *chat/[id]/page.tsx* it is a direct copy paste. It takes whatever keys the backend sent and dumps them into your state.
so when i was using `chatId: chatId` the state becomes 
```bash
{ chatId: "123", status: "ACTIVE" }
```
And my code tried to read chat.id, but this object doesnt have id, it has chatId, hence it became undefined.