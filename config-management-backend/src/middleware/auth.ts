import { Request, Response, NextFunction } from "express";
import { admin } from "../config/firebase";

export const validateFirebaseIdToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    res.status(401).send("Authorization token is required");
    return;
  }

  try {
    await admin.auth().verifyIdToken(idToken);
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    res.status(403).send("Unauthorized");
  }
};

export const validateApiToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiToken = req.headers["x-api-key"];
  if (apiToken !== process.env.PREDEFINED_API_TOKEN) {
    res.status(403).send("Invalid API token");
    return;
  }
  next();
};
