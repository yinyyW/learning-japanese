import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export type User = {
  id: string;
  email: string;
  passwordhash: string;
  emailverified: Timestamp;
  role: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}