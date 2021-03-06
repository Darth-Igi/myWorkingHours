const replaceOneValue = (object: any, key: string, value: any) => {
  const obj = {...object}
  obj[key] = value

  return obj
}

export type UserSettings = {
  isLoading: boolean,
  isModalOpen: boolean,
  federalState: string,
  hoursPerWeek: number,
  daysPerWeek: number,
  vacationDaysPerYear: number,
  captureSince: string,
  initialOvertime: number,
  tempUserSettings: UserSettings,
}

export default (
  state = {
    isLoading: false,
    isModalOpen: false,
    federalState: null,
    hoursPerWeek: 0,
    daysPerWeek: 0,
    vacationDaysPerYear: 0,
    captureSince: null,
    initialOvertime: 0,
    tempUserSettings: {},
  },
  action: any
) => {
  switch (action.type) {
    case 'USER_SETTINGS_SET':
      return {
        ...state,
        isLoading: false,
        federalState: action.payload.federalState,
        hoursPerWeek: action.payload.hoursPerWeek,
        daysPerWeek: action.payload.daysPerWeek,
        vacationDaysPerYear: action.payload.vacationDaysPerYear,
        captureSince: action.payload.captureSince,
        initialOvertime: action.payload.initialOvertime,
        isModalOpen: false,
        tempUserSettings: {},
      }
    case 'USER_SETTINGS_UPDATE_TEMP':
      return {
        ...state,
        tempUserSettings: {
          federalState: action.payload.federalState,
          hoursPerWeek: action.payload.hoursPerWeek,
          daysPerWeek: action.payload.daysPerWeek,
          vacationDaysPerYear: action.payload.vacationDaysPerYear,
          captureSince: action.payload.captureSince,
          initialOvertime: action.payload.initialOvertime,
        }
      }
    case 'USER_SETTINGS_UPDATE_TEMP_ONE_VALUE':
      return {
        ...state,
        tempUserSettings: replaceOneValue(state.tempUserSettings, action.payload.key, action.payload.value)
      }
    case 'USER_SETTINGS_LOAD':
      return {
        ...state,
        isLoading: true
      }
    case 'USER_SETTINGS_OPEN_MODAL':
      return {
        ...state,
        isModalOpen: true,
        tempUserSettings: {
          federalState: state.federalState,
          hoursPerWeek: state.hoursPerWeek,
          daysPerWeek: state.daysPerWeek,
          vacationDaysPerYear: state.vacationDaysPerYear,
          captureSince: state.captureSince,
          initialOvertime: state.initialOvertime,
        }
      }
    case 'USER_SETTINGS_CLOSE_MODAL':
      return {
        ...state,
        isModalOpen: false,
        tempUserSettings: {}
      }

    default:
      return state
  }
}
