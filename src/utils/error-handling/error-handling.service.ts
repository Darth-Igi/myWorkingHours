import EventEmitter from 'events'
import { useTranslation  } from 'react-i18next'

import {ErrorType} from './error-types'

type ErrorConfiguration = {
  popupTitle: string
  logoutUser: boolean
  showPopup: boolean
  autoClose: boolean
}

export class ErrorHandlingService {
  // @ts-ignore
  public errorEmitter$: EventEmitter = new EventEmitter()
  private t = useTranslation().t

  createErrorConfiguration(): ErrorConfiguration {
    const result: ErrorConfiguration = {
      logoutUser: false,
      showPopup: true,
      // result.popupTitle = 'Unerwarteter Fehler'
      popupTitle: this.t('error.popup_unexpected_error'),
      autoClose: false,
    }
    return result
  }

  createErrorConfigurationByErrorType(errorType: ErrorType): any {
    const result = this.createErrorConfiguration()
    switch (errorType) {
      case ErrorType.DEVICE_HAS_NO_CONNECTION:
        // result.popupTitle = 'Keine Internetverbindung'
        result.popupTitle = this.t('error.popup_error_no_connection')
        break
      case ErrorType.FORBIDDEN_CALL:
        // result.popupTitle = 'Keine Berechtigung'
        result.popupTitle = this.t('error.popup_error_no_permission')
        break
      case ErrorType.JSON_PARSE_FAILED:
        // result.popupTitle = 'Netzwerkfehler'
        result.popupTitle = this.t('error.popup_error_network_error')
        break
      case ErrorType.SERVER_IS_NOT_AVAILABLE:
        //  result.popupTitle = 'Server vorübergehend nicht verfügbar'
        result.popupTitle = this.t('error.popup_error_server_not_available')
        break
      default:
        break
    }
    return result
  }

  handleErrorWithErrorType(errorType: ErrorType): void {
    this.errorEmitter$.emit(this.createErrorConfigurationByErrorType(errorType))
  }

  handleErrorWithErrorConfiguration(errorConfiguration: any): void {
    this.errorEmitter$.emit(errorConfiguration)
  }
}
