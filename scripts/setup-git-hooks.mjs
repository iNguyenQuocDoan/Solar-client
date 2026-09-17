// Points git at the versioned hooks in .githooks/ so every clone enforces
// the same commit rules. Runs on `npm install` via the "prepare" script.
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'

if (!existsSync('.git')) {
  console.log('[hooks] not a git checkout, skipping hook setup')
  process.exit(0)
}

try {
  execSync('git config core.hooksPath .githooks', { stdio: 'inherit' })
  console.log('[hooks] core.hooksPath set to .githooks')
} catch (error) {
  console.warn('[hooks] could not configure git hooks:', error.message)
}
