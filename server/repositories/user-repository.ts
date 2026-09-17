import { prisma } from "@/lib/prisma";

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function findUserByUsername(username: string) {
  return prisma.user.findUnique({ where: { username } });
}

export function createUser(data: {
  username: string;
  email: string;
  name: string;
  passwordHash: string;
}) {
  return prisma.user.create({ data });
}

export function updateUserBio(id: string, bio: string) {
  return prisma.user.update({ where: { id }, data: { bio } });
}