/**
 * Asserts that the provided arguments are valid numbers.
 * @param {...*} args - Arguments to validate.
 * @throws {TypeError} If any argument is not a valid number or is NaN.
 */
function assertNumeric(...args) {
  for (const arg of args) {
    if (typeof arg !== "number" || Number.isNaN(arg)) {
      throw new TypeError("Arguments must be valid numbers");
    }
  }
}

/**
 * Adds two numbers.
 * @param {number} a - First term.
 * @param {number} b - Second term.
 * @returns {number} Sum of a and b.
 */
function add(a, b) {
  assertNumeric(a, b);
  return a + b;
}

/**
 * Subtracts the second number from the first.
 * @param {number} a - Minuend.
 * @param {number} b - Subtrahend.
 * @returns {number} Difference of a and b.
 */
function subtract(a, b) {
  assertNumeric(a, b);
  return a - b;
}

/**
 * Multiplies two numbers.
 * @param {number} a - First factor.
 * @param {number} b - Second factor.
 * @returns {number} Product of a and b.
 */
function multiply(a, b) {
  assertNumeric(a, b);
  return a * b;
}

/**
 * Divides the first number by the second.
 * @param {number} a - Dividend.
 * @param {number} b - Divisor.
 * @returns {number} Quotient of a and b.
 * @throws {Error} If dividing by zero.
 */
function divide(a, b) {
  assertNumeric(a, b);
  if (b === 0 || Object.is(b, -0)) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

/**
 * Calculates base raised to the exponent power.
 * @param {number} base - Base number.
 * @param {number} exponent - Exponent power.
 * @returns {number} Result of base^exponent.
 */
function power(base, exponent) {
  assertNumeric(base, exponent);
  return Math.pow(base, exponent);
}

module.exports = { add, subtract, multiply, divide, power };

