import {Plugins} from '@capacitor/core'
import axios, {Method} from 'axios'
import {ErrorType} from './error-handling/error-types'
import {HTTP_STATUS_FORBIDDEN, HTTP_STATUS_OK, HTTP_STATUS_SERVICE_UNAVAILABLE} from './http-statuscodes.type'

const {Network} = Plugins

const objToUrlParams = (object: any): string => {
  const objArray = Object.entries(object)
  return objArray.reduce((acc: string, curr, index): string => {
    const connector = index !== 0 ? '&' : ''
    return acc + connector + curr[0] + '=' + encodeURIComponent(curr[1] as any)
  }, '?')
}

const handleResponseErrorCode = (status: number): ErrorType => {
  if (status < HTTP_STATUS_OK || status >= 300) {
    let errorType: ErrorType = ErrorType.UNKNOWN
    switch (status) {
      case HTTP_STATUS_FORBIDDEN:
        errorType = ErrorType.FORBIDDEN_CALL
        break
      case HTTP_STATUS_SERVICE_UNAVAILABLE:
        errorType = ErrorType.SERVER_IS_NOT_AVAILABLE
        break
      default:
        break
    }
    return errorType
  }

  return ErrorType.UNKNOWN
}

export const apiCall = (url: string, type: string, requestParameters?: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    Network.getStatus().then(status => {
        const method = type ? type as Method : 'get'
        if (status.connected) {
          axios({
            method: method,
            url: url + (method === 'get' ? objToUrlParams(requestParameters) : ''),
            data: (method !== 'get' ? requestParameters : null)
          }).then(response => {
            resolve(response.data)
          })
            .catch(error => reject(handleResponseErrorCode(error.response.status)))
        } else {
          reject(ErrorType.DEVICE_HAS_NO_CONNECTION)
        }
      },
      error => {
        console.error('Network Status Error:', error)
        reject(ErrorType.UNKNOWN)
      })
  })
}
