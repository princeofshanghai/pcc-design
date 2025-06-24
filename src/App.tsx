import React from 'react';
import AppLayout from './components/Layout';
import CatalogPage from './pages/CatalogPage';
import './App.css';
import { ConfigProvider } from 'antd';
import blueTheme from './theme';

function App() {
  return (
    <ConfigProvider theme={blueTheme}>
      <AppLayout selectedKey="catalog">
        <CatalogPage />
      </AppLayout>
    </ConfigProvider>
  );
}

export default App;
