import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { phoneNumber, password } = req.body;
    try {
      const response = await axios.post("http://localhost:4000/auth/signin", {
        phoneNumber,
        password,
      });

      // Forward the response from the external API to the client
      res.status(response.status).json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Forward the error response from the external API to the client
        res.status(error.response.status).json(error.response.data);
      } else {
        // Handle other errors (e.g., network issues)
        res.status(500).json({ message: "An error occurred" });
      }
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
