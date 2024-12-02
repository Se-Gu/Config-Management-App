import { db } from "../config/firebase";
import { PanelConfig } from "../interfaces/Config";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../config/redisClient";

const CACHE_KEY = "panel:allConfigs";
const CACHE_EXPIRATION = Number(process.env.REDIS_CACHE_EXPIRATION) || 3600;

export const getAllConfigs = async (): Promise<PanelConfig[]> => {
  try {
    if (redisClient.isConnected) {
      const cachedConfigs = await redisClient.get(CACHE_KEY);
      if (cachedConfigs) {
        console.log("Cache hit for getAllConfigs");
        return Object.values(JSON.parse(cachedConfigs)) as PanelConfig[];
      }
    }

    console.log("Cache miss for getAllConfigs. Fetching from Firestore.");
    const snapshot = await db.collection("configurations").get();
    const configs: Record<string, PanelConfig> = {};

    snapshot.forEach((doc) => {
      configs[doc.id] = doc.data() as PanelConfig;
    });

    if (redisClient.isConnected) {
      await redisClient.set(CACHE_KEY, JSON.stringify(configs), {
        EX: CACHE_EXPIRATION,
      });
    }

    return Object.values(configs);
  } catch (error) {
    console.error("Error fetching configurations:", error);
    throw new Error("Failed to fetch configurations");
  }
};

export const createOrUpdateConfig = async (
  key: string,
  description: string,
  value: any,
  version: number | undefined,
  uuid: string | undefined,
  countrySpecificInformation: { countryName: string; value: string | number }[]
): Promise<{ message: string; version?: number }> => {
  const docRef = db.collection("configurations").doc(key);

  try {
    return await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);

      if (!doc.exists) {
        if (version !== undefined || uuid !== undefined) {
          throw new Error(
            "Version/UUID mismatch: Cannot update a non-existent configuration."
          );
        }

        const newData: PanelConfig = {
          uuid: uuidv4(),
          parameterKey: key,
          description,
          value,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
          countrySpecificInformation: countrySpecificInformation || [],
        };

        transaction.set(docRef, newData);

        if (redisClient.isConnected) {
          await redisClient.del(CACHE_KEY);
          await redisClient.delPattern("aggregatedConfig:*");
        }
        return { message: "Configuration created", version: 1 };
      }

      const currentData = doc.data() as PanelConfig;

      if (uuid === undefined && version === undefined) {
        throw new Error(
          "A configuration with the same parameterKey already exists."
        );
      }

      if (uuid !== currentData.uuid) {
        throw new Error(
          "UUID mismatch: The configuration has been deleted and recreated. Please refresh."
        );
      }

      if (version === undefined || version !== currentData.version) {
        throw new Error("Version mismatch: Please refresh and try again.");
      }

      const mergedCountrySpecificInformation = [
        ...currentData.countrySpecificInformation,
      ];

      countrySpecificInformation.forEach((newCountry) => {
        const existingIndex = mergedCountrySpecificInformation.findIndex(
          (c) => c.countryName === newCountry.countryName
        );
        if (existingIndex > -1) {
          mergedCountrySpecificInformation[existingIndex] = newCountry;
        } else {
          mergedCountrySpecificInformation.push(newCountry);
        }
      });

      const updatedData: PanelConfig = {
        ...currentData,
        description,
        value,
        updatedAt: new Date().toISOString(),
        version: currentData.version + 1,
        countrySpecificInformation: mergedCountrySpecificInformation,
      };

      transaction.set(docRef, updatedData);

      if (redisClient.isConnected) {
        await redisClient.del(CACHE_KEY);
        await redisClient.delPattern("aggregatedConfig:*");
      }

      return { message: "Configuration updated", version: updatedData.version };
    });
  } catch (error: any) {
    console.error("Error in createOrUpdateConfig:", error);

    throw error;
  }
};

export const deleteConfig = async (key: string): Promise<void> => {
  const docRef = db.collection("configurations").doc(key);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error("Configuration already deleted.");
  }

  await docRef.delete();

  if (redisClient.isConnected) {
    await redisClient.del(CACHE_KEY);

    await redisClient.delPattern("aggregatedConfig:*");
  }
};
