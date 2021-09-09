import { describe, it, expect, jest } from "@jest/globals";
import fs from "fs";
import { resolve } from "path";

import UploadHandler from "../../src/uploadHandler";
import TestUtil from "../_util/testUtil";

describe("UploadHandler", () => {
  const io = {
    to: (id) => io,
    emit: (event, message) => {},
  };

  describe("registerEvents", () => {
    it("should call onFile and onFinish functions on Busboy instance", () => {
      const uploadHandler = new UploadHandler({
        io,
        socketId: "01",
      });

      jest.spyOn(uploadHandler, uploadHandler.onFile.name).mockResolvedValue();

      const headers = {
        "content-type": "multipart/form-data; boundary=",
      };
      const onFinish = jest.fn();

      const busboyInstance = uploadHandler.registerEvents(headers, onFinish);
      const fileSteam = TestUtil.generateReadableSteam(["chunk", "of", "data"]);
      busboyInstance.emit("file", "fieldName", fileSteam, "fileName.txt");
      busboyInstance.listeners("finish")[0].call();

      expect(uploadHandler.onFile).toHaveBeenCalled();
      expect(onFinish).toHaveBeenCalled();
    });
  });

  describe("onFile", () => {
    it("should save stream file on disk", async () => {
      console.log("aqui");
      const chunks = ["1", "file"];
      const downloadsFolder = "/downloads";

      const handler = new UploadHandler({
        io,
        socketId: "01",
        downloadsFolder,
      });

      const onData = jest.fn();
      jest
        .spyOn(fs, fs.createWriteStream.name)
        .mockImplementation(() => TestUtil.generateWritableSteam(onData));
      const onTransform = jest.fn();
      jest
        .spyOn(handler, handler.handleFileBytes.name)
        .mockImplementation(() =>
          TestUtil.generateTransformStream(onTransform)
        );
      const params = {
        fieldName: "file",
        file: TestUtil.generateReadableSteam(chunks),
        fileName: "mock.txt",
      };
      await handler.onFile(...Object.values(params));

      expect(onData.mock.calls.join()).toStrictEqual(chunks.join());
      expect(onTransform.mock.calls.join()).toStrictEqual(chunks.join());
      expect(fs.createWriteStream).toHaveBeenCalledWith(
        resolve(handler.downloadsFolder, params.fileName)
      );
    });
  });
});
