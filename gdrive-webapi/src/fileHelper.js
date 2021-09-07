import fs from 'fs'
import prettyBytes from 'pretty-bytes'

export default class FileHelper {
  static async getFilesStatus(downloadsFolder) {
    const currentFiles = await fs.promises.readdir(downloadsFolder)
    const statuses = await Promise.all(currentFiles.map(file => fs.promises.stat(`${downloadsFolder}/${file}`)))

    return statuses.map((file, fileIndex) => {
      const { birthtime, size } = file

      return {
        size: prettyBytes(size),
        file: currentFiles[fileIndex],
        lastModified: birthtime,
        owner: process.env.USER
      }
    })
  }
}