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
import Storybook from './pages/Storybook';


// The following placeholder pages are missing. 
// To prevent import errors and keep the app running, 
// we'll use simple mock components for now.

const OffersPlaceholder = () => <div>Offers Placeholder</div>;
const OfferGroupsPlaceholder = () => <div>Offer Groups Placeholder</div>;
const RulesetsPlaceholder = () => <div>Rulesets Placeholder</div>;
const CalculationSchemesPlaceholder = () => <div>Calculation Schemes Placeholder</div>;
// The PicassoNPIPlaceholder import was causing an error because the file doesn't exist.
// We'll use a simple mock component for now to keep the app running.
const PicassoNPIPlaceholder = () => <div>Picasso NPI Placeholder</div>;

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
                <Route path="/storybook" element={<Storybook />} />
                <Route path="/picasso-npi" element={<PicassoNPIPlaceholder />} />
              </Route>
            </Routes>
          </LayoutProvider>
        </BreadcrumbProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;
