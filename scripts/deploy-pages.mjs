// Publish dist/ to the gh-pages branch (GitHub Pages "deploy from branch").
// Each deploy is a new commit on top of the previous one, so no force-push is needed.
import { execSync } from 'node:child_process'
import { mkdtempSync, cpSync, writeFileSync, rmSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const remote = execSync('git remote get-url origin').toString().trim()
const dir = mkdtempSync(join(tmpdir(), 'gh-pages-'))
const run = (cmd) => execSync(cmd, { cwd: dir, stdio: 'inherit' })

const hasBranch = execSync(`git ls-remote --heads ${remote} gh-pages`).toString().trim() !== ''
if (hasBranch) run(`git clone -q --depth 1 --branch gh-pages ${remote} .`)
else run('git init -q -b gh-pages')

for (const f of readdirSync(dir)) if (f !== '.git') rmSync(join(dir, f), { recursive: true, force: true })
cpSync('dist', dir, { recursive: true })
cpSync('dist/index.html', join(dir, '404.html'))
writeFileSync(join(dir, '.nojekyll'), '')

run('git add -A')
run(`git commit -q -m "Deploy ${new Date().toISOString()}" --allow-empty`)
run(`git push -q ${remote} HEAD:gh-pages`)
rmSync(dir, { recursive: true, force: true })
console.log('Deployed to gh-pages')
