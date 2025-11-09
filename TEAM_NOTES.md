## Project setup instructions 

Before you run the project, once the projects been cloned locally
you have to run 
`pnpm install`

To run this project you can use the command 
`pnpm run dev`

This project uses pnpm which is similar to npm so any packages u want to install, use the command

`pnpm add package_name`


## Project structure information 

- Most of the project files will be in the `app/`
- In the `app/` folder there is the `api/` folder which is to for api endpoints
- endpoints related to the authentication can be added in the `(auth)/` folder
- The `public/` is for static assets you want to serve as-is at runtime.
- The `lib/` folder is for static helper functions 
- The `prisma/` folder is for defining the model/schema for the projects 
- The `component/` folder is for any reusable react-componenets

## Currently Added Dependencies:

-- default --
next 16.0.1
react 19.2.0
react-dom 19.2.0

-- prisma related -- 
@prisma/client 6.19.0
prisma 6.19.0

-- auth related --
next-auth 4.24.13
@auth/prisma-adapter 2.11.1

### can also use `pnpm list` to check dependencies

## original readme content: 

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.