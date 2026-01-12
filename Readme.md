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