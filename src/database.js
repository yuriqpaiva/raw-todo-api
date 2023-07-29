import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => this.#persist());
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  selectAll(table) {
    const data = this.#database[table];
    return data;
  }

  selectOne(table, id) {
    if (!this.#database[table]) {
      return;
    }

    const rowIndex = this.#database[table].findIndex((item) => item.id === id);

    if (rowIndex === -1) {
      return;
    }

    return this.#database[table][rowIndex];
  }

  create(table, data) {
    if (!this.#database[table]) {
      this.#database[table] = [data];
      return;
    }

    this.#database[table].push(data);
    this.#persist();
  }

  update(table, id, data) {
    if (!this.#database[table]) {
      return;
    }

    const rowIndex = this.#database[table].findIndex((item) => item.id === id);

    if (rowIndex === -1) {
      return;
    }

    this.#database[table][rowIndex] = {
      ...this.#database[table][rowIndex],
      ...data,
    };

    this.#persist();
  }

  delete(table, id) {
    if (!this.#database[table]) {
      return;
    }

    const rowIndex = this.#database[table].findIndex((item) => item.id === id);

    if (rowIndex === -1) {
      return;
    }

    this.#database[table].splice(rowIndex, 1);
    this.#persist();
  }
}
