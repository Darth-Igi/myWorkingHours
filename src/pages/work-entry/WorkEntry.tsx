import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar} from '@ionic/react'
import {ellipsisHorizontal, ellipsisVertical} from 'ionicons/icons'
import {Trans, withTranslation} from 'react-i18next'
import {UserSettings} from '../user-settings/user-settings-reducer'
import {UserValues} from '../../reducers/user-values-reducer'

type WorkEntry = {
  t: any,
  dispatch: any,
}

const WorkEntry: React.FC<WorkEntry> = ({t, dispatch}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
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
        dasdasda
      </IonContent>
    </IonPage>
  )
}

const mapStateToProps = (state: any) => {
  return {
    userSettings: state.userSettings,
    userValues: state.userValues,
  }
}

export default withTranslation()(connect(mapStateToProps)(WorkEntry))
