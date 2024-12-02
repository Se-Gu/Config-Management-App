import { Parameter } from "@/types/Parameter";
import api from "./api";

export const getParameters = async () => {
  const response = await api.get("/panel");
  return response.data;
};

export const createOrUpdateParameter = async (key: string, data: Parameter) => {
  const response = await api.post("/panel", { key, ...data });
  return response.data;
};

export const deleteParameter = async (key: string) => {
  const response = await api.delete(`/panel/${key}`);
  return response.data;
};
