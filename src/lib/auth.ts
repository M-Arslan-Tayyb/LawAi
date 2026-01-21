import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}user/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok || !data?.succeeded) {
          throw new Error(data?.message || "Invalid credentials");
        }

        /**
         * Backend response:
         * data: {
         *   access_token,
         *   user_id,
         *   user_name,
         *   user_email
         * }
         */
        return {
          id: data.data.user_id.toString(),
          userId: data.data.user_id.toString(),
          name: data.data.user_name,
          email: data.data.user_email,
          accessToken: data.data.access_token,
          tokenType: "Bearer",
          firstName: data.data.user_name?.split(" ")[0] || "",
          lastName: data.data.user_name?.split(" ")[1] || "",
          userName: data.data.user_name,
          userRole: data.data.user_role || "",
          userProfileStatus: data.data.user_profile_status || "",
          profilePicture: data.data.profile_picture || null,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  callbacks: {
    async jwt({ token, user }) {
      // Initial login
      if (user) {
        token.accessToken = user.accessToken;
        token.userId = user.userId;
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;

      session.user = {
        ...session.user,
        userId: token.userId as string,
        name: token.name as string,
        email: token.email as string,
      };

      return session;
    },
  },

  pages: {
    signIn: "/",
    error: "/auth/error",
  },

  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};
