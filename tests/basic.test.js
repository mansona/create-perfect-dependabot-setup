import { Project } from "fixturify-project";
import { describe, it, afterEach, beforeAll, beforeEach, expect } from "vitest";
import { readdir, readFile  }from "node:fs/promises"

import { run } from '../index.js'
import { join } from "node:path";


async function setupAndExecute(files = {}){
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
  }) 

  it('creates a file when there are none', async () => {
    // no files
    const project = await setupAndExecute({});

    debugger
    expect(await readFile('.github/dependabot.yml', 'utf8')).toMatchInlineSnapshot(`
      "version: 2
      updates:
        - package-ecosystem: npm
          directory: "/"
          groups:
            dev-dependencies:
              dependency-type: "development"
              update-types:
                - "minor"
                - "patch"
          schedule:
            interval: weekly
            time: "03:00"
            timezone: Europe/Paris
          # There really should only ever be one of these since it's designed to group all patches in one
          open-pull-requests-limit: 2
          versioning-strategy: increase-if-necessary
        - package-ecosystem: github-actions
          directory: "/"
          schedule:
            interval: daily
            time: "03:00"
            timezone: America/New_York
          open-pull-requests-limit: 10"
    `)
  })

  // TODO add a test that shows that it updates things
})