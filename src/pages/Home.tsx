import React from 'react';
import { Typography, Alert } from 'antd';

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <div>
      <Title level={2}>Reset Complete</Title>
      <Paragraph type="secondary">
        The project has been successfully reset to a clean and stable foundation.
      </Paragraph>
      <Alert
        message="Our New Approach"
        description={
          <Paragraph>
            From this point forward, we will build differently. Every new component will be created and tested in isolation before being added to this page. This disciplined, step-by-step process will ensure we never face a blank screen again.
          </Paragraph>
        }
        type="success"
        showIcon
      />
    </div>
  );
};

export default Home; 