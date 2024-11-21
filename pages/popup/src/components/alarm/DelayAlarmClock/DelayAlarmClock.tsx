import { Button, Input, InputNumber, Space } from 'antd';
import { t } from '@extension/i18n';
import type { ChangeEvent } from 'react';
import { useMemo, useState } from 'react';
import type { AlarmInfo } from '../AlarmTypes';
import { ALARM_CLOCK, AlarmTimeType } from '../AlarmTypes';

import AlarmClock from '../AlarmClock/AlarmClock';

const DELAY_ALARM_CLOCK = ALARM_CLOCK + '_' + 'DelayAlarmClock';

const DelayAlarmClock: React.FC<{
  alarmList: AlarmInfo[];
  getAllAlarms: () => Promise<void>;
}> = ({ alarmList, getAllAlarms }) => {
  const [delayHour, setDelayHour] = useState<number | null>(null);
  const [delayMinute, setDelayMinute] = useState<number | null>(null);
  const [delaySecond, setDelaySecond] = useState<number | null>(null);
  const [delayPromptStr, setDelayPromptStr] = useState('');

  const delayAlarmList = useMemo(() => {
    return alarmList.filter(alarm => alarm.name.startsWith(DELAY_ALARM_CLOCK));
  }, [alarmList]);

  const alarmTimeChange = (num: number | null, type: AlarmTimeType) => {
    switch (type) {
      case AlarmTimeType.DELAY_HOUR_CHANGE:
        setDelayHour(num);
        break;
      case AlarmTimeType.DELAY_SECOND_CHANGE:
        setDelaySecond(num);
        break;
      case AlarmTimeType.DELAY_MINUTE_CHANGE:
        setDelayMinute(num);
        break;

      default:
        break;
    }
  };

  const alarmPromptChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDelayPromptStr(e.target.value);
  };

  const setAlarmClock = async () => {
    if (delayPromptStr.trim() === '') return;
    if (delayHour === null && delayMinute === null && delaySecond === null) return;
    const milliseconds = ((delayHour ?? 0) * 60 * 60 + (delayMinute ?? 0) * 60 + (delaySecond ?? 0)) * 1000;
    await chrome.alarms.create(DELAY_ALARM_CLOCK + '_' + Date.now() + '_' + delayPromptStr, {
      when: Date.now() + milliseconds,
      periodInMinutes: undefined,
    });
    setDelayHour(null);
    setDelayMinute(null);
    setDelaySecond(null);
    setDelayPromptStr('');
    getAllAlarms();
  };

  return (
    <AlarmClock alarmList={delayAlarmList} getAllAlarms={getAllAlarms}>
      <Space wrap>
        <InputNumber
          value={delayHour}
          min={1}
          max={24}
          placeholder={t('hour')}
          onChange={num => {
            alarmTimeChange(num, AlarmTimeType.DELAY_HOUR_CHANGE);
          }}
        />
        <InputNumber
          value={delayMinute}
          min={1}
          max={59}
          placeholder={t('minute')}
          onChange={num => {
            alarmTimeChange(num, AlarmTimeType.DELAY_MINUTE_CHANGE);
          }}
        />
        <InputNumber
          value={delaySecond}
          min={1}
          max={59}
          placeholder="秒"
          onChange={num => {
            alarmTimeChange(num, AlarmTimeType.DELAY_SECOND_CHANGE);
          }}
        />
        <Input placeholder={t('alarm_clock_prompt')} onChange={alarmPromptChange} value={delayPromptStr} />
        <Button type="primary" onClick={setAlarmClock}>
          设置
        </Button>
      </Space>
    </AlarmClock>
  );
};

export default DelayAlarmClock;
