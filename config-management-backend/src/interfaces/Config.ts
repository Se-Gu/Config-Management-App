import { UUID } from "crypto";

export interface PanelConfig {
  uuid: string;
  parameterKey: string;
  description: string;
  value: any;
  createdAt: string;
  updatedAt?: string;
  countrySpecificInformation: CountrySpecificInformation[];
  version: number;
}

export interface CountrySpecificInformation {
  countryName: string;
  value: string | number;
}

export interface MobileConfig {
  freeUsageLimit?: number;
  supportEmail?: string;
  privacyPage?: string;
  minimumVersion?: string;
  latestVersion?: string;
  compressionQuality?: number;
  btnText?: string;
  [key: string]: any;
}
