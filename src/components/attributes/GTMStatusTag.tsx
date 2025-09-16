import React from 'react';
import { theme } from 'antd';
import type { GTMMotionStatus } from '../../utils/types';
import BaseChip, { type ChipVariant } from '../shared/BaseChip';
import { toSentenceCase } from '../../utils/formatters';

interface GTMStatusTagProps {
  status: GTMMotionStatus;
  variant?: ChipVariant;
}

type ColorType = 'success' | 'warning' | 'error' | 'default';

const statusConfig: Record<GTMMotionStatus, { description: string; colorType: ColorType }> = {
  'Draft': {
    description: 'Add, edit, or remove items. Collaborate with your team before submitting.',
    colorType: 'default',
  },
  'Submitted': {
    description: 'Motion is in the system. Items are locked, but details can still be updated.',
    colorType: 'warning',
  },
  'Activating in EI': {
    description: 'Changes are being deployed to testing environment. No action needed.',
    colorType: 'warning',
  },
  'Ready for Approvals': {
    description: 'Motion is ready. You can start the approval process when ready.',
    colorType: 'warning',
  },
  'Review in Progress': {
    description: 'Approval requests sent to stakeholders. Motion is locked during review.',
    colorType: 'warning',
  },
  'Approvals Completed': {
    description: 'All approvals complete! Set your activation date (minimum 72 hours).',
    colorType: 'warning',
  },
  'Scheduled for Activation': {
    description: 'Motion is approved and scheduled. Will activate automatically at the scheduled time.',
    colorType: 'warning',
  },
  'Activating in Prod': {
    description: 'Changes are going live now. This process cannot be stopped.',
    colorType: 'warning',
  },
  'Completed': {
    description: 'Success! All changes are now live.',
    colorType: 'success',
  },
  'Cancelled': {
    description: 'Motion was cancelled. No changes were made. Can be used as a template.',
    colorType: 'error',
  },
};

const GTMStatusTag: React.FC<GTMStatusTagProps> = ({ 
  status,
  variant = 'default'
}) => {
  const { token } = theme.useToken();
  
  const { description, colorType } = statusConfig[status];
  
  // Get color configuration based on status
  const getColors = () => {
    switch (colorType) {
      case 'success':
        return {
          backgroundColor: token.colorSuccessBg,
          textColor: token.colorSuccessText,
          borderColor: token.colorSuccessBorder,
        };
      case 'warning':
        return {
          backgroundColor: token.colorWarningBg,
          textColor: token.colorWarning,
          borderColor: token.colorWarningBorder,
        };
      case 'error':
        return {
          backgroundColor: token.colorErrorBg,
          textColor: token.colorErrorText,
          borderColor: token.colorErrorBorder,
        };
      default: // 'default' for neutral/gray
        return {
          backgroundColor: token.colorFillTertiary,
          textColor: token.colorTextSecondary,
          borderColor: token.colorBorder,
        };
    }
  };

  const colors = getColors();

  return (
    <BaseChip
      variant={variant}
      tooltip={description}
      backgroundColor={colors.backgroundColor}
      textColor={colors.textColor}
      borderColor={colors.borderColor}
    >
      {toSentenceCase(status)}
    </BaseChip>
  );
};

export default GTMStatusTag;
