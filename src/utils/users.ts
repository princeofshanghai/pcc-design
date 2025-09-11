export interface TeamMember {
  fullName: string;
  ldap: string;
}

export const TEAM_MEMBERS = {
  CHARLES_HU: {
    fullName: 'charles hu',
    ldap: 'chhu'
  },
  LUXI_KANAZIR: {
    fullName: 'luxi kanazir',
    ldap: 'lkanazir'
  },
  ANTHONY_HOMAN: {
    fullName: 'anthony homan',
    ldap: 'ahoman'
  },
  GEORGE_SO: {
    fullName: 'george so',
    ldap: 'geso'
  },
  JORDAN_BADER: {
    fullName: 'jordan bader',
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