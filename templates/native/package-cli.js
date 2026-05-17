//constants
const ROOT_CWD = '%ROOT_CWD%';
const RESERVED_ENTITY_NAMES = ['index', 'app'];
const RESERVED_ENTITY_NAMES_EXTENSIONS = ['htm', 'html', 'xhtml', 'styl', 'stylus', 'sass', 'scss', 'less', 'css', 'pcss', 'sss'];

//commands
//add
const ADD_FILE_COMMAND = 'add-file';
const ADD_DIRECTORY_COMMAND = 'add-directory';
const ADD_CONTAINER_COMMAND = 'add-container';
const ADD_COMPONENT_COMMAND = 'add-component';
const ADD_ASPECT_COMMAND = 'add-aspect';
const ADD_TRANSFORMER_COMMAND = 'add-transformer';
const ADD_INJECTABLE_COMMAND = 'add-injectable';

//remove
const REMOVE_FILE_COMMAND = 'remove-file';
const REMOVE_DIRECTORY_COMMAND = 'remove-directory';
const REMOVE_CONTAINER_COMMAND = 'remove-container';
const REMOVE_COMPONENT_COMMAND = 'remove-component';
const REMOVE_ASPECT_COMMAND = 'remove-aspect';
const REMOVE_TRANSFORMER_COMMAND = 'remove-transformer';
const REMOVE_INJECTABLE_COMMAND = 'remove-injectable';

function logError(text) {
    console.error(`\x1b[41m${text}\x1b[0m`);
}

function isNotEmptyString(value) {
    return (typeof(value) === 'string') && (value.length > 0);
}

function trimWhiteSpaces(value, replaceWith) {
    return value.replace(/[ \t\r\n]+/g, replaceWith || '').trim()
}

function fromCamelToKebabCase(value) {
    return trimWhiteSpaces(value).replace(/[A-Z]/g, (match, index) => index > 0 ? ('-' + match.toLowerCase()) : match.toLocaleLowerCase());
}

function fromCamelToPascalCase(value) {
    return value.charAt(0).toUpperCase() + value.substring(1);
}

function addFile(fs, path, rootDirectory, fileName, data) {
    const newFilePath = path.join(rootDirectory, fileName);
    if (!fs.existsSync(newFilePath)) {
        fs.writeFileSync(newFilePath, data);
    } else {
        logError(`File '${newFilePath}' already exists`);
    }
}

function addDirectory(fs, path, rootDirectory, directoryName) {
    const newDirectoryPath = path.join(rootDirectory, directoryName);
    if (!fs.existsSync(newDirectoryPath)) {
        fs.mkdirSync(newDirectoryPath);
    } else {
        logError(`Directory '${newDirectoryPath}' already exists`);
    }
}

function addDirectoryWithFiles(fs, path, rootDirectory, newDirectory, newFileNamesWithContent) {
    const newDirectoryPath = path.join(rootDirectory, newDirectory);
    if (!fs.existsSync(newDirectoryPath)) {
        fs.mkdirSync(newDirectoryPath);

        for (const fileMetaData of newFileNamesWithContent) {
            fs.writeFileSync(path.join(newDirectoryPath, fileMetaData.name), fileMetaData.data);
        }
    } else {
        logError(`Directory '${newDirectoryPath}' already exists`);
    }
}


function removeDirectory(fs, path, rootDirectory, directoryName) {
    const directoryToRemovePath = path.join(rootDirectory, directoryName);
    if (fs.existsSync(directoryToRemovePath)) {
        if (fs.statSync(directoryToRemovePath).isDirectory()) {
            fs.rmSync(directoryToRemovePath, { recursive: true, force: true });
        } else {
            logError(`'${directoryToRemovePath}' is not a directory`);
        }
    }
}

function removeFile(fs, path, rootDirectory, fileName) {
    const fileToRemovePath = path.join(rootDirectory, fileName);
    if (fs.existsSync(fileToRemovePath)) {
        if (fs.statSync(fileToRemovePath).isFile()) {
            fs.rmSync(fileToRemovePath);
        } else {
            logError(`'${fileToRemovePath}' is not a file`);
        }
    }
}

async function readline(text) {
    const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        readline.question(text, (inout) => {
            readline.close();
            resolve(inout);
        });
    });
};

async function main(argv) {
    if (argv.length >= 3) {
        const fs = require('fs');
        const path = require('path');

        let rootDirectory = (argv[2] === ROOT_CWD ? process.cwd() : argv[2]);
        if (rootDirectory.lastIndexOf('/') == rootDirectory.length - 1) {
            rootDirectory = rootDirectory.substring(0, rootDirectory.length - 1);
        }

        const commandType = argv[3].toLowerCase();
        let entityName = argv[commandType == ADD_COMPONENT_COMMAND ? 5 : 4];

        if (!isNotEmptyString(entityName)) {
            let prompt = null;

            switch (commandType) {
                case ADD_FILE_COMMAND:
                    prompt = 'Enter file name with extension: ';
                    break;
                case ADD_DIRECTORY_COMMAND:
                    prompt = 'Enter directory name: ';
                    break;

                case ADD_CONTAINER_COMMAND:
                case REMOVE_CONTAINER_COMMAND:
                    prompt = 'Enter container name: ';
                    break;
                case ADD_COMPONENT_COMMAND:
                case REMOVE_COMPONENT_COMMAND:
                    prompt = 'Enter component name: ';
                    break;

                case REMOVE_FILE_COMMAND:
                    prompt = 'Enter file name with extension to remove: ';
                    break;
                case REMOVE_DIRECTORY_COMMAND:
                    prompt = 'Enter directory name to remove: ';
                    break;
            }

            entityName = await readline(prompt);
        }

        switch (commandType) {
            case ADD_FILE_COMMAND:
                const fileName = fromCamelToKebabCase(entityName);
                const filePath = path.parse(fileName);
                const entityExtIndex = RESERVED_ENTITY_NAMES_EXTENSIONS.indexOf(filePath.ext.substring(1));
                const entityNamesIndex = RESERVED_ENTITY_NAMES.indexOf(filePath.name);
                if ((entityExtIndex < 0) || ((entityExtIndex >= 0) && (entityNamesIndex < 0))) {
                    addFile(fs, path, rootDirectory, fileName, '');
                } else {
                    logError(`'${fileName}' is reserved for application entry point file`);
                }
                break;
            case ADD_DIRECTORY_COMMAND:
                addDirectory(fs, path, rootDirectory, entityName);
                break;

            case ADD_CONTAINER_COMMAND:
                const containerName = fromCamelToKebabCase(entityName);
                if (RESERVED_ENTITY_NAMES.indexOf(containerName) < 0) {
                    addDirectoryWitFiles(fs, path, rootDirectory, containerName, [
                        {
                            name: `${containerName}.html`,
                            data: ''
                        },
                        {
                            name: `${containerName}.ts`,
                            data:
`import html from './${containerName}.html';

import { Container } from 'nubond';

@Container(html)
export class ${fromCamelToPascalCase(entityName)} {
}`
                        }
                    ]);
                } else {
                    logError(`'${containerName}' is reserved for application entry point file`);
                }
                break;
            case ADD_COMPONENT_COMMAND:
                const componentName = fromCamelToKebabCase(entityName);
                if (RESERVED_ENTITY_NAMES.indexOf(componentName) < 0) {
                    addDirectoryWithFiles(fs, path, rootDirectory, componentName, [
                        {
                            name: `${componentName}.html`,
                            data: ''
                        },
                        {
                            name: `${componentName}.${argv[4]}`,
                            data: ''
                        },
                        {
                            name: `${componentName}.ts`,
                            data:
`import html from './${componentName}.html';
import css from './${componentName}.scss';

import { Component } from 'nubond';

@Component(html, css)
export class ${fromCamelToPascalCase(entityName)} {
}`
                        }
                    ]);
                } else {
                    logError(`'${componentName}' is reserved for application entry point file`);
                }
                break;
            case ADD_ASPECT_COMMAND:
                addFile(fs, path, rootDirectory, `${fromCamelToKebabCase(entityName)}.ts`,
`import { Aspect } from 'nubond';

@Aspect()
export class ${fromCamelToPascalCase(entityName)} {
}`);
                break;
            case ADD_TRANSFORMER_COMMAND:
                addFile(fs, path, rootDirectory, `${fromCamelToKebabCase(entityName)}.ts`,
`import { Transformer } from 'nubond';

@Transformer()
export class ${fromCamelToPascalCase(entityName)} {
    public transform(...params: Array<any>): any {
    }
}`);
                break;
            case ADD_INJECTABLE_COMMAND:
                addFile(fs, path, rootDirectory, `${fromCamelToKebabCase(entityName)}.ts`,
`import { Injectable } from 'nubond';

@Injectable()
export class ${fromCamelToPascalCase(entityName)} {
}`);
                break;

            case REMOVE_COMPONENT_COMMAND:
            case REMOVE_CONTAINER_COMMAND:
                removeDirectory(fs, path, rootDirectory, fromCamelToKebabCase(entityName));
                break;
            case REMOVE_ASPECT_COMMAND:
            case REMOVE_TRANSFORMER_COMMAND:
            case REMOVE_INJECTABLE_COMMAND:
                removeFile(fs, path, rootDirectory, `${fromCamelToKebabCase(entityName)}.ts`);
                break;

            case REMOVE_FILE_COMMAND:
                for (const subEntity of entityName.split(',')) {
                    removeFile(fs, path, rootDirectory, entityName.trim());
                }
                break;
            case REMOVE_DIRECTORY_COMMAND:
                for (const subEntity of entityName.split(',')) {
                    removeDirectory(fs, path, rootDirectory, subEntity.trim());
                }
                break;
        }
    } else {
        logError('Root directory and/or command type are not provided, specify %INIT_CWD% as first argument and command type as the second');
    }
}

main(process.argv);