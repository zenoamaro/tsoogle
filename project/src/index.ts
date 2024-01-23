import fs, {readFile} from 'fs/promises';
import {every, flatMap, filter, find, head, invoke, map, some} from 'lodash-es';
import path from 'path';
import ts from 'typescript';
import tsm, {SourceFile} from 'ts-morph';

console.log('start\n----------------------------------------\n');

let tsConfigFilePath = findTsConfigPath(path.resolve(process.cwd()));

console.log('tsconfig path:', tsConfigFilePath);

if (tsConfigFilePath === null) {
  console.error('tsconfig not found');
  process.exit(1);
}

const project = new tsm.Project({
  tsConfigFilePath
});

function findTsConfigPath(dir: string): string | null {
  try {
    const potentialTsConfig = path.join(dir, 'tsconfig.json');
    fs.stat(potentialTsConfig);
    return potentialTsConfig;
  } catch (error) {
    const parentdir = path.join(dir, '..');
    if (parentdir === dir) {
      return null;
    }
    return findTsConfigPath(parentdir);
  }
}

const typeChecker = project.getTypeChecker();

interface Query {
  params: string[];
  returns: string;
}

interface Match {
  name: string;
}

function findByType(source: SourceFile, query: Query): Match[] {
  const matches = filter(
    source.getFunctions(),
    (fn: tsm.FunctionDeclaration) => {
      const rtype = fn.getReturnType();
      const argTypes = fn.getParameters();
      return (
        every(query.params, (t, i) => {
          if (!argTypes[i]) return false;
          return t === argTypes[i].getType().getText();
        }) && query.returns == rtype.getText()
      );
    }
  );
  return map(matches, (m) => {
    return {
      name: m.getName() || 'anonymous'
    };
  });
}

console.log('\n---------------------------------------\n');

const query: Query = {
  params: [],
  returns: 'string'
};

const sources = project.getSourceFiles();

const matches = flatMap(sources, (source) => findByType(source, query));

console.log(matches);

console.log('\n---------------------------------------\nend');
