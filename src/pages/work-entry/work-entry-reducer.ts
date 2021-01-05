export type WorkEntryReducer = {
  openPopoverEvent: any,
  isPopoverOpen: boolean
}

export default (
  state: WorkEntryReducer = {
    openPopoverEvent: null,
    isPopoverOpen: false,
  },
  action: any
) => {
  switch (action.type) {
    case 'WORK_ENTRY_OPEN_POPOVER':
      return {
        ...state,
        openPopoverEvent: action.payload,
        isPopoverOpen: true
      }
    case 'WORK_ENTRY_CLOSE_POPOVER':
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
