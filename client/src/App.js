import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import OrdersPage from "./pages/OrdersPage";

function App() {
  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      <div className="bg-gray-800 text-white p-4 flex gap-4">
        <Link to="/" className="hover:underline">Menu</Link>
        <Link to="/orders" className="hover:underline">Orders</Link>
      </div>

      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
