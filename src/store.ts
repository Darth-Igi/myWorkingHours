import {createStore, combineReducers} from 'redux'
import {devToolsEnhancer} from 'redux-devtools-extension'

import userSettingsReducer from './pages/user-settings/user-settings-reducer'


const reducers = combineReducers({
  userSettings: userSettingsReducer

})


const create = () => {
  return process.env.NODE_ENV === 'development'
    ? createStore(reducers, devToolsEnhancer({}))
    : createStore(reducers)
}

export default create()
