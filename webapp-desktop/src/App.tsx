import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FeatureFlagProvider } from './context/FeatureFlagContext';
import { AppLayout } from './components/layout/AppLayout';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { SearchPage } from './pages/SearchPage';
import { SeatSelectionPage } from './pages/SeatSelectionPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter basename="/desktop">
      <ThemeProvider>
        <FeatureFlagProvider>
          <Routes>
            {/* Main app with sidebar layout */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<DiscoveryPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/events/:eventId" element={<EventDetailPage />} />
              <Route path="/events/:eventId/seats" element={<SeatSelectionPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
              <Route path="/tickets" element={<MyTicketsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </FeatureFlagProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
