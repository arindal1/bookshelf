import { updateUserBio } from "@/server/repositories/user-repository";

const MAX_BIO_LENGTH = 280;

export class BioTooLongError extends Error {
  constructor() {
    super(`Bio must be at most ${MAX_BIO_LENGTH} characters.`);
    this.name = "BioTooLongError";
  }
}

export async function setUserBio(userId: string, bio: string): Promise<{ bio: string }> {
  const trimmed = bio.trim();
  if (trimmed.length > MAX_BIO_LENGTH) throw new BioTooLongError();

  const user = await updateUserBio(userId, trimmed);
  return { bio: user.bio ?? "" };
}