/**
 * Static navigation configuration 
 * Separated from mock-data.ts to avoid dynamic/static import conflicts
 */

// Define the folder structure independently of products
// This allows us to show empty folders in the sidebar
export const folderStructure = {
  "Premium": [
    "Premium Core Products",
    "Premium Multiseat Products", 
    "Premium Company Page",
    "Premium Small Business",
    "Premium Entitlements"
  ],
  "LTS": [
    "Recruiter",
    "Learning",
    "Jobs",
    "Career Page",
    "API Products",
    "Glint",
    "Talent Insights"
  ],
  "LSS": [
    "All LSS Products"
  ],
  "LMS": [
    "All LMS Products"
  ],
  "Other": [
    "All Other Products"
  ]
};
