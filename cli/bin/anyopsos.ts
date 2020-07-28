#!/usr/bin/env node

if (process.env.RUNINDOCKER) {
  process.env.NODE_OPTIONS = '--no-warnings --experimental-loader /var/www/.dist/cli/src/https-loader.js --experimental-specifier-resolution=node'
  process.execArgv = [
    '--no-warnings',
    '--experimental-loader /var/www/.dist/cli/src/https-loader.js',
    '--experimental-specifier-resolution=node'
  ];
}

import {anyOpsOS} from '../src';

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';

clear();
console.log(chalk.blueBright(
  figlet.textSync('anyOpsOS', { font: 'Big' })
));

console.log(chalk.blue('\n\nWelcome to anyOpsOS Cli.\n'));
console.log(chalk.blue('anyOpsOS Copyright (C) 2017-2020 Isart Navarro <contact@isartnavarro.io>'));
console.log(chalk.blue('SPDX-License-Identifier: GPL-3.0-or-later'));
console.log(chalk.red.bold('Danger:') + ' ' + chalk.blue('This project is on alpha state.\n'));

new anyOpsOS().runCli();
