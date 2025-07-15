export interface TeamMember {
  fullName: string;
  ldap: string;
}

export const TEAM_MEMBERS = {
  CHARLES_HU: {
    fullName: 'Charles Hu',
    ldap: 'chhu'
  },
  LUXI_KANAZIR: {
    fullName: 'Luxi Kanazir',
    ldap: 'lkanazir'
  },
  ANTHONY_HOMAN: {
    fullName: 'Anthony Homan',
    ldap: 'ahoman'
  },
  TANMAY_KHEMKA: {
    fullName: 'Tanmay Khemka',
    ldap: 'tkhemka'
  },
  JORDAN_BADER: {
    fullName: 'Jordan Bader',
    ldap: 'jbader'
  }
} as const;

/**
 * Formats a user name for display in the UI
 * Takes either a full name or TeamMember object and returns LDAP format
 */
export function formatUserForDisplay(user: string | TeamMember): string {
  if (typeof user === 'string') {
    // Try to find matching team member by full name
    const teamMember = Object.values(TEAM_MEMBERS).find(member => member.fullName === user);
    return teamMember ? teamMember.ldap : user; // Fallback to original if not found
  }
  return user.ldap;
}

/**
 * Gets LDAP name from a full name string
 */
export function getUserLdap(fullName: string): string {
  return formatUserForDisplay(fullName);
}

/**
 * Gets full name from LDAP
 */
export function getFullNameFromLdap(ldap: string): string {
  const teamMember = Object.values(TEAM_MEMBERS).find(member => member.ldap === ldap);
  return teamMember ? teamMember.fullName : ldap;
} 