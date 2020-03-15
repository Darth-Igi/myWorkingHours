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

  return addWorkingDay(newDate, isDateAPublicHoliday(newDate, publicHolidays) || isWeekend(newDate) ? sum : sum + 1, untilDate, publicHolidays)

}

export const getPublicHolidays = async (federalState: string, currentYear: number) => {
  const storageKey = 'PublicHolidays_' + federalState + currentYear

  const publicHolidaysValue = await Storage.get(({key: storageKey}))
  return JSON.parse(<string>publicHolidaysValue.value)
}

export const getWorkingDaysSince = async (federalState: string, sinceDate?: string|Date):Promise<number> => {
  const fromDate: Date = sinceDate ? new Date(sinceDate) : new Date(new Date().getFullYear(), 0, 1)
  const publicHolidays = await getPublicHolidays(federalState, fromDate.getFullYear())

  return addWorkingDay(fromDate, 0, new Date(), publicHolidays)
}


