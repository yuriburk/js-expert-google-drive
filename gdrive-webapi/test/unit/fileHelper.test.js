import { jest, describe, it, expect } from '@jest/globals'
import fs from 'fs'

import FileHelper from '../../src/fileHelper.js'

describe('FileHelper', () => {
  describe('getFilesStatus', () => {
    it('should return files statuses in correct format', async () => {
      const statMock = {
        dev: 1384022941,
        mode: 33206,
        nlink: 1,
        uid: 0,
        gid: 0,
        rdev: 0,
        blksize: 4096,
        ino: 7599824371250977,
        size: 1230598,
        blocks: 2408,
        atimeMs: 1631026163854.5835,
        mtimeMs: 1631026163709,
        ctimeMs: 1631026163709.0845,
        birthtimeMs: 1631026116510.506,
        atime: '2021-09-07T14:49:23.855Z',
        mtime: '2021-09-07T14:49:23.709Z',
        ctime: '2021-09-07T14:49:23.709Z',
        birthtime: '2021-09-07T14:48:36.511Z'
      }
      const mockUser = 'yuri'
      process.env.USER = mockUser
      const fileName = 'image.png'
      jest.spyOn(fs.promises, fs.promises.stat.name).mockResolvedValue(statMock)
      jest.spyOn(fs.promises, fs.promises.readdir.name).mockResolvedValue([fileName])

      const expectedResult = [{
        size: '1.23 MB',
        lastModified: statMock.birthtime,
        owner: mockUser,
        file: fileName
      }]

      const result = await FileHelper.getFilesStatus('/temp')

      expect(fs.promises.stat).toHaveBeenCalledWith(`/temp/${fileName}`)
      expect(result).toMatchObject(expectedResult)
    })
  })
})