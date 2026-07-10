import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import StorefrontLayout from './layouts/StorefrontLayout.jsx'
import Landing from './pages/Landing/Landing.jsx'
import Shop from './pages/Shop/Shop.jsx'
import ProductDetails from './pages/ProductDetails/ProductDetails.jsx'
import Cart from './pages/Cart/Cart.jsx'
import Checkout from './pages/Checkout/Checkout.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
