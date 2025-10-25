import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './constants/routes'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Account from './pages/Account'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import ProtectedRoute from './routes/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}> 
          <Route index element={<Home />} />
          <Route path={ROUTES.catalog} element={<Catalog />} />
          <Route path={ROUTES.product} element={<ProductDetail />} />
          <Route path={ROUTES.cart} element={<Cart />} />
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.checkout} element={<Checkout />} />
            <Route path={ROUTES.orders} element={<Orders />} />
            <Route path={ROUTES.orderDetail} element={<OrderDetail />} />
            <Route path={ROUTES.account} element={<Account />} />
          </Route>
          <Route path={ROUTES.login} element={<Login />} />
          <Route path={ROUTES.register} element={<Register />} />
          <Route path="/home" element={<Navigate to={ROUTES.home} replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
