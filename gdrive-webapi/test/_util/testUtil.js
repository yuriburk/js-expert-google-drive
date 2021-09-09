import { Readable, Transform, Writable } from "stream";

export default class TestUtil {
  static generateReadableSteam(data) {
    return new Readable({
      objectMode: true,
      async read() {
        data.forEach((item) => {
          this.push(item);
        });

        this.push(null);
      },
    });
  }

  static generateWritableSteam(fn) {
    return new Writable({
      objectMode: true,
      write: (chunk, encoding, cb) => {
        fn(chunk);
        cb(null, chunk);
      },
    });
  }

  static generateTransformStream(fn) {
    return new Transform({
      objectMode: true,
      transform: (chunk, encoding, cb) => {
        fn(chunk);
        cb(null, chunk);
      },
    });
  }
}
