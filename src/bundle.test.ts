import fs from 'fs';

import * as bundle from './bundle';

describe('bundle.ts', () => {
  describe('default', () => {
    let exitSpy: jest.SpyInstance;
    beforeEach(() => {
      exitSpy = jest.spyOn(process, 'exit');
      exitSpy.mockImplementation((code: number) => code);
    });

    afterEach(() => {
      exitSpy.mockRestore();
    });

    test('should exit with code 1 if reading the package.json fails', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy.mockImplementation(() => {
        throw new Error('read file failed');
      });

      await bundle.default();

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(readFileSpy).toHaveBeenCalledTimes(1);

      readFileSpy.mockReset();
    });

    test('should exit with code 1 if archiving fails', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy.mockImplementation((filePath: string, callback) => {
        callback(null, Buffer.from(JSON.stringify({ name: 'foo' })));
      });

      const archiveSpy = jest.spyOn(bundle, 'archive');
      archiveSpy.mockImplementation(async () => {
        throw new Error('archive failed');
      });

      await bundle.default();

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(archiveSpy).toHaveBeenCalledTimes(1);
      expect(archiveSpy).toHaveBeenCalledWith('foo');

      readFileSpy.mockRestore();
      archiveSpy.mockRestore();
    });

    test('should exit with code 0 if archiving succeeds', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy.mockImplementation((filePath: string, callback) => {
        callback(null, Buffer.from(JSON.stringify({ name: 'foo' })));
      });

      const archiveSpy = jest.spyOn(bundle, 'archive');
      archiveSpy.mockImplementation(async () => 10);

      await bundle.default();

      expect(exitSpy).toHaveBeenCalledWith(0);
      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(archiveSpy).toHaveBeenCalledTimes(1);
      expect(archiveSpy).toHaveBeenCalledWith('foo');

      readFileSpy.mockRestore();
      archiveSpy.mockRestore();
    });
  });

  // TODO: Write tests for the archiving function
  describe.skip('archive', () => {});
});
