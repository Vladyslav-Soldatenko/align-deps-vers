#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

type Dependencies = Record<string, {
    "version": string,
    "resolved": string,
    "overridden": boolean
  }>;

function getInstalledVersions(): Record<string, string> {
  const output = execSync('npm list --json', { encoding: 'utf-8' });
  const parsedJson = JSON.parse(output);
  const dependencies: Dependencies = parsedJson.dependencies;
  
  const actualVersionsMap: Record<string, string> = {};
  for (const [name, details] of Object.entries(dependencies)) {
    actualVersionsMap[name] = details.version;
  }
  
  return actualVersionsMap;
}

function updateDependency(depName: string, newVersion: string): void {
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    const rawPkg = fs.readFileSync(pkgPath, 'utf-8');
    const pkg = JSON.parse(rawPkg);
  
    const depBlocks = ['dependencies', 'devDependencies', 'optionalDependencies'] as const;
  
    let wasUpdated = false;
  
    for (const blockName of depBlocks) {
      const block = pkg[blockName];
      if (block && typeof block[depName] === 'string') {
        const currentVersion = block[depName];
        const prefixMatch = currentVersion.match(/^([\^~])/);
        const prefix = prefixMatch ? prefixMatch[1] : '';
  
        // Only update if it's not exact pinned (i.e., no prefix = exact)
        if (prefix && currentVersion !== `${prefix}${newVersion}`) {
          block[depName] = `${prefix}${newVersion}`;
          wasUpdated = true;
        }
      }
    }
  
    if (wasUpdated) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
      console.log(`✔ Updated ${depName} to ${newVersion} in package.json`);
    } else {
      console.log(`⚠ Skipped ${depName} - either pinned exactly or already matches installed version`);
    }
  }

function alignInstalledVersions(): void {
  const installedVersions = getInstalledVersions();

  for (const [depName, installedVersion] of Object.entries(installedVersions)) {
    updateDependency(depName, installedVersion);
  }
}

alignInstalledVersions()