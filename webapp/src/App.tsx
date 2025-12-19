import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OptimizelyWrapper } from './optimizely/OptimizelyWrapper';
import { SeatSelectionPage } from './pages/SeatSelectionPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';

function App() {
  return (
    <BrowserRouter>
      <OptimizelyWrapper>
        <Routes>
          <Route path="/seats/:eventId" element={<SeatSelectionPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
          <Route path="/" element={<Navigate to="/seats/event-001" replace />} />
        </Routes>
      </OptimizelyWrapper>
    </BrowserRouter>
  );
}

export default App;
