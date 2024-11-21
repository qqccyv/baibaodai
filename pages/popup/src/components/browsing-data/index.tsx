import { t } from '@extension/i18n';
import type { CheckboxProps, CollapseProps } from 'antd';
import { Button, Card, Checkbox, Collapse, DatePicker, Divider, Flex, InputNumber, Select, Splitter, Switch } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';


type OriginTypes = chrome.browsingData.OriginTypes
type ArrayOriginTypes = Array<keyof OriginTypes>

type DataTypeSet = chrome.browsingData.DataTypeSet
type ArrayDataTypeSet = Array<keyof DataTypeSet>


const sourceDataTypeSet: ArrayDataTypeSet = [
  "appcache",
  "cache",
  "cacheStorage",
  "cookies",
  "downloads",
  "fileSystems",
  "formData",
  "history",
  "indexedDB",
  "localStorage",
  "passwords",
  "serviceWorkers",
  "webSQL"
]

const sourceOriginRelatedDataTypeSet: ArrayDataTypeSet = [
  "cacheStorage",
  "cookies",
  "fileSystems",
  "indexedDB",
  "localStorage",
  "serviceWorkers",
  "webSQL"
]

const originTypes: ArrayOriginTypes = ['unprotectedWeb', 'protectedWeb', 'extension']

const BrowsingDataOptions: React.FC = () => {

  const [dataTypeSet, setDataTypeSet] = useState<ArrayDataTypeSet>(sourceDataTypeSet)
  const [checkedList, setCheckedList] = useState<ArrayDataTypeSet>(dataTypeSet);
  const [originTypesCheckedList, setOriginTypesCheckedList] = useState<ArrayOriginTypes>(['unprotectedWeb']);
  const [tabList, setTabList] = useState<Array<{ value: string, label: string }>>([])
  const [origins, setOrigins] = useState<string[] | undefined>(undefined)
  const [excludeOrigins, setExcludeOrigins] = useState<string[] | undefined>(undefined)
  const [checked, setChecked] = useState<boolean>(true)
  const [minute, setMinute] = useState<number | null>(30);
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [removeLoading, setRemoveLoading] = useState<boolean>(false)

  const checkAll = dataTypeSet.length === checkedList.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < dataTypeSet.length;

  const onChange = (list: ArrayDataTypeSet) => {
    setCheckedList(list);
  };

  const onOriginTypesChange = (list: ArrayOriginTypes) => {
    setOriginTypesCheckedList(list);
  };

  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    setCheckedList(e.target.checked ? dataTypeSet : []);
  };



  useEffect(() => {
    if ((origins?.length ?? 0) > 0 || (excludeOrigins?.length ?? 0) > 0) {
      setDataTypeSet(sourceOriginRelatedDataTypeSet)
    } else {
      setDataTypeSet(sourceDataTypeSet)
    }
  }, [origins, excludeOrigins])

  useEffect(() => {
    chrome.tabs.query({}, (tabs) => {
      const tabList = new Set(tabs.filter(tab => {
        try {
          new URL(tab.url ?? '')
          return true
        } catch (error) {
          return false
        }
      }).map(tab => {
        return new URL(tab.url ?? '').origin
      }))

      setTabList([...tabList].map(origin => {
        return {
          value: origin,
          label: origin
        }
      }))
    })
  }, [])

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current > dayjs().endOf('day');
  };

  const clearBrowsingData = async () => {
    let since: number | undefined
    if (date) {
      since = date.valueOf()
    }
    if (minute) {
      since = new Date().getTime() - minute * 60 * 1000
    }
    const removalOptions: chrome.browsingData.RemovalOptions = {
      excludeOrigins,
      origins,
      originTypes: originTypesCheckedList.reduce((prev, curr) => {
        prev[curr] = true
        return prev
      }, {} as OriginTypes),
      since
    }

    const dataTypeSet: chrome.browsingData.DataTypeSet = checkedList.reduce((prev, curr) => {
      prev[curr] = true
      return prev
    }, {} as DataTypeSet)
    setRemoveLoading(true)
    try {
      await chrome.browsingData.remove(removalOptions, dataTypeSet)
      setRemoveLoading(false)
    } catch (error) {
      console.error(error);
      setRemoveLoading(false)
    }
  }

  return <Splitter style={{ height: 350 }}>
    <Splitter.Panel defaultSize="45%" min="20%" max="70%">
      <Divider >  浏览器数据类型</Divider>
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        check all
      </Checkbox>
      <Checkbox.Group options={dataTypeSet} value={checkedList} onChange={onChange} />
      <Divider >since</Divider>
      <Flex justify='space-between'>
        {checked ? <><label htmlFor='minute'>分钟：</label>
          <InputNumber
            value={minute}
            placeholder={t('minute')}
            onChange={setMinute}
            min={0}
            id='minute'
          /></>
          : <DatePicker
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={disabledDate}
            defaultValue={dayjs()}
            showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
            onChange={setDate}
            value={date}
          />}
        <Switch checkedChildren="按时间" unCheckedChildren="按日期" defaultChecked checked={checked} onChange={(checked) => { setChecked(checked); setDate(null); setMinute(null) }} />
      </Flex>
    </Splitter.Panel>
    <Splitter.Panel style={{ paddingLeft: 10 }}>
      <Divider >originTypes</Divider>
      <Checkbox.Group options={originTypes} value={originTypesCheckedList} onChange={onOriginTypesChange} />
      <Divider >origins</Divider>
      <Select
        mode="multiple"
        value={origins}
        style={{ width: '100%' }}
        onChange={(list) => { setOrigins(list); setExcludeOrigins(undefined) }}
        placeholder="Please select"
        options={tabList}
        allowClear
      />
      <Divider >excludeOrigins</Divider>
      <Select
        mode="multiple"
        value={excludeOrigins}
        style={{ width: '100%' }}
        onChange={(list) => { setOrigins(undefined); setExcludeOrigins(list) }}
        placeholder="Please select"
        options={tabList}
        allowClear
      />
      <Button type="primary" onClick={clearBrowsingData} style={{ marginTop: 10 }} loading={removeLoading}>
        清理
      </Button>
    </Splitter.Panel>
  </Splitter>
}

const BrowsingData: React.FC = () => {

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: '清理浏览器数据',
      children: <BrowsingDataOptions />,
    }
  ];

  useEffect(() => {

    return () => {

    };
  });

  return (
    <Card title='清理浏览器数据' style={{ width: 780 }}>
      <Collapse items={items} defaultActiveKey={['1']} accordion />
    </Card>
  );
};

export default BrowsingData;



