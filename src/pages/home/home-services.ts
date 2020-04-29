import {UserSettings} from '../user-settings/user-settings-reducer'
import {apiCall} from '../../utils/server-communication'
import {getFilteredPublicHolidays, getWorkingDaysSince} from '../../utils/date-calculations'
import {UserValues} from '../../reducers/user-values-reducer'
import Big from 'big.js'
import {Plugins} from '@capacitor/core'

const {Storage} = Plugins

const calculateOvertime = async (result: number | void, userSettings: UserSettings, dispatch: any): Promise<string> => {
  const shouldWorkingHours = (result ? result * userSettings.hoursPerWeek / userSettings.daysPerWeek : 0) - userSettings.initialOvertime

  const userValuesResult = await Storage.get(({key: 'user-values'}))
  const userValues: UserValues = userValuesResult.value ? JSON.parse(userValuesResult.value) as UserValues : {
    bookedTimes: [],
    bookedVacations: [],
    plannedHolidays: 0,
    leaveDaysAlreadyTaken: 0,
    remainingDaysOfVacation: 0,
    currentOvertime: ''
  }

  const bookedTimesSum = userValues.bookedTimes.reduce((acc: number, curr: { date: string, hours: number }): number => {
    return parseFloat(Big(curr.hours).plus(acc).valueOf())
  }, 0)
  const bookedVacationsSum = userValues.bookedVacations.reduce((acc: number, curr: { date: string, hours: number }): number => {
    return parseFloat(Big(curr.hours).plus(acc).valueOf())
  }, 0)

  return Big(bookedTimesSum).plus(bookedVacationsSum).minus(shouldWorkingHours).valueOf()
}

export const initializeApp = async (dispatch: any) => {
  console.log('initializeApp')
  const userSettingsResult = await Storage.get(({key: 'user-settings'}))

  if (userSettingsResult.value != null) {
    const userSettings: UserSettings = JSON.parse(userSettingsResult.value)
    const currentYear = new Date().getFullYear()

    apiCall('https://feiertage-api.de/api/', 'get', {jahr: currentYear, 'nur_land': userSettings.federalState})
      .then(result => {
          const filteredPublicHolidays = getFilteredPublicHolidays(result, userSettings)

          const storageKey = 'PublicHolidays_' + userSettings.federalState + currentYear
          Storage.set({
            key: storageKey,
            value: JSON.stringify(filteredPublicHolidays)
          }).then(
            () => {
              dispatch({
                type: 'USER_SETTINGS_SET',
                payload: {
                  federalState: userSettings.federalState,
                  hoursPerWeek: userSettings.hoursPerWeek,
                  daysPerWeek: userSettings.daysPerWeek,
                  vacationDaysPerYear: userSettings.vacationDaysPerYear,
                  captureSince: userSettings.captureSince,
                  initialOvertime: userSettings.initialOvertime
                }
              })
            })
        },
        error => console.error('error', error))


  } else {
    dispatch({type: 'USER_SETTINGS_OPEN_MODAL'})
  }
}

export const updateData = (dispatch: any, userSettings: UserSettings) => {
  getWorkingDaysSince(userSettings.federalState, userSettings.captureSince).then(
    workingDays => {
      return calculateOvertime(workingDays, userSettings, dispatch)
    }
  ).then(currentOvertime => {
    dispatch({
      type: 'USER_VALUES_SET_CURRENT_OVERTIME',
      payload: currentOvertime
    })
  })
}

export const isValidUserDataAvailable = (userSettings: any): boolean => {
  return userSettings.hoursPerWeek > 0 && userSettings.daysPerWeek > 0 && userSettings.vacationDaysPerYear > 0 && userSettings.federalState != null && userSettings.captureSince != null
}
