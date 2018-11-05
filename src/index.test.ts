import yargs from 'yargs';

describe('index.ts', () => {
  test('should call each function in the yargs chain', () => {
    let finishedChain = false;
    const finishChain = () => {
      finishedChain = true;
      return;
    };

    const mockYargs = {
      alias: () => mockYargs,
      argv: finishChain(),
      command: () => mockYargs,
      demandCommand: () => mockYargs,
      help: () => mockYargs,
      scriptName: () => mockYargs,
      version: () => mockYargs,
    };

    const usageSpy = jest.spyOn(yargs, 'usage');
    usageSpy.mockImplementation(() => mockYargs);

    require('./');

    expect(usageSpy).toHaveBeenCalledTimes(1);
    expect(finishedChain).toEqual(true);

    usageSpy.mockRestore();
  });
});
