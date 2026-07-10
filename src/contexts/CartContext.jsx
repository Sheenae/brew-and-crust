import { createContext, useContext, useMemo, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { useToast } from './ToastContext.jsx'

const CartContext = createContext(null)

const TAX_RATE = 0.08
const DELIVERY_FEE = 4.5
const FREE_DELIVERY_THRESHOLD = 35

// Mock coupon codes
const COUPONS = {
  BREW10: { type: 'percent', value: 10, label: '10% off' },
  CRUST5: { type: 'flat', value: 5, label: '$5 off' },
}

// A cart "line" is uniquely identified by product + size + sorted extras,
// so the same drink with different customizations stacks separately.
function lineKey(productId, sizeId, extraIds = []) {
  return [productId, sizeId, [...extraIds].sort().join('+')].join('::')
}

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('bc_cart_items', [])
  const [couponCode, setCouponCode] = useLocalStorage('bc_cart_coupon', null)
  const { showToast } = useToast()

  const addItem = useCallback(
    (product, { sizeId, sizeLabel, priceDelta = 0, extras = [], quantity = 1, notes = '' }) => {
      const key = lineKey(product.id, sizeId, extras.map((e) => e.id))
      setItems((prev) => {
        const existing = prev.find((it) => it.key === key)
        if (existing) {
          return prev.map((it) =>
            it.key === key ? { ...it, quantity: it.quantity + quantity } : it,
          )
        }
        const unitPrice = product.price + priceDelta + extras.reduce((s, e) => s + e.price, 0)
        return [
          ...prev,
          {
            key,
            productId: product.id,
            name: product.name,
            image: product.image,
            sizeId,
            sizeLabel,
            extras,
            unitPrice,
            quantity,
            notes,
          },
        ]
      })
      showToast(`Added ${product.name} to cart`, 'success')
    },
    [setItems, showToast],
  )

  const updateQuantity = useCallback(
    (key, quantity) => {
      if (quantity < 1) return
      setItems((prev) => prev.map((it) => (it.key === key ? { ...it, quantity } : it)))
    },
    [setItems],
  )

  const removeItem = useCallback(
    (key) => {
      setItems((prev) => prev.filter((it) => it.key !== key))
      showToast('Item removed from cart', 'info')
    },
    [setItems, showToast],
  )

  const clearCart = useCallback(() => {
    setItems([])
    setCouponCode(null)
  }, [setItems, setCouponCode])

  const applyCoupon = useCallback(
    (code) => {
      const normalized = code.trim().toUpperCase()
      if (COUPONS[normalized]) {
        setCouponCode(normalized)
        showToast(`Coupon applied: ${COUPONS[normalized].label}`, 'success')
        return true
      }
      showToast('That coupon code is not valid', 'error')
      return false
    },
    [setCouponCode, showToast],
  )

  const removeCoupon = useCallback(() => setCouponCode(null), [setCouponCode])

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0)
    let discount = 0
    if (couponCode && COUPONS[couponCode]) {
      const c = COUPONS[couponCode]
      discount = c.type === 'percent' ? subtotal * (c.value / 100) : Math.min(c.value, subtotal)
    }
    const discountedSubtotal = Math.max(subtotal - discount, 0)
    const tax = discountedSubtotal * TAX_RATE
    const delivery = items.length === 0 || discountedSubtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
    const total = discountedSubtotal + tax + delivery
    const itemCount = items.reduce((s, it) => s + it.quantity, 0)
    return { subtotal, discount, tax, delivery, total, itemCount, freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD }
  }, [items, couponCode])

  const value = {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    couponCode,
    couponInfo: couponCode ? COUPONS[couponCode] : null,
    applyCoupon,
    removeCoupon,
    totals,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
