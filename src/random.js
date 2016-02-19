const M = 80813;
const P = 3;

/**
 * A seeded random generator.
 */
export class Random {

  /**
   * Initializes with the seed.
   * @param {number} seed initial seed value
   */
  constructor(seed = 0) {
    this.s = seed;
    this.next();
  }

  /**
   * Generates next random number in sequence. This method uses the
   * sine function and some to get the next random number.
   * @return {number} random number in range [0, 1]
   */
  next() {
    let s = Math.sin(P + this.s) * M;
    s -= Math.floor(s);
    this.s = s;
    return s;
  }

  /**
   * Generates a random float in the specified range.
   * @param {number} s start
   * @param {number} e end
   * @return {number} random float
   */
  nextFloat(s = 0, e = 1) {
    return s + this.next() * (e - s);
  }

  /**
   * Generates a random integer in the specified range.
   * @param {number} s start
   * @param {number} e end which is inclusive
   * @return {number} random integer
   */
  nextInt(s = 0, e = 1) {
    return Math.round(this.nextFloat(s, e));
  }

  /**
   * Generates a random boolean value accounting for the bias and exponent.
   * @param {number} bias a positive number to stack odds
   * @param {number} exp power to which bias is raised
   * @return {boolean} random choice
   */
  choice(bias = 1, exp = 1) {
    return this.next() / Math.pow(bias, exp) < 0.5;
  }

  /**
   * Generates a string of random letters.
   * @param {number} n length of string
   * @return {string} random letters
   */
  letters(n = 1) {
    return Array.from(new Array(n), () => {
      return String.fromCharCode(this.nextInt(97, 122));
    }).join('');
  }

  /**
   * Generates a random color string.
   * @return {string} color in rgb() format
   */
  color() {
    return `rgb(${this.nextInt(0, 255)}, ${this.nextInt(0, 255)}, ${this.nextInt(0, 255)})`;
  }
}

export let random = new Random(Math.random() * Date.now());
