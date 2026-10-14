// Deprecated shim: the Flavortown-only sync moved to `projectsToMDX.ts`,
// which syncs both Flavortown and Macondo via the HCES API.
// Kept so old `bun src/automation/ftToMDX.ts` invocations keep working.
export {};

console.warn(
  "[ftToMDX] deprecated: use `bun src/automation/projectsToMDX.ts` instead",
);

await import("./projectsToMDX");
