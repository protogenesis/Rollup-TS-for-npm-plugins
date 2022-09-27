import { execaSync as exec } from 'execa'
import fs from 'node:fs'
import inquirer from 'inquirer'
import path from 'node:path'

const tsconfigPath = './_tsconfig.json'

const pluginsDir = 'package/plugin'

const pluginNames = fs.readdirSync(pluginsDir)

const { pluginName, isDev } = await inquirer.prompt([
  {
    type: 'list',
    name: 'pluginName',
    message: 'select a plugin to build:',
    choices: pluginNames,
  },
  {
    type: 'confirm',
    name: 'isDev',
    message: 'Build for development?(not minified)',
  },
])

const pluginDir = `${pluginsDir}/${pluginName}`

fs.writeFileSync(
  tsconfigPath,
  JSON.stringify(
    {
      extends: './tsconfig.json',
      include: [`${pluginDir}/**/*.ts`],
    },
    null,
    2,
  ),
)

fs.rmSync(path.resolve(pluginDir, 'dist'), {
  force: true,
  recursive: true,
})

exec(
  'rollup',
  [
    '-c',
    '--environment',
    `packageDirPath:${pluginDir},tsconfigPath:${tsconfigPath},isDev:${isDev}`,
  ],
  {
    stdio: 'inherit',
  },
)

fs.unlinkSync(tsconfigPath)
