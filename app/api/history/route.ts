import { getChatsByUserId } from "@/actions/chat";

import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chats = await getChatsByUserId({ id: currentUser.id! });
  return Response.json(chats);
}
