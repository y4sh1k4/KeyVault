import { prisma } from './prisma';
export async function getSecretsByUserId(userId: number) {

  const project = await prisma.project.findUnique({
    where: { userId },
    include: { secrets: true },
  });

  if (!project) throw new Error('No project found for this user');

  return project.secrets.map(secret => ({
    key: secret.key,
    value: secret.value,
  }));
}