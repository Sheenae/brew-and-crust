import { createContext, useContext, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { useToast } from './ToastContext.jsx'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [ids, setIds] = useLocalStorage('bc_wishlist', [])
  const { showToast } = useToast()

  const toggleWishlist = useCallback(
    (productId, productName) => {
      setIds((prev) => {
        const isSaved = prev.includes(productId)
        showToast(
          isSaved ? `Removed ${productName} from favorites` : `Saved ${productName} to favorites`,
          'info',
        )
        return isSaved ? prev.filter((id) => id !== productId) : [...prev, productId]
      })
    },
    [setIds, showToast],
  )

  const isWishlisted = useCallback((productId) => ids.includes(productId), [ids])

  return (
    <WishlistContext.Provider value={{ ids, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
