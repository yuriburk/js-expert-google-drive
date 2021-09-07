import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url';

import FileHelper from './fileHelper.js';
import { logger } from './logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url))
const defaultDownloadsFolder = resolve(__dirname, '../', 'downloads')

export default class Routes {
  io
  downloadsFolder
  fileHelper

  constructor(downloadsFolder = defaultDownloadsFolder) {
    this.downloadsFolder = downloadsFolder
    this.fileHelper = FileHelper
  }

  setSocketInstance(io) {
    this.io = io;
  }

  async defaultRoute(request, response) {
    response.end()
  }

  async options(request, response) {
    response.writeHead(204)
    response.end()
  }

  async post(request, response) {
    logger.info('post')
    response.end()
  }

  async get(request, response) {
    const files = await this.fileHelper.getFilesStatus(this.downloadsFolder)

    response.writeHead(200)
    response.end(JSON.stringify(files))
  }

  async handler(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*')
    const route = this[request.method.toLowerCase()] ?? this.defaultRoute

    return route.apply(this, [request, response])
  }
}