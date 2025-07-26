// This is a simplified client-side encryption helper.
// In a real-world, high-security application, encryption should be
// handled server-side with a robust key management system.

const ENCRYPTION_KEY_NAME = 'app-enc-key';

// --- Key Generation and Storage ---

// Derives a key from a user's password.
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// Generates a new salt and derives a key, then stores it.
export async function generateAndStoreKey(password: string): Promise<void> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password, salt);
  const exportedKey = await window.crypto.subtle.exportKey('jwk', key);

  // In a real app, the salt should be stored with the user's profile in the DB.
  // For simplicity here, we store salt with the key in local storage.
  localStorage.setItem(ENCRYPTION_KEY_NAME, JSON.stringify({ key: exportedKey, salt: Array.from(salt) }));
}

// Retrieves the key from local storage.
async function getStoredKey(): Promise<CryptoKey | null> {
  const stored = localStorage.getItem(ENCRYPTION_KEY_NAME);
  if (!stored) return null;
  
  const { key: jwk } = JSON.parse(stored);
  return window.crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt']
  );
}

// Clears the key on logout.
export function clearStoredKey(): void {
  localStorage.removeItem(ENCRYPTION_KEY_NAME);
}

// --- Encryption and Decryption ---

// Encrypts a string value.
export async function encryptData(plaintext: string): Promise<{ encryptedData: string; iv: string } | null> {
  const key = await getStoredKey();
  if (!key) {
    console.error("Encryption key not found.");
    return null;
  }
  
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encoded
  );
  
  const encryptedData = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(encryptedBuffer))));
  const ivString = btoa(String.fromCharCode.apply(null, Array.from(iv)));

  return { encryptedData, iv: ivString };
}

// Decrypts a string value.
export async function decryptData(encryptedData: string, ivString: string): Promise<string | null> {
  const key = await getStoredKey();
  if (!key) {
    console.error("Decryption key not found.");
    return "Decryption key not found. Please log out and log back in.";
  }

  try {
    const iv = new Uint8Array(atob(ivString).split('').map(c => c.charCodeAt(0)));
    const data = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      data
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    console.error("Decryption failed:", error);
    return "Decryption Failed";
  }
}
