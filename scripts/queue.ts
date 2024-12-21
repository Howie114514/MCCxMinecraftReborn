export class Queue<T> {
  items: T[] = [];
  minCount = 4;
  constructor(minCount = 4) {
    this.minCount = minCount;
  }
  enqueue(i: T) {
    this.items.push(i);
  }
  next(): T[] {
    let result = this.items.slice(this.items.length - this.minCount);
    this.items = this.items.slice(0, this.items.length - this.minCount);
    return result;
  }
  clear() {
    this.items = [];
  }
  remove(i: T) {
    this.items = this.items.filter((v) => i != v);
  }
}
