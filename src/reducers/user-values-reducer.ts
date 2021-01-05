export type WorkingTime = {
  date: string,
  workingHours: number,
  comeTime: string,
  leaveTime: string,
  pauseMinutes: number
}

export type VacationTime = {
  date: string,
  vacationHours: number
}

export type UserValues = {
  bookedTimes: WorkingTime[],
  bookedVacations: VacationTime[],
  plannedHolidays: number,
  leaveDaysAlreadyTaken: number,
  remainingDaysOfVacation: number,
  currentOvertime: string,
}

export default (
  state: UserValues = {
    bookedTimes: [],
    bookedVacations: [],
    plannedHolidays: 0,
    leaveDaysAlreadyTaken: 0,
    remainingDaysOfVacation: 0,
    currentOvertime: ''
  },
  action: any
) => {
  switch (action.type) {
    case 'USER_VALUES_SET_ALL':
      return {
        ...state,
        bookedTimes: action.payload.bookedTimes,
        bookedVacations: action.payload.bookedVacations,
        currentOvertime: action.payload.currentOvertime
      }
    case 'USER_VALUES_SET_BOOKED_TIMES':
      return {
        ...state,
        bookedTimes: action.payload
      }
    case 'USER_VALUES_SET_BOOKED_VACATIONS':
      return {
        ...state,
        bookedVacations: action.payload
      }
    case 'USER_VALUES_SET_CURRENT_OVERTIME':
      return {
        ...state,
        currentOvertime: action.payload
      }

    default:
      return state
  }
}
