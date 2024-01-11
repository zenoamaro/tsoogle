import {readFile} from 'fs/promises';
import {every, filter, find, head, invoke, map, some} from 'lodash-es'
import path from 'path';
import ts from 'typescript';
import tsm, {SourceFile} from 'ts-morph';


console.log('start\n----------------------------------------\n');

const project = new tsm.Project({
  tsConfigFilePath: "../example/tsconfig.json",
});

const typeChecker = project.getTypeChecker();

interface Query {
  params: string[],
  returns: string,
}

interface Match {
  name: string,
}

function findByType(source: SourceFile, query: Query): Match[] {
  const matches = filter(source.getFunctions(), (fn: tsm.FunctionDeclaration) => {
    const rtype = fn.getReturnType();
    const argTypes = fn.getParameters();
    return (
      every(query.params, (t, i) => t === argTypes[i].getType().getText()) &&
      query.returns == rtype.getText()
    )
  });
  return map(matches, (m) => {
    return {
      name: m.getName() || 'anonymous'
    }
  });
}

console.log('\n---------------------------------------\n');

const source = project.getSourceFileOrThrow('index.ts');

const matches = findByType(source, {
  params: [],
  returns: 'T'
});

console.log(matches);

console.log('\n---------------------------------------\nend');
