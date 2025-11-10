export const runtime = "edge";
/*import { NextApiRequest, NextApiResponse } from "next";
import { getPilotDetailsById } from "@/actions/pilots";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;
    const result = await getPilotDetailsById(id);
    if (result.success) {
      return res.status(200).json(result.data);
    }
    return res.status(404).json({ message: result.message });
  }
}

*/
