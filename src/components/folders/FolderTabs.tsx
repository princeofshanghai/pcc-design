import React from 'react';
import { Folder } from 'lucide-react';
import { CountTag } from '../index';
import type { LOB } from '../../utils/types';

interface FolderTabsProps {
  folders: Array<{
    name: string;
    count: number;
  }>;
  activeFolder: string;
  onFolderChange: (folder: string) => void;
  lob: LOB;
}

const FolderTabs: React.FC<FolderTabsProps> = ({
  folders,
  activeFolder,
  onFolderChange,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        paddingBottom: '4px',
        scrollbarWidth: 'thin',
      }}
    >
      {/* All Folders Tab */}
      <div
        onClick={() => onFolderChange('All')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: activeFolder === 'All' ? '#f0f9ff' : '#fafafa',
          border: activeFolder === 'All' ? '1px solid #3b82f6' : '1px solid #e5e7eb',
          borderRadius: '12px',
          cursor: 'pointer',
          minWidth: 'fit-content',
          transition: 'all 0.2s ease',
          boxShadow: activeFolder === 'All' ? '0 1px 3px rgba(59, 130, 246, 0.1)' : 'none',
        }}
        onMouseEnter={(e) => {
          if (activeFolder !== 'All') {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
            e.currentTarget.style.borderColor = '#d1d5db';
          }
        }}
        onMouseLeave={(e) => {
          if (activeFolder !== 'All') {
            e.currentTarget.style.backgroundColor = '#fafafa';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }
        }}
      >
        <Folder 
          size={16} 
          color={activeFolder === 'All' ? '#3b82f6' : '#6b7280'} 
        />
        <span
          style={{
            fontSize: '14px',
            fontWeight: activeFolder === 'All' ? '600' : '500',
            color: activeFolder === 'All' ? '#1f2937' : '#6b7280',
          }}
        >
          All
        </span>
        <CountTag 
          count={folders.reduce((sum, folder) => sum + folder.count, 0)}
        />
      </div>

      {/* Individual Folder Tabs */}
      {folders.map((folder) => (
        <div
          key={folder.name}
          onClick={() => onFolderChange(folder.name)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: activeFolder === folder.name ? '#f0f9ff' : '#fafafa',
            border: activeFolder === folder.name ? '1px solid #3b82f6' : '1px solid #e5e7eb',
            borderRadius: '12px',
            cursor: 'pointer',
            minWidth: 'fit-content',
            transition: 'all 0.2s ease',
            boxShadow: activeFolder === folder.name ? '0 1px 3px rgba(59, 130, 246, 0.1)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (activeFolder !== folder.name) {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.borderColor = '#d1d5db';
            }
          }}
          onMouseLeave={(e) => {
            if (activeFolder !== folder.name) {
              e.currentTarget.style.backgroundColor = '#fafafa';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }
          }}
        >
          <Folder 
            size={16} 
            color={activeFolder === folder.name ? '#3b82f6' : '#6b7280'} 
          />
          <span
            style={{
              fontSize: '14px',
              fontWeight: activeFolder === folder.name ? '600' : '500',
              color: activeFolder === folder.name ? '#1f2937' : '#6b7280',
            }}
          >
            {folder.name}
          </span>
          <CountTag count={folder.count} />
        </div>
      ))}
    </div>
  );
};

export default FolderTabs; 