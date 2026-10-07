import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const globbyPath = require.resolve('globby');
const fastGlobPath = createRequire(globbyPath).resolve('fast-glob');
const micromatchPath = createRequire(fastGlobPath).resolve('micromatch');
const braces = createRequire(micromatchPath)('braces');
const MAX_DEPTH = 100;

const patternAtDepth = depth => `${'{'.repeat(depth)}a,b${'}'.repeat(depth)}`;

const astAtDepth = depth => {
  let node = { type: 'text', value: 'a' };

  for (let index = 0; index < depth; index++) {
    const parent = { type: 'brace', nodes: [node] };
    node.parent = parent;
    node = parent;
  }

  const root = { type: 'root', nodes: [node] };
  node.parent = root;
  return root;
};

test('braces rejects deeply nested strings before recursive processing', () => {
  assert.doesNotThrow(() => braces.parse(patternAtDepth(MAX_DEPTH)));
  assert.throws(() => braces.parse(patternAtDepth(MAX_DEPTH + 1)), SyntaxError);
  assert.throws(() => braces(patternAtDepth(MAX_DEPTH + 1)), SyntaxError);
  assert.throws(() => braces.expand(patternAtDepth(MAX_DEPTH + 1)), SyntaxError);
});

test('recursive AST APIs enforce the same maximum depth', () => {
  for (const depth of [MAX_DEPTH, MAX_DEPTH + 1]) {
    const ast = astAtDepth(depth);
    const expectedError = depth > MAX_DEPTH ? RangeError : undefined;

    for (const process of [braces.compile, braces.expand, braces.stringify]) {
      if (expectedError) {
        assert.throws(() => process(ast), expectedError);
      } else {
        assert.doesNotThrow(() => process(ast));
      }
    }
  }
});

test('expansion rejects cyclic parent links', () => {
  const first = { type: 'paren', nodes: [{ type: 'text', value: 'a' }] };
  const second = { type: 'paren', nodes: [] };
  const root = { type: 'root', nodes: [first] };
  first.parent = second;
  second.parent = first;

  assert.throws(() => braces.expand(root), /parent chain contains a cycle/);
});

test('the depth guard preserves ordinary nested and escaped pattern behavior', () => {
  assert.deepEqual(braces.expand('a/{b,c}/d'), ['a/b/d', 'a/c/d']);

  for (const pattern of ['{{a}}', '{a,{b}}', '{{x}y}', '{a,{b,{c}}', '{}{a}']) {
    assert.equal(braces.stringify(braces.parse(pattern), { escapeInvalid: true }), pattern);
  }
});
