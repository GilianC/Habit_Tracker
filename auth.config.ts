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
        // Redirection explicite avec URL absolue
        return Response.redirect(new URL('/login', nextUrl.origin));
      }
      
      // Rediriger vers dashboard si déjà connecté et sur page auth
      if (isOnAuthPage && isLoggedIn) {
        return Response.redirect(new URL('/dashboard/home', nextUrl.origin));
      }
      
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;