import { jest, describe, it, expect } from '@jest/globals'

import Routes from '../../src/routes'

describe('Routes', () => {  
  describe('setSocket', () => {
    it('should store io instance', () => {
      const routes = new Routes()
      
      const io = {
        to: (id) => io,
        emit: (event, message) => {}
      }

      routes.setSocketInstance(io)

      expect(routes.io).toStrictEqual(io)
    })
  })

  describe('handler', () => {
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
})