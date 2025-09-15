import React, { useState } from 'react';
import { Button, Popover, Radio, DatePicker, Space, theme } from 'antd';
import { Calendar } from 'lucide-react';
import type { Dayjs } from 'dayjs';

interface ValiditySelectorProps {
  validityMode: 'current' | 'custom';
  onValidityModeChange: (mode: 'current' | 'custom') => void;
  customValidityDate: Dayjs | null;
  onCustomValidityDateChange: (date: Dayjs | null) => void;
}

const ValiditySelector: React.FC<ValiditySelectorProps> = ({
  validityMode,
  onValidityModeChange,
  customValidityDate,
  onCustomValidityDateChange,
}) => {
  const { token } = theme.useToken();
  const [open, setOpen] = useState(false);
  
  const content = (
    <Space direction="vertical" size="middle" style={{ width: 200 }}>
      <Radio.Group 
        value={validityMode} 
        onChange={(e) => onValidityModeChange(e.target.value)}
      >
        <Space direction="vertical">
          <Radio value="current">Today</Radio>
          <Radio value="custom">Specific date</Radio>
        </Space>
      </Radio.Group>
      
      {validityMode === 'custom' && (
        <DatePicker
          value={customValidityDate}
          onChange={(date) => {
            onCustomValidityDateChange(date);
            setOpen(false); // Close popover after date selection
          }}
          format="MMM DD, YYYY"
          placeholder="Select date"
          style={{ width: '100%' }}
          allowClear={false}
        />
      )}
    </Space>
  );

  const displayText = validityMode === 'current' 
    ? 'Active today' 
    : customValidityDate ? `Active on ${customValidityDate.format('MMM DD, YYYY')}` : 'Select date';

  return (
    <Popover
      content={content}
      title="Show prices active as of"
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomLeft"
    >
      <Button 
        icon={<Calendar size={12} />} 
        style={{ 
          minWidth: 140,
          fontSize: token.fontSizeSM,
          fontWeight: token.fontWeightStrong,
        }}
        size="middle"
      >
        {displayText}
      </Button>
    </Popover>
  );
};

export default ValiditySelector;
