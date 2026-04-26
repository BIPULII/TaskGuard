import jwt from "jsonwebtoken";
import { config } from "../config/env";

export interface TokenPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  // @ts-ignore - Type mismatch with newer @types/jsonwebtoken
  return jwt.sign(payload, config.jwtAccessSecret as string, {
    expiresIn: config.accessTokenExpiresIn,
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  // @ts-ignore - Type mismatch with newer @types/jsonwebtoken
  return jwt.sign(payload, config.jwtRefreshSecret as string, {
    expiresIn: config.refreshTokenExpiresIn,
  });
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const payload = jwt.verify(token, config.jwtAccessSecret) as TokenPayload;
    return payload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    const payload = jwt.verify(token, config.jwtRefreshSecret) as TokenPayload;
    return payload;
  } catch {
    return null;
  }
};

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const payload = jwt.decode(token) as TokenPayload;
    return payload;
  } catch {
    return null;
  }
};
