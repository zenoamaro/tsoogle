import {filter, map} from 'lodash-es';
import ts from 'typescript';
import tsm, {SourceFile} from 'ts-morph';

console.log('start\n----------------------------------------\n');

const project = new tsm.Project({
  tsConfigFilePath: '../example/tsconfig.json'
});

const program = ts.createProgram(
  project.getSourceFiles().map((sf) => sf.getFilePath()),
  {}
);

interface Match {
  name: string;
}

function findByType(source: SourceFile, query: ts.Type): Match[] {
  const checker = program.getTypeChecker();
  const matches = filter(
    source.getFunctions(),
    (fn: tsm.FunctionDeclaration) => {
      const fnType = fn.getType().compilerType as ts.Type;
      const isMatch = checker.isTypeAssignableTo(fnType, query);

      console.log('\n---------------------------------------\n');
      console.log('isMatch', isMatch);
      return isMatch;
    }
  );

  return map(matches, (m) => {
    return {
      name: m.getName() || 'anonymous'
    };
  });
}

const queryString = '(a: string, b: number) => string';

const testSource = project.createSourceFile(
  'test.ts',
  `type test = ${queryString}`,
  {
    scriptKind: ts.ScriptKind.TS
  }
);

const testFnType = testSource.getTypeAliasOrThrow('test').getType();

console.log('\n---------------------------------------\n');

const source = project.getSourceFileOrThrow('index.ts');

const matches = findByType(source, testFnType.compilerType as ts.Type);

console.log(matches);

console.log('\n---------------------------------------\nend');
