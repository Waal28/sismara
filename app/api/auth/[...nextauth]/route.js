import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import { validateEmailStudent } from "@/server/config/format";
import * as jwt from "jsonwebtoken";
import HttpError from "@/server/config/error";
import MahasiswaService from "@/server/service/mahasiswa";

const handler = NextAuth({
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
      const { name, email, image } = user;
      try {
        if (!name || !email || !image) {
          throw new HttpError("Data tidak lengkap", 400);
        }
        const isEmailValid = validateEmailStudent(email);
        if (!isEmailValid) {
          throw new HttpError("Email tidak valid", 400);
        }
        const mhs = await MahasiswaService.login({ email, name, image });
        return {
          expires,
          user: mhs,
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
});
export { handler as GET, handler as POST };
