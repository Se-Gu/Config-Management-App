export interface Parameter {
  parameterKey: string;
  description: string;
  value: string | number;
  createdAt: string;
  updatedAt?: string;
  version?: string;
  countrySpecificInformation?: {
    countryName: string;
    value: string | number;
  }[];
}
