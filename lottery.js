/**
 * A class for generating new lotto drawings and adding entries to the drawing
 */
const Lotto = class {
  /**
   * The number of numbers to draw for each ticket
   * @type {number}
   */
  #size;

  /**
   * The highest number possible to be generated in an entry
   * @type {number}
   */
  #highest;

  /**
   * A mapping of entries to usernames holding those entries
   * @type {Map<number[], string>}
   */
  #entryToName;

  /**
   * A mapping of usernames hto entries associated with those usernames
   * @type {Map<string, number[]>}
   */
  #nameToEntry;

  /**
   * Creates a new Lotto system with the specified size of entries
   * @param {number} size the size of the entries
   * @param {number} highest the highest number possible to be generated in
   * an entry
   */
  constructor(size, highest) {
    this.#entryToName = new Map();
    this.#nameToEntry = new Map();
    this.#size = size;
    this.#highest = highest;
  }

  /**
   * Returns a new `size`-tuple containing random number from 0 to `highest`
   * inclusive
   * @return {number[]} a new entry in the lotto
   */
  #generateNewEntry() {
    const entry = [];
    for (let i = 0; i < this.#size; i++) {
      entry.push(Math.floor(Math.random() * this.#highest));
    }
    return entry;
  }

  /**
   * Generates and stores a new entry for the given username if one has not
   * already been generate
   * @param {string} name the username to generate a new entry for
   * @return {(number[] | boolean)[]} a tuple of the generated entry and a
   * boolean representing if the entry already existed for the username
   */
  addEntry(name) {
    if (this.#nameToEntry.has(name)) {
      return [this.#nameToEntry.get(name), true];
    }
    const entry = this.#generateNewEntry();
    this.#nameToEntry.set(name, entry);
    this.#entryToName.set(entry, name);
    return [entry, false];
  }

  /**
   * Returns the winning lottery entry, along with the winner if any
   * @return {(number[] | string | undefined)[]} a tuple of the winning lottery
   * entry and the associated winner, or undefined otherwise
   */
  drawWinner() {
    const entry = this.#generateNewEntry();
    return [entry, this.#entryToName.get(entry)];
  }

  /**
   * Removes all entries from the system
   */
  clear() {
    this.#entryToName = new Map();
    this.#nameToEntry = new Map();
  }
};

/** The global Lotto object */
module.exports = new Lotto(5, 99);
