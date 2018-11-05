import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { default as archiver } from 'archiver';
import { info, error } from './utils';

export const archive = (packageName: any): Promise<number> => new Promise((resolve) => {
  // Create an output stream and set up the archive
  const output = fs.createWriteStream(path.join(process.cwd(), `${packageName}.zip`));

  const zip = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level.
  });

  // When the zip file is finished resolve the promise
  output.on('close', () => {
    resolve(zip.pointer());
  });

  // If there is an error writing the zip file, throw
  zip.on('error', (err) => {
    throw err;
  });

  // Pipe the archive data to the output (stay non thread-blocking)
  zip.pipe(output);

  // Add the "lib" folder at the root of the zip folder
  info('Adding lib');
  zip.directory('lib/', false);

  // Add the "node_modules" folder
  info('Adding node_modules');
  zip.directory('node_modules', 'node_modules');

  info('Bundling Everything Up');
  zip.finalize();
});

const bundle = async () => {
  const packageName = await promisify(fs.readFile)('package.json')
    .then(res => JSON.parse(res.toString('utf8')).name)
    .catch((err) => {
      error('An unexpected error occurred while reading your package.json');
      error(err.message);
      return;
    });

  if (packageName === undefined) {
    process.exit(1);
    return;
  }

  await archive(packageName)
    .then((size) => {
      info(`\nBundle successfully written to ${packageName}.zip with size ${size}`);
      process.exit(0);
    })
    .catch((err: Error) => {
      error('An unexpected error occurred while packaging your bundle');
      error(err.message);
      process.exit(1);
    });
};

export default bundle;
