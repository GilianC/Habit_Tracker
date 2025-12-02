import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { ThemeProvider } from '@/app/context/ThemeContext';
import { auth } from '@/auth';
import { sql } from '@vercel/postgres';
import { Theme } from '@/app/lib/themes';
 
export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Récupérer le thème de l'utilisateur connecté
  const session = await auth();
  let userTheme: Theme = 'light';
  
  if (session?.user?.email) {
    try {
      const result = await sql`
        SELECT theme FROM users WHERE email = ${session.user.email}
      `;
      if (result.rows.length > 0) {
        userTheme = result.rows[0].theme as Theme;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du thème:', error);
    }
  }

  return (
    <html lang="en" className={`theme-${userTheme}`}>
      <body className={`${inter.className} antialiased theme-${userTheme}`}>
        <ThemeProvider initialTheme={userTheme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
