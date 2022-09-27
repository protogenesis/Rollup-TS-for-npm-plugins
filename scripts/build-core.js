import { execaSync as exec } from 'execa'
import fs from 'node:fs'
import inquirer from 'inquirer'
import path from 'node:path'

const packageDirPath = 'package/core'

const tsconfigPath = './_tsconfig.json'

fs.writeFileSync(
  tsconfigPath,
  JSON.stringify(
    {
      extends: './tsconfig.json',
      include: [`${packageDirPath}/**/*.ts`],
    },
    null,
    2,
  ),
)

const { isDev } = await inquirer.prompt([
  {
    type: 'confirm',
    name: 'isDev',
    message: 'Build for development?(files not minified.)',
  },
])

fs.rmSync(path.resolve(packageDirPath, 'dist'), {
  force: true,
  recursive: true,
})

exec(
  'rollup',
  [
    '-c',
    '--environment',
    `packageDirPath:${packageDirPath},tsconfigPath:${tsconfigPath},isDev:${isDev}`,
  ],
  {
    stdio: 'inherit',
  },
)

fs.unlinkSync(tsconfigPath)
