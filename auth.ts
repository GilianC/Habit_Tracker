import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
  
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    console.log('🔍 [AUTH] User found:', user[0] ? { 
      id: user[0].id, 
      email: user[0].email, 
      hasPasswordHash: !!user[0].password_hash 
    } : 'NO USER');
    return user[0];
  } catch (error) {
    console.error('❌ Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
         if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          
          if (!user) {
            console.log('❌ User not found');
            return null;
          }
          
          if (!user.password_hash) {
            console.log('❌ No password_hash field!');
            return null;
          }
          
          console.log('🔐 Comparing passwords...');
          const passwordsMatch = await bcrypt.compare(password, user.password_hash);
          console.log('🔐 Match result:', passwordsMatch);
 
          if (passwordsMatch) {
            console.log('✅ Authentication successful!');
            return user;
          }
        }
 
        console.log('❌ Invalid credentials');
        return null;
      },
    }),
  ],
});