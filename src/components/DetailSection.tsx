import React from 'react';
import { Card } from 'antd';
import { toSentenceCase } from '../utils/formatting';

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

const DetailSection: React.FC<DetailSectionProps> = ({ title, children }) => {
  return (
    <Card title={toSentenceCase(title)}>
      {children}
    </Card>
  );
};

export default DetailSection; 