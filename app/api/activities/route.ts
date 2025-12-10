import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const activities = await prisma.activity.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        icon: true,
        color: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Erreur lors de la récupération des activités:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
