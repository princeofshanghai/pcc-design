import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import { Suspense, lazy } from 'react';
import 'antd/dist/reset.css';
import themeConfig from './theme';
import { Layout as AppLayout, ScrollToTop } from './components';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import { LayoutProvider } from './context/LayoutContext';

// Lazy load all page components for better performance
const Home = lazy(() => import('./pages/Home'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const SkuDetail = lazy(() => import('./pages/SkuDetail'));
const PriceGroupDetail = lazy(() => import('./pages/PriceGroupDetail'));

const ChangeRequestsPlaceholder = lazy(() => import('./pages/ChangeRequestsPlaceholder'));
const OffersPlaceholder = lazy(() => import('./pages/OffersPlaceholder'));
const OfferGroupsPlaceholder = lazy(() => import('./pages/OfferGroupsPlaceholder'));
const RulesetsPlaceholder = lazy(() => import('./pages/RulesetsPlaceholder'));
const CalculationSchemesPlaceholder = lazy(() => import('./pages/CalculationSchemesPlaceholder'));
const PicassoNPIPlaceholder = lazy(() => import('./pages/PicassoNPIPlaceholder'));
const PlatformEntityMappingPlaceholder = lazy(() => import('./pages/PlatformEntityMappingPlaceholder'));
const AttributeDictionary = lazy(() => import('./pages/AttributeDictionary'));

// Loading component for route transitions
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px' 
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
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={
                  <Suspense fallback={<PageLoader />}>
                    <Home />
                  </Suspense>
                } />
                <Route path="folder/:folderName" element={
                  <Suspense fallback={<PageLoader />}>
                    <Home />
                  </Suspense>
                } />
                <Route path="product/:productId" element={
                  <Suspense fallback={<PageLoader />}>
                    <ProductDetail />
                  </Suspense>
                } />
                <Route path="product/:productId/sku/:skuId" element={
                  <Suspense fallback={<PageLoader />}>
                    <SkuDetail />
                  </Suspense>
                } />
                <Route path="product/:productId/price-group/:priceGroupId" element={
                  <Suspense fallback={<PageLoader />}>
                    <PriceGroupDetail />
                  </Suspense>
                } />

                <Route path="/offers" element={
                  <Suspense fallback={<PageLoader />}>
                    <OffersPlaceholder />
                  </Suspense>
                } />
                <Route path="/offer-groups" element={
                  <Suspense fallback={<PageLoader />}>
                    <OfferGroupsPlaceholder />
                  </Suspense>
                } />
                <Route path="/rulesets" element={
                  <Suspense fallback={<PageLoader />}>
                    <RulesetsPlaceholder />
                  </Suspense>
                } />
                <Route path="/calculation-schemes" element={
                  <Suspense fallback={<PageLoader />}>
                    <CalculationSchemesPlaceholder />
                  </Suspense>
                } />
                <Route path="/change-requests" element={
                  <Suspense fallback={<PageLoader />}>
                    <ChangeRequestsPlaceholder />
                  </Suspense>
                } />
                <Route path="/picasso-npi" element={
                  <Suspense fallback={<PageLoader />}>
                    <PicassoNPIPlaceholder />
                  </Suspense>
                } />
                <Route path="/platform-entity-mapping" element={
                  <Suspense fallback={<PageLoader />}>
                    <PlatformEntityMappingPlaceholder />
                  </Suspense>
                } />
                <Route path="/attribute-dictionary" element={
                  <Suspense fallback={<PageLoader />}>
                    <AttributeDictionary />
                  </Suspense>
                } />
              </Route>
            </Routes>
          </LayoutProvider>
        </BreadcrumbProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;
