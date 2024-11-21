import { t } from '@extension/i18n';
import type { CollapseProps } from 'antd';
import DelayAlarmClock from './DelayAlarmClock/DelayAlarmClock';
import { Card, Collapse } from 'antd';
import { useEffect, useState } from 'react';
import { ALARM_CLOCK, type AlarmInfo } from './AlarmTypes';
import ScheduledAlarmClock from './ScheduledAlarmClock/ScheduledAlarmClock';

const AlarmClock: React.FC = () => {
  const [permission, setPermission] = useState('');
  const [alarmList, setAlarmList] = useState<AlarmInfo[]>([]);

  const getAllAlarms = async () => {
    const list = await chrome.alarms.getAll();
    setAlarmList(
      list.filter(alarm => alarm.name.startsWith(ALARM_CLOCK)).map(alarm => {
        return {
          ...alarm,
          prompt: alarm.name.split('_').pop() || '',
        };
      }),
    );
  };

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: t('delay_alarm_clock'),
      children: <DelayAlarmClock alarmList={alarmList} getAllAlarms={getAllAlarms} />,
    },
    {
      key: '2',
      label: t('scheduled_alarm_clock'),
      children: <ScheduledAlarmClock alarmList={alarmList} getAllAlarms={getAllAlarms} />,
    },
    {
      key: '3',
      label: t('repeat_alarm'),
      children: <p>{'闹钟'}</p>,
    },
  ];

  useEffect(() => {
    chrome.notifications.getPermissionLevel(level => {
      setPermission(level);
    });

    const alarmListener: (alarm: chrome.alarms.Alarm) => void = () => {
      getAllAlarms();
    };
    chrome.alarms.onAlarm.addListener(alarmListener);
    getAllAlarms();

    // const onNotificationsButtonClicked: (notificationId: string, buttonIndex: number) => void = (notificationId, buttonIndex) => {
    //   console.log(notificationId, buttonIndex);

    // }
    // chrome.notifications.onButtonClicked.addListener(onNotificationsButtonClicked)
    return () => {
      // chrome.notifications.onButtonClicked.removeListener(onNotificationsButtonClicked)
      chrome.alarms.onAlarm.removeListener(alarmListener);
    };
  });

  return (
    <Card title={t('alarm') + '-' + '通知权限:' + permission} style={{ width: 780 }}>
      <Collapse items={items} accordion />
    </Card>
  );
};

export default AlarmClock;
