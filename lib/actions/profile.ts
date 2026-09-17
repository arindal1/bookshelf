"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { BioTooLongError, setUserBio } from "@/server/services/profile-service";

type UpdateBioResult = { ok: true } | { ok: false; error: string };

export async function updateBio(bio: string): Promise<UpdateBioResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "You must be signed in to update your bio." };
  }

  try {
    await setUserBio(session.user.id, bio);
  } catch (err) {
    if (err instanceof BioTooLongError) {
      return { ok: false, error: err.message };
    }
    return { ok: false, error: "Could not update bio. Try again." };
  }

  if (session.user.username) {
    revalidatePath(`/profile/${session.user.username}`);
  }
  return { ok: true };
}