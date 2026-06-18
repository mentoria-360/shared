import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('package configuration', () => {
  const packageJsonPath = join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
    files?: string[];
    scripts?: Record<string, string>;
  };

  test('should whitelist only publishable assets', () => {
    expect(packageJson.files).toEqual(['dist', 'README.md']);
  });

  test('should clean dist before building', () => {
    expect(packageJson.scripts?.build).toContain('npm run clean');
    expect(packageJson.scripts?.clean).toBeDefined();
  });

  test('should define an explicit npm ignore file for publish hygiene', () => {
    expect(existsSync(join(__dirname, '..', '.npmignore'))).toBe(true);
  });
});
