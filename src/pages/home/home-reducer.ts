export type HomeReducer = {
  openPopoverEvent: any,
  isPopoverOpen: boolean
}

export default (
  state: HomeReducer = {
    openPopoverEvent: null,
    isPopoverOpen: false,
  },
  action: any
) => {
  switch (action.type) {
    case 'HOME_OPEN_POPOVER':
      return {
        ...state,
        openPopoverEvent: action.payload,
        isPopoverOpen: true
      }
    case 'HOME_CLOSE_POPOVER':
      return {
        ...state,
        openPopoverEvent: null,
        isPopoverOpen: false
      }
    default:
      return {
        ...state
      }
  }
}
