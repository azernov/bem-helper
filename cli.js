#! /usr/bin/env node
const fs = require('fs');
const path = require('path');

const yargs = require("yargs");

const options = yargs
    .usage("Usage: -n <name>")
    .option("b", {
        alias: "block",
        describe: "Block name. Example: input",
        type: "string",
        demandOption: true
    })
    .option("e", {
        alias: "element",
        describe: "Element name. Example: button,title",
        type: "string"
    })
    .option("m", {
        alias: "modifier",
        describe: "Modifier name. Example: size_m,type_text",
        type: "string"
    })
    .argv;


var blockName = options.block;
var modifiers = false;
if (options.modifier) {
    modifiers = options.modifier.split(',');
}
var elements = false;
if (options.element) {
    elements = options.element.split(',');
}
var config = require('./config');

function makeBlockStructure(blockName){
    let blockFolder = config.dir.source.blocks + blockName;
    let blockFolderFullPath = path.resolve(process.cwd() + '/' + blockFolder);
    if (!fs.existsSync(blockFolderFullPath)) {
        console.log('Creating block folder: ' + blockFolderFullPath);
        fs.mkdirSync(blockFolderFullPath, {
            recursive: true
        });
    } else {
        //fs.realpath
        console.log('Block folder already exists: ' + blockFolderFullPath);
    }


    //TODO сделать создание файла .mixin.pug и .scss
    let files = [{
        path: blockFolder + '/_' + blockName + '.mixin.pug',
        template: __dirname + '/templates/block/pug.template'
    }, {
        path: blockFolder + '/_' + blockName + '.scss',
        template: __dirname + '/templates/block/scss.template'
    }];


    for (let blockFile of files) {
        let blockFileFullPath = path.resolve(process.cwd() + '/' + blockFile.path);
        if (!fs.existsSync(blockFileFullPath)) {
            let ws = fs.createWriteStream(blockFileFullPath);
            let content = fs.readFileSync(blockFile.template).toString();
            content = content.replace(/%name%/g, blockName);
            //вписать содержимое
            ws.write(content);
            ws.close();
        } else {
            console.log('Element file already exists: ' + blockFileFullPath);
        }
    }
}
function makeElementStructure(blockName, elementName){
    let blockFolder = config.dir.source.blocks + blockName;
    let elementSubfolder = blockFolder + '/__' + elementName;
    let elementSubfolderFullPath = path.resolve(process.cwd() + '/' + elementSubfolder);
    if (!fs.existsSync(elementSubfolderFullPath)) {
        fs.mkdirSync(elementSubfolderFullPath, {
            recursive: true
        });
    } else {
        console.log('Element folder already exists: ' + elementSubfolderFullPath);
    }

    //TODO сделать создание файла .mixin.pug и .scss
    let files = [{
        path: elementSubfolder + '/_' + blockName + '__' + elementName + '.mixin.pug',
        template: __dirname + '/templates/element/pug.template'
    }, {
        path: elementSubfolder + '/_' + blockName + '__' + elementName + '.scss',
        template: __dirname + '/templates/element/scss.template'
    }];
    let className = blockName + '__' + elementName;
    for (let elementFile of files) {
        let elementFileFullPath = path.resolve(process.cwd() + '/' + elementFile.path);
        if (!fs.existsSync(elementFileFullPath)) {
            let ws = fs.createWriteStream(elementFileFullPath);
            let content = fs.readFileSync(elementFile.template).toString();
            content = content.replace(/%name%/g, className);
            content = content.replace(/%blockclass%/g, blockName);
            //вписать содержимое
            ws.write(content);
            ws.close();
        } else {
            console.log('Element file already exists: ' + elementFileFullPath);
        }
    }
}
function makeModifierStructure(blockName, elementName, modifierName){
    let blockFolder = config.dir.source.blocks + blockName;
    let modifierPieces = modifierName.split('_');
    if (modifierPieces[0]) {
        let modifierSubfolder = blockFolder;
        if(elementName){
            modifierSubfolder += '/__' + elementName;
        }
        modifierSubfolder += '/_' + modifierPieces[0];

        let modifierSubfolderFullPath = path.resolve(process.cwd() + '/' + modifierSubfolder);
        if (!fs.existsSync(modifierSubfolderFullPath)) {
            fs.mkdirSync(modifierSubfolderFullPath, {
                recursive: true
            });
        } else {
            console.log('Modifier folder already exists: ' + modifierSubfolderFullPath);
        }

        let className = blockName;
        if (elementName) {
            className += '__' + elementName;
        }
        className += '_' + modifierPieces[0];
        if (modifierPieces[1]) {
            className += '_' + modifierPieces[1];
        }

        //TODO сделать создание файла .mixin.pug и .scss
        let files = [/*{
            path: modifierSubfolder + '/_' + className + '.mixin.pug',
            template: __dirname + '/templates/pug.template'
        }, */{
            path: modifierSubfolder + '/_' + className + '.scss',
            template: __dirname + '/templates/block-modifier/scss.template'
        }];
        if(elementName){
            files[0].template = __dirname + '/templates/element-modifier/scss.template';
        }
        for (let modifierFile of files) {
            let modifierFileFullPath = path.resolve(process.cwd() + '/' + modifierFile.path);
            if (!fs.existsSync(modifierFileFullPath)) {
                let ws = fs.createWriteStream(modifierFileFullPath);
                let content = fs.readFileSync(modifierFile.template).toString();
                content = content.replace(/%name%/g, className);
                content = content.replace(/%blockclass%/g, blockName);
                if(elementName){
                    content = content.replace(/%elementclass%/g, blockName+'__'+elementName);
                }
                //вписать содержимое
                ws.write(content);
                ws.close();
            } else {
                console.log('Modifier file already exists: ' + modifierFileFullPath);
            }
        }

    }
}


makeBlockStructure(blockName);

if (elements) {
    for (let elementName of elements) {
        makeElementStructure(blockName, elementName);
    }
    //console.log(folder);
}

if (modifiers) {
    if(elements){
        for (let elementName of elements) {
            for (let modifierName of modifiers) {
                makeModifierStructure(blockName, elementName, modifierName);
            }
        }
    }
    else {
        for (let modifierName of modifiers) {
            makeModifierStructure(blockName, false, modifierName);
        }
    }
}
