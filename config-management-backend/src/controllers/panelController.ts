import { Request, Response } from "express";
import * as panelService from "../services/panelService";

export const getAllConfigs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const configs = await panelService.getAllConfigs();
    res.status(200).json(configs);
  } catch (error) {
    console.error("Error fetching configurations:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const createOrUpdateConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { key, description, value, version, uuid, countrySpecificInformation } =
    req.body;

  if (!key || value === undefined || !description) {
    res.status(400).json({
      statusCode: 400,
      message: "Invalid request body",
      details: "Ensure 'key', 'description', and 'value' are provided.",
    });
    return;
  }

  try {
    const result = await panelService.createOrUpdateConfig(
      key,
      description,
      value,
      version,
      uuid,
      countrySpecificInformation
    );
    res.status(200).json({
      statusCode: 200,
      message: "Configuration saved successfully.",
      data: result,
    });
  } catch (error: any) {
    if (error.message.includes("UUID mismatch")) {
      res.status(409).json({
        statusCode: 409,
        message:
          "UUID mismatch: The configuration has been deleted and recreated.",
        details: "Please refresh your data and try again.",
      });
    } else if (error.message.includes("Version mismatch")) {
      res.status(409).json({
        statusCode: 409,
        message: "Version mismatch: Please refresh and try again.",
        details: "The version you provided does not match the current version.",
      });
    } else if (
      error.message.includes("A configuration with the same parameterKey")
    ) {
      res.status(400).json({
        statusCode: 400,
        message: "A configuration with the same parameterKey already exists.",
        details: "The provided key is already in use. Choose a unique key.",
      });
    } else {
      console.error("Error updating configuration:", error);
      res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        details: error.message || "An unexpected error occurred.",
      });
    }
  }
};

export const deleteConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { key } = req.params;

  try {
    await panelService.deleteConfig(key);
    res.status(200).json({
      statusCode: 200,
      message: "Configuration deleted successfully.",
    });
  } catch (error: any) {
    if (error.message.includes("already deleted")) {
      res.status(204).send();
    } else {
      console.error("Error deleting configuration:", error);
      res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        details: error.message || "An unexpected error occurred.",
      });
    }
  }
};
