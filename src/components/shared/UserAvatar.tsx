import React from 'react';
import { Avatar, Tooltip } from 'antd';
import { TEAM_MEMBERS, getFullNameFromLdap, getUserLdap } from '../../utils/users';
import type { TeamMember } from '../../utils/users';

interface UserAvatarProps {
  /** Either full name or LDAP username */
  user: string;
  /** Size of the avatar */
  size?: number | 'small' | 'default' | 'large';
  /** Whether to show tooltip with full user info */
  showTooltip?: boolean;
  /** Custom style */
  style?: React.CSSProperties;
  /** Custom className */
  className?: string;
}

// Predefined colors for consistent avatar colors
const AVATAR_COLORS = [
  '#1677ff', // Blue
  '#52c41a', // Green  
  '#722ed1', // Purple
  '#fa8c16', // Orange
  '#eb2f96', // Magenta
  '#13c2c2', // Cyan
  '#f5222d', // Red
  '#faad14', // Gold
  '#1890ff', // Light Blue
  '#52c41a', // Light Green
];

// Generate consistent color based on LDAP username
const getAvatarColor = (ldap: string): string => {
  let hash = 0;
  for (let i = 0; i < ldap.length; i++) {
    hash = ldap.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

// Get initials from full name
const getInitials = (fullName: string): string => {
  return fullName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2) // Take first 2 initials
    .join('');
};

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'default', 
  showTooltip = true,
  style = {},
  className = '',
  ...props 
}) => {
  // Determine if input is LDAP or full name
  const isLdap = Object.values(TEAM_MEMBERS).some(member => member.ldap === user);
  
  // Get both full name and LDAP
  const fullName = isLdap ? getFullNameFromLdap(user) : user;
  const ldap = isLdap ? user : getUserLdap(user);
  
  // Generate avatar properties
  const initials = getInitials(fullName);
  const backgroundColor = getAvatarColor(ldap);
  
  const avatarElement = (
    <Avatar
      size={size}
      style={{
        backgroundColor,
        color: '#ffffff',
        fontWeight: 500,
        cursor: showTooltip ? 'pointer' : 'default',
        ...style
      }}
      className={className}
      {...props}
    >
      {initials}
    </Avatar>
  );

  if (!showTooltip) {
    return avatarElement;
  }

  return (
    <Tooltip 
      title={
        <div>
          <div><strong>{fullName}</strong></div>
          <div style={{ opacity: 0.8 }}>@{ldap}</div>
        </div>
      }
      placement="top"
    >
      {avatarElement}
    </Tooltip>
  );
};

export default UserAvatar; 