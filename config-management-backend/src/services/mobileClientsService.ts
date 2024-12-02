import { db } from "../config/firebase";
import { CountrySpecificInformation, MobileConfig } from "../interfaces/Config";
import redisClient from "../config/redisClient";

const CACHE_EXPIRATION = Number(process.env.REDIS_CACHE_EXPIRATION) || 3600;

export const getAggregatedConfig = async (
  country: string | undefined
): Promise<MobileConfig> => {
  try {
    const cacheKey = `aggregatedConfig:${country || "default"}`;

    if (redisClient.isConnected) {
      const cachedResponse = await redisClient.get(cacheKey);
      if (cachedResponse) {
        console.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedResponse) as MobileConfig;
      }
    }

    console.log(`Cache miss for ${cacheKey}. Fetching from Firestore.`);
    const snapshot = await db.collection("configurations").get();
    const aggregatedConfig: MobileConfig = {};

    snapshot.forEach((doc) => {
      const data = doc.data();

      const countrySpecificInfo = data?.countrySpecificInformation || [];
      const countrySpecificValue = countrySpecificInfo.find(
        (info: CountrySpecificInformation) => info.countryName === country
      );

      if (data && data.value !== undefined) {
        aggregatedConfig[doc.id] = countrySpecificValue?.value || data.value;
      }
    });

    if (redisClient.isConnected) {
      await redisClient.set(cacheKey, JSON.stringify(aggregatedConfig), {
        EX: CACHE_EXPIRATION,
      });
    }

    return aggregatedConfig;
  } catch (error) {
    console.error("Error fetching configurations:", error);
    throw new Error("Failed to fetch configurations");
  }
};
