import { Request, Response } from "express";
import * as mobileClientsService from "../services/mobileClientsService";

export const getAggregatedConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { country } = req.query;

  try {
    const aggregatedConfig = await mobileClientsService.getAggregatedConfig(
      country as string
    );
    res.status(200).json(aggregatedConfig);
  } catch (error) {
    console.error("Error fetching aggregated configuration:", error);
    res.status(500).send("Internal Server Error");
  }
};
