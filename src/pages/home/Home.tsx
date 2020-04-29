import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonLoading,
  IonModal,
  IonPage,
  IonPopover,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import {add, airplane, business, ellipsisHorizontal, ellipsisVertical} from 'ionicons/icons'
import {Trans, withTranslation} from 'react-i18next'

import UserSettingsComponent from '../user-settings/User-Settings'
import {UserValues} from '../../reducers/user-values-reducer'
import {UserSettings} from '../user-settings/user-settings-reducer'
import {initializeApp, isValidUserDataAvailable, updateData} from './home-services'

const dismissModal = (dispatch: any) => {
  dispatch({type: 'USER_SETTINGS_CLOSE_MODAL'})
}

type Home = {
  t: any,
  userSettings: UserSettings,
  dispatch: any,
  userValues: UserValues,
  openPopoverEvent: any,
  isPopoverOpen: boolean,
}

const Home: React.FC<Home> = ({t, dispatch, userSettings, userValues, openPopoverEvent, isPopoverOpen}) => {
  console.log('userSettings', userSettings)
  const {isModalOpen: isUserModalOpen} = userSettings
  const {currentOvertime, plannedHolidays} = userValues

  useEffect(() => {
    // console.log('runs useEffect', [currentOvertime, plannedHolidays, userSettings, dispatch])
    // if (userSettings == null || (!isUserModalOpen && !isValidUserDataAvailable(userSettings))) {
    //   initializeApp(dispatch)
    // }

    if (!userSettings.federalState) {
      initializeApp(dispatch)

    } else {
      updateData(dispatch, userSettings)
    }
  }, [currentOvertime, plannedHolidays, userSettings, dispatch])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="primary">
            <IonButton onClick={
              (popoverEvent) =>
                dispatch({
                  type: 'HOME_OPEN_POPOVER',
                  payload: popoverEvent.nativeEvent
                })
            }>
              <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical}/>
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
          <IonCard>
            <IonCardHeader>
              <IonCardTitle><Trans>my_overtime</Trans></IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {currentOvertime}
            </IonCardContent>
          </IonCard>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle><Trans>my_vacations</Trans></IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {plannedHolidays}
            </IonCardContent>
          </IonCard>
          <IonModal isOpen={isUserModalOpen}
                    onDidDismiss={() => {
                      dismissModal(dispatch)
                      initializeApp(dispatch)
                    }}>
            <UserSettingsComponent/>
          </IonModal>
          <IonPopover
            isOpen={isPopoverOpen}
            event={openPopoverEvent}
            onDidDismiss={() => dispatch({type: 'HOME_CLOSE_POPOVER'})}
          >
            <IonList lines="none">
              <IonItem button onClick={() => {
                dispatch({type: 'HOME_CLOSE_POPOVER'})
                dispatch({type: 'USER_SETTINGS_OPEN_MODAL'})
              }}>
                <Trans>user_settings</Trans>
              </IonItem>
            </IonList>
          </IonPopover>
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton>
              <IonIcon icon={add}/>
            </IonFabButton>
            <IonFabList side="top">
              <IonFabButton><IonIcon icon={business}/></IonFabButton>
              <IonFabButton><IonIcon icon={airplane}/></IonFabButton>
            </IonFabList>
          </IonFab>
        </>
      </IonContent>
    </IonPage>
  )
}

const mapStateToProps = (state: any) => {
  return {
    userSettings: state.userSettings,
    userValues: state.userValues,
    openPopoverEvent: state.homeReducer.openPopoverEvent,
    isPopoverOpen: state.homeReducer.isPopoverOpen
  }
}

export default withTranslation()(connect(mapStateToProps)(Home))
