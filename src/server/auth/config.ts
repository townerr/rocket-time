import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      isManager?: boolean;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    /*CredentialsProvider({
			name: "Credentials",
			credentials: {
				Email: { label: "Email", type: "text", placeholder: "email" },
				password: { label: "Password", type: "password", placeholder: "password"},
			},
			async authorize(credentials) {
				const user = await db.user.findUnique({
					where: { email: credentials.Email as string },
				});
				if (!user) {
					return null;
				} else {
					const bcrypt = require('bcrypt');
					const passwordMatch = await bcrypt.compare(credentials.password as string, user.passwordHash as string);
					if (!passwordMatch) {
						return null;
					} else {
						return user;
					}
				}
			},
		}),*/
    GithubProvider({
      allowDangerousEmailAccountLinking: true,
    }),
    DiscordProvider({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    /*signIn: async ({ user }) => {
			if (user) {
				return true;
			}
			return false;
		},*/
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
} satisfies NextAuthConfig;
