const test = require('node:test');
const assert = require('node:assert');
const { add, subtract, multiply, divide } = require('../src/math.js');

test('add() adds two numbers correctly', () => {
  assert.strictEqual(add(2, 3), 5);
  assert.strictEqual(add(-1, 1), 0);
});

test('subtract() subtracts two numbers correctly', () => {
  assert.strictEqual(subtract(5, 3), 2);
});

test('multiply() multiplies two numbers correctly', () => {
  assert.strictEqual(multiply(3, 4), 12);
});

test('divide() divides two numbers correctly', () => {
  assert.strictEqual(divide(10, 2), 5);
});

test('divide() throws when dividing by zero', () => {
  assert.throws(() => divide(10, 0), /Cannot divide by zero/);
});
