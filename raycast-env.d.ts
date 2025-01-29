/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Server URL - Your AdGuard Home server URL (e.g., http://localhost:3000) */
  "serverUrl": string,
  /** Username - AdGuard Home username */
  "username": string,
  /** Password - AdGuard Home password */
  "password": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `toggle-protection` command */
  export type ToggleProtection = ExtensionPreferences & {}
  /** Preferences accessible in the `snooze-protection` command */
  export type SnoozeProtection = ExtensionPreferences & {}
  /** Preferences accessible in the `view-stats` command */
  export type ViewStats = ExtensionPreferences & {}
  /** Preferences accessible in the `top-clients` command */
  export type TopClients = ExtensionPreferences & {}
  /** Preferences accessible in the `top-queried` command */
  export type TopQueried = ExtensionPreferences & {}
  /** Preferences accessible in the `top-blocked` command */
  export type TopBlocked = ExtensionPreferences & {}
  /** Preferences accessible in the `top-upstreams` command */
  export type TopUpstreams = ExtensionPreferences & {}
  /** Preferences accessible in the `query-log` command */
  export type QueryLog = ExtensionPreferences & {}
  /** Preferences accessible in the `manage-rules` command */
  export type ManageRules = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `toggle-protection` command */
  export type ToggleProtection = {}
  /** Arguments passed to the `snooze-protection` command */
  export type SnoozeProtection = {}
  /** Arguments passed to the `view-stats` command */
  export type ViewStats = {}
  /** Arguments passed to the `top-clients` command */
  export type TopClients = {}
  /** Arguments passed to the `top-queried` command */
  export type TopQueried = {}
  /** Arguments passed to the `top-blocked` command */
  export type TopBlocked = {}
  /** Arguments passed to the `top-upstreams` command */
  export type TopUpstreams = {}
  /** Arguments passed to the `query-log` command */
  export type QueryLog = {}
  /** Arguments passed to the `manage-rules` command */
  export type ManageRules = {}
}

