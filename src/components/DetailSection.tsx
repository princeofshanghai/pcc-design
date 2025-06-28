import React from 'react';
import { Card } from 'antd';
import { toSentenceCase } from '../utils/formatting';

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

const DetailSection: React.FC<DetailSectionProps> = ({ title, children }) => {
  return (
    <Card
      title={toSentenceCase(title)}
      style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}
    >
      {children}
    </Card>
  );
};

export default DetailSection; 