import { defineStore } from "pinia";
import { Parameter } from "../types/Parameter";
import {
  getParameters,
  createOrUpdateParameter,
  deleteParameter,
} from "../services/parameterService";

export const useParameterStore = defineStore("parameter", {
  state: () => ({
    parameters: [] as Parameter[],
    isLoading: false,
  }),

  actions: {
    async fetchParameters() {
      this.isLoading = true;
      try {
        const data = await getParameters();
        this.parameters = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Failed to fetch parameters:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async createOrUpdateParameter(key: string, parameterData: Parameter) {
      this.isLoading = true;
      try {
        await createOrUpdateParameter(key, parameterData);
        await this.fetchParameters();
      } catch (error) {
        console.error("Failed to create or update parameter:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async deleteParameter(key: string) {
      this.isLoading = true;
      try {
        await deleteParameter(key);
        await this.fetchParameters();
      } catch (error) {
        console.error("Failed to delete parameter:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },

  getters: {
    sortedParameters: (state) => {
      return [...state.parameters].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    },
  },
});
