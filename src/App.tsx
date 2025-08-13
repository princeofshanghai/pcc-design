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
import ChangeRequestDetail from './pages/ChangeRequestDetail';
import ChangeRequestsList from './pages/ChangeRequestsList';
import OffersPlaceholder from './pages/OffersPlaceholder';
import OfferGroupsPlaceholder from './pages/OfferGroupsPlaceholder';
import RulesetsPlaceholder from './pages/RulesetsPlaceholder';
import CalculationSchemesPlaceholder from './pages/CalculationSchemesPlaceholder';
import PicassoNPIPlaceholder from './pages/PicassoNPIPlaceholder';
import PlatformEntityMappingPlaceholder from './pages/PlatformEntityMappingPlaceholder';

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
                <Route path="product/:productId/configuration/:requestId" element={<ChangeRequestDetail />} />
                <Route path="/offers" element={<OffersPlaceholder />} />
                <Route path="/offer-groups" element={<OfferGroupsPlaceholder />} />
                <Route path="/rulesets" element={<RulesetsPlaceholder />} />
                <Route path="/calculation-schemes" element={<CalculationSchemesPlaceholder />} />
                <Route path="/change-requests" element={<ChangeRequestsList />} />
                <Route path="/picasso-npi" element={<PicassoNPIPlaceholder />} />
                <Route path="/platform-entity-mapping" element={<PlatformEntityMappingPlaceholder />} />
              </Route>
            </Routes>
          </LayoutProvider>
        </BreadcrumbProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;
