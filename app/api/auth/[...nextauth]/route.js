import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import { validateEmailStudent } from "@/server/config/format";
import * as jwt from "jsonwebtoken";
import axios from "axios";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
  }),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt(res) {
      const { token } = res;

      return token;
    },
    async session(res) {
      const { session, token } = res;
      const { user, expires } = session;
      try {
        const mhs = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/portal-login`,
          user
        );
        return {
          expires,
          user: mhs.data.data,
          token: jwt.sign(token, process.env.NEXT_PUBLIC_SECRET_KEY),
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async signIn(res) {
      const { user } = res;
      const isEmailValid = validateEmailStudent(user.email);
      if (!isEmailValid) {
        return false;
      }
      return true;
    },
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
