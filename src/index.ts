import fs from 'fs/promises';
import path from 'path';
import { spawn as _spawn, SpawnOptions } from 'child_process';
import { parseArgs, styleText, InspectColor } from 'util';

function spawn(command: string, args: readonly string[], options: SpawnOptions): Promise<void> {
    return new Promise((resolve, reject) => {
        _spawn(`${command} ${args.join(' ')}`, {...options, shell: process.platform === 'win32'}).on('close', (code, signal) => {
            if (code || signal) {
                reject(new Error(`${command} failed with exit code ${code}`));
            } else {
                resolve();
            }
        });
    });
}

function getStyled(format: InspectColor | readonly InspectColor[], text: string): string {
    return (typeof(styleText) === 'function') 
                    ? styleText(format, text)
                    : text;
}

async function getDirectoryFiles(name: string): Promise<Array<string>> {
    const result = new Array<string>();

    for (const entry of await fs.readdir(name, { withFileTypes: true })) {
        const fullName = path.join(name, entry.name);
        if (entry.isDirectory()) {
            for (const subEntry of await getDirectoryFiles(fullName)) {
                result.push(subEntry);
            }
        } else if (entry.isFile()) {
            result.push(fullName);
        }
    }

    return result;
}

function main(args: Array<string>): Promise<Array<string>> {
    const appNamePlaceholder = '{APP_NAME}';
    const appNameInLowerCasePlaceholder = '{APP_NAME_IN_LOWER_CASE}';

    return new Promise<Array<string>>(async (resolve, reject) => {
        const supportsEmoji = process.platform === 'win32'
                                        ? (Boolean(process.env.CI) ||
                                           Boolean(process.env.WT_SESSION) || // Windows Terminal
                                           process.env.ConEmuTask === '{cmd::Cmder}' || // ConEmu and cmder
                                           process.env.TERM_PROGRAM === 'vscode' ||
                                           process.env.TERM === 'xterm-256color' ||
                                           process.env.TERM === 'alacritty')
                                        : (process.env.TERM !== 'linux') // Linux console (kernel)

        const packageManager = process.env.npm_config_user_agent?.split(' ')[0];
        const packageManagerName = (packageManager ? packageManager.substring(0, packageManager.lastIndexOf('/')) : null) ?? 'npm';

        const successSymbol: string = supportsEmoji ? '✨' : '√';
        const errorSymbol: string = supportsEmoji ? '🚨' : '×';

        const templateRootDir = path.join(__dirname, '..', 'templates');
        const availableTemplates = (await fs.readdir(templateRootDir)).filter(el => !el.startsWith('#'));

        const template = args[0];
        const name = args[1] || '.';

        if (!template) {
            reject([
                `Usage: ${packageManagerName} create <template> [directory]`,
                'Available templates:',
                ...availableTemplates.map(el => `  • ${el}`)
            ]);
            return;
        }

        const templateDir = path.join(templateRootDir, template);

        try {
            await fs.stat(templateDir);
        } catch {
            reject([
                getStyled(['red', 'bold'], `${errorSymbol} Unknown template ${template}.`),
                'Available templates:',
                ...availableTemplates.map(el => `  • ${el}`)
            ]);
            return;
        }

        if (name === '.') {
            if ((await fs.readdir(name)).length !== 0) {
                reject([getStyled(['red', 'bold'], `${errorSymbol} Directory is not empty.`)]);
                return;
            }
        } else {
            try {
                await fs.stat(name);

                reject([getStyled(['red', 'bold'], `${errorSymbol} ${name} already exists.`)]);
                return;
            } catch {
                // ignore
            }

            await fs.mkdir(name, { recursive: true });
        }

        await spawn('git', ['init'], { cwd: name, stdio: 'inherit' });

        await fs.cp(templateDir, name, { recursive: true });

        try {
            for (const file of await getDirectoryFiles(name)) {
                const fileContent = await fs.readFile(file, { encoding: 'utf8' });
                const updatedFileContent = fileContent.replaceAll(appNamePlaceholder, name)
                                                      .replaceAll(appNameInLowerCasePlaceholder, name.toLocaleLowerCase());

                if (fileContent !== updatedFileContent) {
                    await fs.writeFile(file, updatedFileContent, { flush: true });
                }
            }
        } catch (err) {
            // ignore
        }

        switch (packageManagerName) {
            case 'yarn':
                await spawn('yarn', [], {cwd: name, stdio: 'inherit'});
                break;
            case 'pnpm':
                await spawn('pnpm', ['install'], {cwd: name, stdio: 'inherit'});
                break;
            case 'npm':
            default:
                await spawn('npm', ['install', '--legacy-peer-deps', '--no-audit', '--no-fund'], { cwd: name, stdio: 'inherit' });
                break;
        }

        await spawn('git', ['add', '-A'], { cwd: name });
        await spawn('git', ['commit', '--quiet', '-a', '-m', '"Initial commit"'], { cwd: name, stdio: 'inherit' });

        resolve([
            getStyled(['green', 'bold'], `${successSymbol} Your new nuBond app is ready!`),
            'To get started, run the following commands:',
            (name !== '.' ? `  cd ${name}` : ''),
            `  ${packageManagerName} start`
        ]);
    });
}

main(parseArgs({ allowPositionals: true, options: {} }).positionals).then(logs => {
        for (const el of logs) {
            if (el?.trim()) {
                console.log(el);
            }
        }
        
        process.exit(0);
    }, errs => {
        for (const el of errs) {
            if (el?.trim()) {
                console.error(el);
            }
        }

        process.exit(1);
    },
);