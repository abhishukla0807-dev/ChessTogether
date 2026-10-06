import type { NextApiRequest, NextApiResponse } from "next";
import { sessionStore, createSession } from "@/lib/sessionStore";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { whiteName, blackName } = req.body as {
      whiteName?: string;
      blackName?: string;
    };

    if (!whiteName || !blackName) {
      return res
        .status(400)
        .json({ error: "whiteName and blackName are required" });
    }

    const session = createSession(whiteName.trim(), blackName.trim());
    sessionStore.set(session.id, session);

    return res.status(201).json(session);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
