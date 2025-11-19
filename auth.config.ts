import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAuthPage = nextUrl.pathname === '/login' || nextUrl.pathname === '/signup';
      
      // Protéger le dashboard - rediriger vers login si non connecté
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      
      // Permettre l'accès aux pages login/signup même si connecté (pour tests)
      // En production, vous pouvez décommenter cette ligne pour rediriger vers dashboard
      // if (isOnAuthPage && isLoggedIn) {
      //   return Response.redirect(new URL('/dashboard/home', nextUrl));
      // }
      
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;