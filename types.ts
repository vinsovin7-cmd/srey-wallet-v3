/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export interface Laureate {
  name: string;
  image: string; // placeholder url
  role: string;
  desc: string;
}

export interface TelegramVerifiedUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface TelegramOfficialAuthState {
  authenticated: boolean;
  botUsername: string;
  user: TelegramVerifiedUser | null;
  authMethod: string;
}

export interface TelegramApkInfo {
  fileName: string;
  cdnNode: string;
  downloadUrl: string;
  version: string;
  fileSizeMb: number;
  tokenValid: boolean;
  sha256Verification: string;
  supportedArchitectures: string[];
  minAndroidVersion: string;
}
