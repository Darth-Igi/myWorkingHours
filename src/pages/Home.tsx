import React, {useEffect} from 'react'
// @ts-ignore
import {connect} from 'react-redux'
import {Plugins} from '@capacitor/core'
import {IonContent, IonHeader, IonLoading, IonModal, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon} from '@ionic/react'
import {Trans, withTranslation} from 'react-i18next'
import {ellipsisHorizontal, ellipsisVertical} from 'ionicons/icons'

import UserSettings from './user-settings/User-Settings'
import {apiCall} from '../utils/server-communication'

const {Storage} = Plugins

const isValidUserDataAvailable = (userSettings: any): boolean => {
  return userSettings.hoursPerWeek > 0 && userSettings.daysPerWeek > 0 && userSettings.vacationDaysPerYear > 0 && userSettings.federalState != null
}

const initializeApp = async (dispatch: any) => {
  const result = await Storage.get(({key: 'user-settings'}))

  if (result.value != null) {
    const userSettings = JSON.parse(result.value)
    dispatch({
      type: 'USER_SETTINGS_SET',
      payload: {
        federalState: userSettings.federalState,
        hoursPerWeek: userSettings.hoursPerWeek,
        daysPerWeek: userSettings.daysPerWeek,
        vacationDaysPerYear: userSettings.vacationDaysPerYear
      }
    })
    const year = new Date().getFullYear()
    apiCall('https://feiertage-api.de/api/', 'get', {jahr: year, 'nur_land': userSettings.federalState})
      .then(result => {
          const publicHolidays = Object.entries(result)
          const filteredPublicHolidays = publicHolidays.map(([key, value]) => ({
            name: key,
            data: (value as any).datum
          })).filter(({name}) =>
            name !== 'Gründonnerstag' &&
            !(name === 'Reformationstag' && userSettings.federalState === 'BW') &&
            name !== 'Augsburger Friedensfest' &&
            name !== 'Buß- und Bettag')

          console.log('filteredPublicHolidays', filteredPublicHolidays)

          const storageKey = 'PublicHolidays_' + userSettings.federalState + year
          Storage.set({
            key: storageKey,
            value: JSON.stringify(filteredPublicHolidays)
          })
        },
        error => console.error('error', error))

  } else {
    dispatch({type: 'USER_SETTINGS_OPEN_MODAL'})
  }
}

const dismissModal = (dispatch: any) => {
  dispatch({type: 'USER_SETTINGS_CLOSE_MODAL'})
}

type Home = {
  t: any,
  userSettings: any,
  dispatch: any
}

const Home: React.FC<Home> = ({t, dispatch, userSettings}) => {
  const {isModalOpen: isUserModalOpen} = userSettings

  useEffect(() => {
    if (userSettings == null || (!isUserModalOpen && !isValidUserDataAvailable(userSettings))) {
      initializeApp(dispatch)
    }
  })

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="primary">
            <IonButton onClick={() => dispatch({type: 'USER_SETTINGS_OPEN_MODAL'})}>
              <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical} />
            </IonButton>
          </IonButtons>
          <IonTitle><Trans>main_title</Trans></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <>
          <IonLoading
            isOpen={!isValidUserDataAvailable(userSettings) && !isUserModalOpen}
            message={t('please_wait')}
          />
          <div>
            The world is your oyster.
            <p>
              If you get lost, the{' '}
              <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/">
                docs
              </a>{' '}
              will be your guide.
            </p>
          </div>
          <IonModal isOpen={isUserModalOpen}
                    onDidDismiss={() => dismissModal(dispatch)}>
            <UserSettings/>
          </IonModal>
        </>
      </IonContent>
    </IonPage>
  )
}

const mapStateToProps = (state: any) => {
  return {
    userSettings: state.userSettings
  }
}

export default withTranslation()(connect(mapStateToProps)(Home))
