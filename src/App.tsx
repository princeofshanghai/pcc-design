import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import themeConfig from './theme';
import { Layout as AppLayout, ScrollToTop } from './components';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import { LayoutProvider } from './context/LayoutContext';
import SkuDetail from './pages/SkuDetail';
import PriceGroupDetail from './pages/PriceGroupDetail';

function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <Router>
        <ScrollToTop />
        <BreadcrumbProvider>
          <LayoutProvider>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Home />} />
                <Route path="folder/:folderName" element={<Home />} />
                <Route path="product/:productId" element={<ProductDetail />} />
                <Route path="product/:productId/sku/:skuId" element={<SkuDetail />} />
                <Route path="product/:productId/price-group/:priceGroupId" element={<PriceGroupDetail />} />
              </Route>
            </Routes>
          </LayoutProvider>
        </BreadcrumbProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;
