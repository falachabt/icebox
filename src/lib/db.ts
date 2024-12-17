
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";


// Learn more about instantiating PrismaClient in Next.js here: https://www.prisma.io/docs/data-platform/accelerate/getting-started

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate());
};



declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;



// import { PrismaClient } from "@prisma/client/edge";
// import { withAccelerate } from "@prisma/extension-accelerate";

// // Function to create a Prisma client with Accelerate
// const createPrismaWithAccelerate = () => {
//   return new PrismaClient().$extends(withAccelerate());
// };

// // Function to create a Prisma client with Pulse
// const createPrismaWithPulse = () => {
//   return new PrismaClient().$extends(
//     withPulse({ apiKey: process.env.PULSE_API_KEY || "" })
//   );
// };

// // Global declaration to avoid multiple instances during development
// declare const globalThis: {
//   prismaGlobal: ReturnType<typeof createPrismaWithAccelerate>;
//   prismaPulse: ReturnType<typeof createPrismaWithPulse>;
// } & typeof global;

// // Prisma Client with Accelerate as the default `db`
// export const db = globalThis.prismaGlobal ?? createPrismaWithAccelerate();

// // Prisma Client with Pulse
// export const prismaPulse =
//   globalThis.prismaPulse ?? createPrismaWithPulse();

// // Save clients globally to prevent re-initialization in development
// if (process.env.NODE_ENV !== "production") {
//   globalThis.prismaGlobal = db;
//   globalThis.prismaPulse = prismaPulse;
// }

// export default db;
