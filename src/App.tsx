import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import themeConfig from './theme';
import AppLayout from './components/Layout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import { LayoutProvider } from './context/LayoutContext';

function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <Router>
        <BreadcrumbProvider>
          <LayoutProvider>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Home />} />
                <Route path="product/:productId" element={<ProductDetail />} />
              </Route>
            </Routes>
          </LayoutProvider>
        </BreadcrumbProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;
