import '@ant-design/v5-patch-for-react-19';
import 'antd/dist/reset.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd';
import App from './App.tsx'
import themeConfig from './theme'
import './index.css'

// Configure static methods (like message) to use dark theme
ConfigProvider.config({
  holderRender: (children) => (
    <ConfigProvider theme={themeConfig}>
      {children}
    </ConfigProvider>
  ),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={themeConfig}>
    <App />
    </ConfigProvider>
  </React.StrictMode>,
)
