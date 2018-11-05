#!/usr/bin/env node

import yargs from 'yargs';
import * as pkg from '../package.json';

import bundle from './bundle';

const VERSION = pkg.version;

yargs
  .usage('Usage: $0 [<args>] [<options>]')
  .scriptName('bundle-lambda')
  .command('bundle', 'create a bundle of your project\'s files and node modules', {}, bundle)
  .demandCommand()
  .help('h')
  .alias('h', 'help')
  .version('v', 'Show version number', VERSION)
  .alias('v', 'version')
  .argv;
