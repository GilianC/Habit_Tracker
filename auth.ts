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
    const user = await sql<User[]>`
      SELECT id, name, email, password_hash 
      FROM users 
      WHERE email=${email}
    `;
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
  trustHost: true, // Important pour Vercel
  useSecureCookies: process.env.NODE_ENV === 'production',
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log('🔐 [AUTHORIZE] Tentative de connexion avec:', credentials?.email);
        
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
         if (!parsedCredentials.success) {
          console.log('❌ [AUTHORIZE] Validation échouée:', parsedCredentials.error);
          return null;
        }
        
        const { email, password } = parsedCredentials.data;
        console.log('🔍 [AUTHORIZE] Recherche de l\'utilisateur:', email);
        
        const user = await getUser(email);
        
        if (!user) {
          console.log('❌ [AUTHORIZE] Utilisateur non trouvé');
          return null;
        }
        
        console.log('👤 [AUTHORIZE] Utilisateur trouvé:', { id: user.id, email: user.email });
        
        if (!user.password_hash) {
          console.log('❌ [AUTHORIZE] Pas de password_hash dans la base de données!');
          return null;
        }
        
        console.log('🔐 [AUTHORIZE] Comparaison des mots de passe...');
        console.log('🔐 [AUTHORIZE] Password fourni:', password ? '✓ (existe)' : '✗ (vide)');
        console.log('🔐 [AUTHORIZE] Hash en base:', user.password_hash ? '✓ (existe)' : '✗ (vide)');
        
        // Vérification supplémentaire avant bcrypt.compare
        if (!password || !user.password_hash) {
          console.log('❌ [AUTHORIZE] Mot de passe ou hash manquant');
          return null;
        }
        
        const passwordsMatch = await bcrypt.compare(password, user.password_hash);
        console.log('🔐 [AUTHORIZE] Résultat de la comparaison:', passwordsMatch);
 
        if (passwordsMatch) {
          console.log('✅ [AUTHORIZE] Authentification réussie!');
          return user;
        }
 
        console.log('❌ [AUTHORIZE] Mot de passe incorrect');
        return null;
      },
    }),
  ],
});