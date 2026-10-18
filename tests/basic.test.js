import { Project } from 'fixturify-project';
import { describe, it, afterEach, expect } from 'vitest';
import { readFile } from 'node:fs/promises';

import { run } from '../index.js';

async function setupAndExecute(files = {}) {
  const project = new Project('test-app', '1.0.0', files);

  await project.write();

  process.chdir(project.baseDir);

  await run();

  return project;
}

describe('basic functionality', () => {
  let currentCWD = process.cwd();

  afterEach(() => {
    process.chdir(currentCWD);
  });

  it('creates a file when there are none', async () => {
    // no files
    await setupAndExecute({});

    expect(await readFile('.github/dependabot.yml', 'utf8'))
      .toMatchInlineSnapshot(`
        "version: 2
        updates:
          # NPM dev dependencies should be grouped and only updated once a week to keep noise down
          - package-ecosystem: npm
            directory: '/'
            ignore:
              # See below for explanation
              - dependency-name: '@types/node'
            groups:
              dev-dependencies:
                dependency-type: 'development'
                update-types:
                  - 'minor'
                  - 'patch'
            schedule:
              interval: weekly
              time: '03:00'
              day: 'monday'
              timezone: Europe/Paris
            # There really should only ever be one of these since it's designed to group all patches in one
            open-pull-requests-limit: 2
            versioning-strategy: increase-if-necessary

          # @types/node major version should only ever be updated when you update your minimum version of node that
          # your package supports. This means that you won't be prompted (with autocomplete) to use functions that
          # don't exist on your lowest supported node version
          - package-ecosystem: npm
            directory: '/'
            allow:
              - dependency-name: '@types/node'
                update-types:
                  - version-update:semver-minor
                  - version-update:semver-patch
            schedule:
              interval: weekly
              time: '03:00'
              day: 'monday'
              timezone: Europe/Paris

          - package-ecosystem: github-actions
            directory: '/'
            schedule:
              interval: weekly
              time: '03:00'
              day: 'monday'
              timezone: Europe/Paris
            # There really should only ever be one of these since it's designed to group all patches in one
            open-pull-requests-limit: 2
            groups:
              github-actions:
                patterns:
                  - '*'
        "
      `);
  });

  // TODO add a test that shows that it updates things
});
