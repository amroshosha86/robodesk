import { readFileSync } from 'fs';
import path from 'path';

export interface LoginData {
  email: string;
  password: string;
  postLoginUrlFragment: string;
}

interface RawLoginData {
  email?: string;
  password?: string;
  postLoginUrlFragment?: string;
}

const loginDataPath = path.resolve(__dirname, 'loginData.json');
const localLoginDataPath = path.resolve(__dirname, 'loginData.local.json');

function loadJsonData(): RawLoginData {
  try {
    const raw = readFileSync(loginDataPath, 'utf-8');
    return JSON.parse(raw) as RawLoginData;
  } catch {
    return {};
  }
}

function loadLocalOverrides(): RawLoginData {
  try {
    const raw = readFileSync(localLoginDataPath, 'utf-8');
    return JSON.parse(raw) as RawLoginData;
  } catch {
    return {};
  }
}

const fileData = loadJsonData();
const localData = loadLocalOverrides();

/**
 * Centralised login test data pulled from JSON with optional env overrides.
 */
export const loginData: LoginData = {
  email: process.env.ROBO_DESK_EMAIL ?? localData.email ?? fileData.email ?? '',
  password: process.env.ROBO_DESK_PASSWORD ?? localData.password ?? fileData.password ?? '',
  postLoginUrlFragment:
    process.env.ROBO_DESK_POST_LOGIN_URL_FRAGMENT ??
    localData.postLoginUrlFragment ??
    fileData.postLoginUrlFragment ??
    'dashboard',
};
