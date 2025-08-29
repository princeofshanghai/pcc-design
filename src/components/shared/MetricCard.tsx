import React from 'react';
import { Card, Typography, theme } from 'antd';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

const { Text } = Typography;

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  positive?: boolean;
}

const Sparkline: React.FC<SparklineProps> = ({ 
  data, 
  width = 100, 
  height = 40, 
  color, 
  positive = true 
}) => {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  // Create SVG path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline
        points={points}
        fill="none"
        stroke={color || (positive ? '#22c55e' : '#ef4444')}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Add a subtle gradient fill under the line */}
      <defs>
        <linearGradient id={`gradient-${color?.replace('#', '') || (positive ? 'green' : 'red')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color || (positive ? '#22c55e' : '#ef4444')} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color || (positive ? '#22c55e' : '#ef4444')} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#gradient-${color?.replace('#', '') || (positive ? 'green' : 'red')})`}
      />
    </svg>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
    timeframe: string;
  };
  sparklineData?: number[];
  onClick?: () => void;
  bottomLink?: {
    text: string;
    onClick: () => void;
  };
  style?: React.CSSProperties;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  sparklineData, 
  onClick,
  bottomLink,
  style 
}) => {
  const { token } = theme.useToken();

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      style={{
        height: '120px',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      styles={{
        body: {
          padding: '20px',
          height: '100%',
        },
      }}
    >
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%' 
      }}>
        {/* Title */}
        <Text 
          style={{ 
            fontSize: '13px', 
            color: token.colorTextSecondary,
            marginBottom: '4px',
            display: 'block',
          }}
        >
          {title}
        </Text>

        {/* Main content area */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          flex: 1 
        }}>
          <div style={{ flex: 1 }}>
            <Text 
              style={{ 
                fontSize: '24px', 
                fontWeight: 500, 
                lineHeight: '32px',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              {formatValue(value)}
            </Text>

            {change && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                flexWrap: 'nowrap'
              }}>
                {change.isPositive ? (
                  <TrendingUp size={14} style={{ color: token.colorSuccess, flexShrink: 0 }} />
                ) : (
                  <TrendingDown size={14} style={{ color: token.colorError, flexShrink: 0 }} />
                )}
                <Text 
                  style={{ 
                    fontSize: '13px', 
                    color: change.isPositive ? token.colorSuccess : token.colorError,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {change.isPositive ? '+' : ''}{change.value}%
                </Text>
                <Text style={{ 
                  fontSize: '13px', 
                  color: token.colorTextSecondary,
                  whiteSpace: 'nowrap',
                }}>
                  {change.timeframe}
                </Text>
              </div>
            )}

            {bottomLink && (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  cursor: 'pointer',
                  color: token.colorPrimary,
                  fontSize: '12px',
                  fontWeight: 500,
                  marginTop: change ? '0' : '8px', // Add margin if no change indicator above
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  bottomLink.onClick();
                }}
              >
                <span>{bottomLink.text}</span>
                <ArrowRight size={12} />
              </div>
            )}
          </div>

          {sparklineData && sparklineData.length > 1 && (
            <div style={{ marginLeft: '16px', alignSelf: 'flex-end', marginBottom: '12px' }}>
              <Sparkline 
                data={sparklineData} 
                width={80} 
                height={32}
                positive={change?.isPositive !== false}
                color={change?.isPositive === false ? token.colorError : token.colorSuccess}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;
