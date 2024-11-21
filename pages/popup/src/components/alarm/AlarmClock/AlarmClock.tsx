import { DeleteTwoTone } from '@ant-design/icons';
import { Button, List, Splitter } from 'antd';
import AlarmItem from './AlarmItem/AlarmItem';
import type { AlarmInfo } from '../AlarmTypes';

const AlarmClock: React.FC<{
  alarmList: AlarmInfo[];
  getAllAlarms: () => Promise<void>;
  children: React.ReactNode;
}> = ({ alarmList, getAllAlarms, children }) => {
  const clearAllAlarms = () => {
    alarmList.forEach(alarm => {
      chrome.alarms.clear(alarm.name);
    });
    getAllAlarms();
  };
  return (
    <Splitter style={{ height: 250 }}>
      <Splitter.Panel defaultSize="40%" min="20%" max="70%">
        {children}
      </Splitter.Panel>
      <Splitter.Panel style={{ paddingLeft: 10 }}>
        <List
          header={<div>已有闹钟</div>}
          dataSource={alarmList}
          renderItem={item => (
            <List.Item
              actions={[
                <DeleteTwoTone
                  key="DeleteTwoTone"
                  onClick={() => {
                    chrome.alarms.clear(item.name, getAllAlarms);
                  }}
                />,
              ]}>
              <AlarmItem {...item} />
            </List.Item>
          )}
        />
        {alarmList.length > 0 && (
          <Button color="danger" variant="text" onClick={clearAllAlarms}>
            clear all
          </Button>
        )}
      </Splitter.Panel>
    </Splitter>
  );
};

export default AlarmClock;
