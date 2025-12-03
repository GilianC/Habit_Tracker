import { auth } from '@/auth';
import prisma from '@/app/lib/prisma';
import DashboardHeader from './header';

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export default async function DashboardWrapper({ children }: DashboardWrapperProps) {
  const session = await auth();
  
  let userName: string | undefined;
  let isAdmin = false;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        role: true,
      },
    });

    if (user) {
      userName = user.name;
      isAdmin = user.role === 'admin';
    }
  }

  return (
    <>
      <DashboardHeader userName={userName} isAdmin={isAdmin} />
      {children}
    </>
  );
}
