import { jest, describe, it, expect } from '@jest/globals'

import Routes from '../../src/routes'

describe('Routes', () => {
  const defaultParams = {
    request: {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: '',
      body: {}
    },
    response: {
      setHeader: jest.fn(),
      writeHead: jest.fn(),
      end: jest.fn()
    },
    values: () => Object.values(defaultParams)
  }

  describe('setSocket', () => {
    it('should store io instance', () => {
      const routes = new Routes()

      const io = {
        to: (id) => io,
        emit: (event, message) => { }
      }

      routes.setSocketInstance(io)

      expect(routes.io).toStrictEqual(io)
    })
  })

  describe('handler', () => {
    it('should choose default rote given an inexistent route', async () => {
      const routes = new Routes()
      const params = { ...defaultParams }

      params.request.method = 'inexistent'

      await routes.handler(...params.values())

      expect(params.response.end).toHaveBeenCalled()
    })

    it('should set any request with CORS enabled', async () => {
      const routes = new Routes()
      const params = { ...defaultParams }

      params.request.method = 'inexistent'

      await routes.handler(...params.values())

      expect(params.response.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*')
    })

    it('should choose options route given method OPTIONS', async () => {
      const routes = new Routes()
      const params = { ...defaultParams }

      params.request.method = 'OPTIONS'

      await routes.handler(...params.values())

      expect(params.response.writeHead).toHaveBeenCalledWith(204)
      expect(params.response.end).toHaveBeenCalled()
    })

    it('should choose options route given method POST', async () => {
      const routes = new Routes()
      const params = { ...defaultParams }

      params.request.method = 'POST'
      jest.spyOn(routes, routes.post.name).mockResolvedValue()

      await routes.handler(...params.values())

      expect(routes.post).toHaveBeenCalled()
    })

    it('should choose options route given method GET', async () => {
      const routes = new Routes()
      const params = { ...defaultParams }

      params.request.method = 'GET'
      jest.spyOn(routes, routes.get.name).mockResolvedValue()

      await routes.handler(...params.values())

      expect(routes.get).toHaveBeenCalled()
    })
  })

  describe('get', () => {
    it('should list all files downloaded when given method GET', async () => {
      const routes = new Routes()
      const params = { ...defaultParams }

      const filesMock = [{
        size: '1 MB',
        lastModified: '2021-09-07T14:48:36.511Z',
        owner: 'yuri',
        file: 'image.png'
      }]
      jest.spyOn(routes.fileHelper, routes.fileHelper.getFilesStatus.name).mockResolvedValue(filesMock)

      params.request.method = 'GET'
      await routes.get(...params.values())

      expect(params.response.writeHead).toHaveBeenCalledWith(200)
      expect(params.response.end).toHaveBeenCalledWith(JSON.stringify(filesMock))
    })
  })
})