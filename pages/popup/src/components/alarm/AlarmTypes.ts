export enum AlarmTimeType {
  DELAY_HOUR_CHANGE,
  DELAY_MINUTE_CHANGE,
  DELAY_SECOND_CHANGE,
}

export interface AlarmInfo extends chrome.alarms.Alarm {
  prompt: string;
}

export const ALARM_CLOCK = 'ALARM_CLOCK'
