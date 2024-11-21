import { ALARM_CLOCK } from './../../../pages/popup/src/components/alarm/AlarmTypes';
const showNotification = (prompt: string, id: string) => {
  chrome.notifications.create(
    id,
    {
      type: 'basic',
      title: ' ',
      message: prompt,
      iconUrl: chrome.runtime.getURL('logo-200px.png'),
      requireInteraction: true,
      silent: false,
      // buttons: [{
      //   title: '关闭'
      // }]
    },
    (notificationId: string) => {
      console.log('触发通知：', notificationId);
    },
  );
};

const alarmListener: (alarm: chrome.alarms.Alarm) => void = alarm => {
  if (alarm.name.startsWith(ALARM_CLOCK)) {
    const alarmInfo = alarm.name.split('_');
    const prompt = alarmInfo.pop() || '';
    const id = alarmInfo.pop() || '';
    showNotification(prompt, id);
  }
};

chrome.alarms.onAlarm.addListener(alarmListener);
