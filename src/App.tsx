import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import themeConfig from './theme';
import AppLayout from './components/Layout';
import Home from './pages/Home';

function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            {/* Add more routes here as you create more pages */}
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
