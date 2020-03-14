import React from 'react'
import ReactDOM from 'react-dom'
// @ts-ignore
import {Provider} from 'react-redux'
import './i18n'
import App from './App'
import * as serviceWorker from './serviceWorker'
import store from './store'

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>, document.getElementById('root'))
}

render()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
