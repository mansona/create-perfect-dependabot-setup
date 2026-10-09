import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export async function run() {
  // TODO consider merging implementations

  const fileContent = await readFile(join(import.meta.dirname, '.github', 'dependabot.yml') )
  await mkdir('./.github', { recursive: true })
  await writeFile('./.github/dependabot.yml', fileContent)
}