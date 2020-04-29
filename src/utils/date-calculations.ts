import {Plugins} from '@capacitor/core'
import moment, {Moment} from 'moment'

const {Storage} = Plugins

const isDateAPublicHoliday = (date:Date|Moment, publicHolidays: any):boolean => {
  const result = publicHolidays.find((entry: any) =>  moment.utc(entry.data).isSame(date, 'day'))

  return !!result
}

const isWeekend = (date: Date|Moment):boolean => {
  const weekday:number = moment.utc(date).isoWeekday()

  return weekday > 5
}

const addWorkingDay = (currentDate: Date|Moment, sum: number, untilDate: Date, publicHolidays: any):number => {
  if (!currentDate || !untilDate) {
    return sum ? sum : 0
  }

  if (moment.utc(currentDate).isSame(untilDate, 'day')) {
    return isDateAPublicHoliday(untilDate, publicHolidays) || isWeekend(untilDate) ? sum : sum + 1
  }

  const newDate = moment.utc(currentDate).add(1, 'days')

  // TODO: consider daysPerWeek < 5
  return addWorkingDay(newDate, isDateAPublicHoliday(newDate, publicHolidays) || isWeekend(newDate) ? sum : sum + 1, untilDate, publicHolidays)

}

export const getPublicHolidays = async (federalState: string, currentYear: number) => {
  const storageKey = 'PublicHolidays_' + federalState + currentYear

  const publicHolidaysValue = await Storage.get(({key: storageKey}))
  return JSON.parse(publicHolidaysValue.value as string)
}

export const getWorkingDaysSince = async (federalState: string, captureSince: string, sinceDate?: string ):Promise<number> => {
  const fromDate: Moment = sinceDate ? moment(sinceDate) : moment(captureSince)
  const publicHolidays = await getPublicHolidays(federalState, fromDate.get('year'))

  return addWorkingDay(fromDate, 0, new Date(), publicHolidays)
}

export const getFilteredPublicHolidays = function (rawEntries: any, userSettings: any) {
  const publicHolidays = Object.entries(rawEntries)
  return publicHolidays.map(([key, value]) => ({
    name: key,
    data: (value as any).datum
  })).filter(({name}) =>
    name !== 'Gründonnerstag' &&
    !(name === 'Reformationstag' && userSettings.federalState === 'BW') &&
    name !== 'Augsburger Friedensfest' &&
    name !== 'Buß- und Bettag')
}


