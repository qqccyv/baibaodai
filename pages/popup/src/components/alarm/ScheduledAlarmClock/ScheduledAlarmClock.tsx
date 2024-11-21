import { Button, Input, Space } from 'antd';
import { t } from '@extension/i18n';
import type { ChangeEvent } from 'react';
import { useMemo, useState } from 'react';
import { ALARM_CLOCK, type AlarmInfo } from '../AlarmTypes';
import AlarmClock from '../AlarmClock/AlarmClock';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import { zhCN } from 'date-fns/locale/zh-CN';
import 'react-datepicker/dist/react-datepicker.css';
registerLocale('zhCN', zhCN);
setDefaultLocale('zhCN');
const SCHEDULED_ALARM_CLOCK = ALARM_CLOCK + '_' + 'ScheduledAlarmClock';

const ScheduledAlarmClock: React.FC<{
  alarmList: AlarmInfo[];
  getAllAlarms: () => Promise<void>;
}> = ({ alarmList, getAllAlarms }) => {
  const [delayPromptStr, setDelayPromptStr] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(getNext30MinuteTimestamp());

  function getNext30MinuteTimestamp() {
    // 获取当前时间
    const now = new Date();

    // 获取当前时间的分钟数
    const minutes = now.getMinutes();

    // 计算需要增加的分钟数
    let minutesToAdd = 30 - (minutes % 30);

    // 如果当前时间正好是30分钟的倍数，则增加30分钟
    if (minutes % 30 === 0) {
      minutesToAdd = 30;
    }

    // 增加分钟数
    now.setMinutes(now.getMinutes() + minutesToAdd);

    // 返回新的时间戳
    return now;
  }

  const delayAlarmList = useMemo(() => {
    return alarmList.filter(alarm => alarm.name.startsWith(SCHEDULED_ALARM_CLOCK));
  }, [alarmList]);

  const alarmPromptChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDelayPromptStr(e.target.value);
  };

  const setAlarmClock = async () => {
    if (delayPromptStr.trim() === '' || startDate === null) return;
    await chrome.alarms.create(SCHEDULED_ALARM_CLOCK + '_' + Date.now() + '_' + delayPromptStr, {
      when: startDate.getTime(),
      periodInMinutes: undefined,
    });

    setDelayPromptStr('');
    getAllAlarms();
  };

  const filterPassedTime = (time: Date) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const alarmTimeChange = (date: Date | null) => {
    console.log(date);
    date && setStartDate(date);
  };

  const onCalendarOpen = () => {
    if (startDate === null || startDate < new Date()) {
      setStartDate(getNext30MinuteTimestamp);
    }
  };

  return (
    <AlarmClock alarmList={delayAlarmList} getAllAlarms={getAllAlarms}>
      <Space wrap>
        <DatePicker
          minDate={new Date()}
          selected={startDate}
          onChange={alarmTimeChange}
          filterTime={filterPassedTime}
          dateFormat="MMMM d, yyyy h:mm aa"
          showTimeInput
          timeInputLabel="时间:"
          onCalendarOpen={onCalendarOpen}
        />
        <Input placeholder={t('alarm_clock_prompt')} onChange={alarmPromptChange} value={delayPromptStr} />
        <Button type="primary" onClick={setAlarmClock}>
          Submit
        </Button>
      </Space>
    </AlarmClock>
  );
};

export default ScheduledAlarmClock;
