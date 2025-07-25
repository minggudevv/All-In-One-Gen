import { type BasicIdentity } from "@/ai/flows/enhance-identity-generation";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {}

export type Identity = BasicIdentity & {
  id?: string;
  enhancedBackstory?: string;
};
