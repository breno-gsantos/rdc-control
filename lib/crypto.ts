import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
    const key = process.env.ACCOUNT_ENCRYPTION_KEY

    if (!key) {
        throw new Error('ACCOUNT_ENCRYPTION_KEY não configurada')
    }

    const buffer = Buffer.from(key, 'base64')

    if (buffer.length !== 32) {
        throw new Error('ACCOUNT_ENCRYPTION_KEY deve possuir 32 bytes')
    }

    return buffer;
}

export function encryptPassword(password: string): string {
    const key = getEncryptionKey();
    const iv = randomBytes(IV_LENGTH);

    const cipher = createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([
        cipher.update(password, 'utf-8'),
        cipher.final()
    ]);

    const authTag = cipher.getAuthTag();

    return [
        'v1',
        iv.toString('base64'),
        authTag.toString('base64'),
        encrypted.toString('base64')
    ].join(':')
}

export function decryptPassword(encryptedPassword: string): string {
    const [version, ivEncoded, authTagEncoded, encrypted] = encryptedPassword.split(':');

    if (version !== 'v1' || !ivEncoded || !authTagEncoded || !encrypted) {
        throw new Error('Formato de senha criptografada inválido')
    }

    const key = getEncryptionKey();

    const iv = Buffer.from(ivEncoded, "base64");
    const authTag = Buffer.from(authTagEncoded, "base64");
    const encryptedBuffer = Buffer.from(encrypted, "base64");

    if (
        iv.length !== IV_LENGTH ||
        authTag.length !== AUTH_TAG_LENGTH ||
        encryptedBuffer.length === 0
    ) {
        throw new Error("Dados criptografados inválidos");
    }

    const decipher = createDecipheriv(ALGORITHM, key, iv);

    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
        decipher.update(encryptedBuffer),
        decipher.final(),
    ]);

    return decrypted.toString("utf8");
}
