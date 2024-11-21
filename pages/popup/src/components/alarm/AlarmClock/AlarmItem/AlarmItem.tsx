import type { AlarmInfo } from '../../AlarmTypes';
import './AlarmItem.css';
const AlarmItem: React.FC<AlarmInfo> = alarm => {
  const triggerTime = new Date(alarm.scheduledTime).toLocaleString();
  return (
    <div className="alarm-item">
      <div className="alarm-item-prompt">提醒语句:{alarm.prompt}</div>
      {alarm.periodInMinutes && <div className="alarm-item-periodInMinutes">触发间隔:{alarm.periodInMinutes}</div>}
      <div className="alarm-item-scheduledTime">触发时间:{triggerTime}</div>
    </div>
  );
};

export default AlarmItem;
