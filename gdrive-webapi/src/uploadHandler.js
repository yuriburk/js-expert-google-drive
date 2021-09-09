import Busboy from "busboy";
import { pipeline } from "stream/promises";
import fs from "fs";

import { logger } from "./logger";

export default class UploadHandler {
  constructor({ io, socketId, downloadsFolder }) {
    this.io = io;
    this.socketId = socketId;
    this.downloadsFolder = downloadsFolder;
  }

  handleFileBytes(fileName) {
    console.log("handle");
  }

  async onFile(fieldName, file, fileName) {
    const saveTo = `${this.downloadsFolder}/${fileName}`;
    await pipeline(
      // 1º get the readable stream
      file,
      // 2º convert data
      this.handleFileBytes.apply(this, [fileName]),
      // 3º writable stream
      fs.createWriteStream(saveTo)
    );

    logger.info(`File [${fileName}] finished`);
  }

  registerEvents(headers, onFinish) {
    const busboy = new Busboy({ headers });
    busboy.on("file", this.onFile.bind(this));
    busboy.on("finish", onFinish);

    return busboy;
  }
}
