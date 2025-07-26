import { type BasicIdentity } from "@/ai/flows/enhance-identity-generation";
import { FieldValue } from "firebase/firestore";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {
  username: string;
}

export type Identity = BasicIdentity & {
  id?: string;
  enhancedBackstory?: string;
  createdAt?: FieldValue;
};

export interface StoredEmail {
    id?: string;
    email: string;
    createdAt?: FieldValue;
}

export interface StoredPassword {
    id?: string;
    password: string;
    length: number;
    includeUppercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
    createdAt?: FieldValue;
}

export interface StoredCredential {
    id?: string;
    service: string;
    email: string;
    encryptedData: string;
    iv: string;
    createdAt?: FieldValue;
}
