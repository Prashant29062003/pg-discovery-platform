"use server";

import { requireOwnerAccess } from "@/lib/auth/owner-guard";
import BookingsPageContent from "./content";

export default async function BookingsPage() {
  await requireOwnerAccess();

  return <BookingsPageContent />;
}
