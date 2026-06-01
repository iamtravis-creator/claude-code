#!/usr/bin/env bun

// Lists all email accounts on the cPanel hosting account via UAPI.
// Requires CPANEL_HOST, CPANEL_USERNAME, and CPANEL_API_KEY in the environment.

const host = process.env.CPANEL_HOST;
const username = process.env.CPANEL_USERNAME;
const apiKey = process.env.CPANEL_API_KEY;

if (!host) throw new Error("CPANEL_HOST required");
if (!username) throw new Error("CPANEL_USERNAME required");
if (!apiKey) throw new Error("CPANEL_API_KEY required");

interface EmailAccount {
  email: string;
  domain: string;
  login: string;
  diskused: string;
  diskquota: string;
  _diskused_bytes: number;
  _diskquota_bytes: number;
}

interface UAPIResponse<T> {
  data: T | null;
  status: number;
  errors: string[] | null;
}

async function cpanelRequest<T>(module: string, fn: string): Promise<T> {
  const response = await fetch(
    `https://${host}:2083/execute/${module}/${fn}`,
    {
      headers: {
        Authorization: `cpanel ${username}:${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`cPanel UAPI ${response.status}: ${text}`);
  }

  const result: UAPIResponse<T> = await response.json();
  if (result.errors?.length) {
    throw new Error(`cPanel UAPI error: ${result.errors.join(", ")}`);
  }
  return result.data as T;
}

const accounts = await cpanelRequest<EmailAccount[]>("Email", "list_pops");

if (!accounts.length) {
  console.log("No email accounts found.");
  process.exit(0);
}

const col = (s: string, w: number) => s.padEnd(w).slice(0, w);

const headers = ["Email", "Disk Used", "Quota"];
const rows = accounts.map((a) => [
  a.email,
  a.diskused || "0 MB",
  a.diskquota === "unlimited" ? "unlimited" : `${a.diskquota} MB`,
]);

const widths = [
  Math.max(headers[0].length, ...rows.map((r) => r[0].length)),
  Math.max(headers[1].length, ...rows.map((r) => r[1].length)),
  Math.max(headers[2].length, ...rows.map((r) => r[2].length)),
];

const separator = widths.map((w) => "-".repeat(w)).join("  ");
console.log(widths.map((w, i) => col(headers[i], w)).join("  "));
console.log(separator);
for (const row of rows) {
  console.log(row.map((cell, i) => col(cell, widths[i])).join("  "));
}
console.log(`\n${accounts.length} account(s) total`);
