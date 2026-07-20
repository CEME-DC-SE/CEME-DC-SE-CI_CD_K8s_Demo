const test = require('node:test');
const assert = require('node:assert');
const { add, subtract, multiply, divide, power } = require('../src/math.js');

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

test('power() calculates the power of a base to an exponent', () => {
  assert.strictEqual(power(2, 3), 8);
  assert.strictEqual(power(5, 0), 1);
  assert.strictEqual(power(2, -2), 0.25);
});

test('math functions throw TypeError for non-numeric arguments', () => {
  assert.throws(() => add("5", 5), /Arguments must be valid numbers/);
  assert.throws(() => subtract(10, "2"), /Arguments must be valid numbers/);
  assert.throws(() => multiply(null, 4), /Arguments must be valid numbers/);
  assert.throws(() => divide(10, undefined), /Arguments must be valid numbers/);
  assert.throws(() => power(NaN, 2), /Arguments must be valid numbers/);
});

test('divide() throws when dividing by negative zero', () => {
  assert.throws(() => divide(10, -0), /Cannot divide by zero/);
});


