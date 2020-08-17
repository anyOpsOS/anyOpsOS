#!/usr/bin/env node

import {anyOpsOS} from '../src/index.js';

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

try {
  new anyOpsOS().runCli();
} catch(e) {
  throw e.toString();
}
