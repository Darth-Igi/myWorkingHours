import {createStore, combineReducers} from 'redux'
import {devToolsEnhancer} from 'redux-devtools-extension'

import userSettingsReducer from './pages/user-settings/user-settings-reducer'
import userValuesReducer from './reducers/user-values-reducer'
import homeReducer from './pages/home/home-reducer'


const reducers = combineReducers({
  userSettings: userSettingsReducer,
  userValues: userValuesReducer,
  homeReducer: homeReducer,
})


const create = () => {
  return process.env.NODE_ENV === 'development'
    ? createStore(reducers, devToolsEnhancer({}))
    : createStore(reducers)
}

export default create()
