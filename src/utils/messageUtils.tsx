import { message } from 'antd';

/**
 * Clean message utilities using Ant Design's built-in styling
 * These provide consistent toast messages across the app
 */

export const showSuccessMessage = (content: string, id?: string) => {
  if (id) {
    message.success({
      content: (
        <div>
          <div>{content}</div>
          <div style={{ 
            color: '#8c8c8c', 
            fontSize: '12px', 
            marginTop: '4px',
            fontVariantNumeric: 'tabular-nums'
          }}>
            {id}
          </div>
        </div>
      ),
      duration: 2.5,
    });
  } else {
    message.success(content);
  }
};

export const showErrorMessage = (content: string) => {
  message.error(content);
};

export const showWarningMessage = (content: string) => {
  message.warning(content);
};

export const showInfoMessage = (content: string) => {
  message.info(content);
};

export const showLoadingMessage = (content: string) => {
  return message.loading(content, 0); // 0 means don't auto-dismiss
};
