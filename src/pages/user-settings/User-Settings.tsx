import React, {FormEvent} from 'react'
import {connect} from 'react-redux'
import {Plugins} from '@capacitor/core'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  IonTitle,
  IonToolbar,
  isPlatform,
  IonSelect,
  IonSelectOption, IonDatetime
} from '@ionic/react'
import {Trans, withTranslation} from 'react-i18next'
import {close} from 'ionicons/icons'

import {FederalStates} from '../../utils/static-variables.types'
import {UserSettings} from './user-settings-reducer'
import moment from 'moment'

const {Storage} = Plugins

type UserSettingsComponent = {
  userSettings: UserSettings,
  dispatch: any,
  t: any,
}

const UserSettingsComponent: React.FC<UserSettingsComponent> = ({userSettings, dispatch, t}) => {
  const slot = isPlatform('ios') ? 'primary' : 'start'
  const {tempUserSettings} = userSettings

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault()

    Storage.set({
      key: 'user-settings',
      value: JSON.stringify(tempUserSettings)
    }).then(result => {
      dispatch({
        type: 'USER_SETTINGS_SET',
        payload: {
          federalState: tempUserSettings.federalState,
          hoursPerWeek: tempUserSettings.hoursPerWeek,
          daysPerWeek: tempUserSettings.daysPerWeek,
          vacationDaysPerYear: tempUserSettings.vacationDaysPerYear,
          captureSince: tempUserSettings.captureSince,
          initialOvertime: tempUserSettings.initialOvertime
        }
      })
    }, error => console.error(error))
  }

  const handleChange = (event: any) => {
    const value = event.target.name === 'captureSince' ? moment(event.target.value).format('YYYY-MM-DD') : event.target.value

    dispatch({
      type: 'USER_SETTINGS_UPDATE_TEMP_ONE_VALUE',
      payload: {
        key: event.target.name,
        value: value
      }
    })
  }

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot={slot}>
            <IonButton onClick={() => dispatch({type: 'USER_SETTINGS_CLOSE_MODAL'})}>
              <IonIcon slot="icon-only" icon={close}/>
            </IonButton>
          </IonButtons>
          <IonButtons slot="secondary">
            <button
              type="submit"
              form="user-setting-form"
              style={{
                background: 'none',
                outline: 'none'
              }}
            >
              <IonButton>
                <Trans>save</Trans>
              </IonButton>
            </button>
          </IonButtons>
          <IonTitle><Trans>user_settings</Trans></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form id="user-setting-form" onSubmit={handleOnSubmit}>
          <IonItem>
            <IonLabel position="stacked"><Trans>hours_per_week</Trans><IonText color="danger"> *</IonText></IonLabel>
            <IonInput
              inputmode="decimal"
              required
              min="1"
              type="number"
              name="hoursPerWeek"
              value={tempUserSettings.hoursPerWeek}
              onIonChange={event => handleChange(event)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked"><Trans>days_per_week</Trans><IonText color="danger"> *</IonText></IonLabel>
            <IonInput
              inputmode="decimal"
              required
              min="1"
              type="number"
              name="daysPerWeek"
              value={tempUserSettings.daysPerWeek}
              onIonChange={event => handleChange(event)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked"><Trans>vacation_days_per_year</Trans><IonText color="danger"> *</IonText></IonLabel>
            <IonInput
              inputmode="decimal"
              required
              min="4"
              type="number"
              name="vacationDaysPerYear"
              value={tempUserSettings.vacationDaysPerYear}
              onIonChange={event => handleChange(event)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked"><Trans>initial_overtime</Trans><IonText color="danger"> *</IonText></IonLabel>
            <IonInput
              inputmode="decimal"
              required
              type="number"
              name="initialOvertime"
              value={tempUserSettings.initialOvertime}
              onIonChange={event => handleChange(event)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked"><Trans>capture_since</Trans><IonText color="danger"> *</IonText></IonLabel>
            <IonDatetime
              displayFormat="DD. MMM. YYYY"
              placeholder={t('select_date')}
              name="captureSince"
              value={tempUserSettings.captureSince}
              onIonChange={event => handleChange(event)}></IonDatetime>
          </IonItem>
          <IonItem>
            <IonLabel><Trans>federal_state</Trans></IonLabel>
            <IonSelect
              value={tempUserSettings.federalState}
              okText={t('select')}
              cancelText={t('dismiss')}
              name="federalState"
              onIonChange={event => handleChange(event)}
            >
              {
                Object.entries(FederalStates).map(state => {
                  return (
                    <IonSelectOption value={state[0]} key={state[0]}>{state[1]}</IonSelectOption>
                  )
                })
              }

            </IonSelect>
          </IonItem>
        </form>
      </IonContent>
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    userSettings: state.userSettings
  }
}

export default withTranslation()(connect(mapStateToProps)(UserSettingsComponent))
