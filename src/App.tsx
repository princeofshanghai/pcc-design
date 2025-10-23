import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import 'antd/dist/reset.css';
import themeConfig from './theme';
import { Layout as AppLayout, ScrollToTop } from './components';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import { LayoutProvider } from './context/LayoutContext';

// Lazy load all page components for better performance
const Home = React.lazy(() => import('./pages/Home'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const SkuDetail = React.lazy(() => import('./pages/SkuDetail'));
const PriceGroupDetail = React.lazy(() => import('./pages/PriceGroupDetail'));
const ChangeRequestsList = React.lazy(() => import('./pages/ChangeRequestsList'));
const OffersPlaceholder = React.lazy(() => import('./pages/OffersPlaceholder'));
const OfferGroupsPlaceholder = React.lazy(() => import('./pages/OfferGroupsPlaceholder'));
const RulesetsPlaceholder = React.lazy(() => import('./pages/RulesetsPlaceholder'));
const CalculationSchemesPlaceholder = React.lazy(() => import('./pages/CalculationSchemesPlaceholder'));
const PicassoNPIPlaceholder = React.lazy(() => import('./pages/PicassoNPIPlaceholder'));
const PlatformEntityMappingPlaceholder = React.lazy(() => import('./pages/PlatformEntityMappingPlaceholder'));
const AttributeDictionary = React.lazy(() => import('./pages/AttributeDictionary'));
const GTMMotionList = React.lazy(() => import('./pages/GTMMotionList'));
const GTMMotionDetail = React.lazy(() => import('./pages/GTMMotionDetail'));
const GTMMotionChangesDetail = React.lazy(() => import('./pages/GTMMotionChangesDetail'));
const TestPriceChangesTable = React.lazy(() => import('./pages/TestPriceChangesTable'));

// Loading component for lazy-loaded pages
const PageLoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    width: '100%'
  }}>
    <Spin size="large" />
  </div>
);

function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <Router>
        <ScrollToTop />
        <BreadcrumbProvider>
          <LayoutProvider>
            <Suspense fallback={<PageLoadingSpinner />}>
              <Routes>
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<Home />} />
                  <Route path="folder/:folderName" element={<Home />} />
                  <Route path="lms-products" element={<Home />} />
                  <Route path="lss-products" element={<Home />} />
                  <Route path="lts-products" element={<Home />} />
                  <Route path="premium-products" element={<Home />} />
                  <Route path="other-products" element={<Home />} />
                  <Route path="product/:productId" element={<ProductDetail />} />
                  <Route path="product/:productId/sku/:skuId" element={<SkuDetail />} />
                  <Route path="product/:productId/price-group/:priceGroupId" element={<PriceGroupDetail />} />
                  <Route path="/offers" element={<OffersPlaceholder />} />
                  <Route path="/offer-groups" element={<OfferGroupsPlaceholder />} />
                  <Route path="/rulesets" element={<RulesetsPlaceholder />} />
                  <Route path="/calculation-schemes" element={<CalculationSchemesPlaceholder />} />
                  <Route path="/gtm-motions" element={<GTMMotionList />} />
                  <Route path="/gtm-motions/:motionId" element={<GTMMotionDetail />} />
                  <Route path="/gtm-motions/:motionId/items/:itemId/changes" element={<GTMMotionChangesDetail />} />
                  <Route path="/change-requests" element={<ChangeRequestsList />} />
                  <Route path="/picasso-npi" element={<PicassoNPIPlaceholder />} />
                  <Route path="/platform-entity-mapping" element={<PlatformEntityMappingPlaceholder />} />
                  <Route path="/attribute-dictionary" element={<AttributeDictionary />} />
                  <Route path="/test-price-changes-table" element={<TestPriceChangesTable />} />
                </Route>
              </Routes>
            </Suspense>
          </LayoutProvider>
        </BreadcrumbProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;
