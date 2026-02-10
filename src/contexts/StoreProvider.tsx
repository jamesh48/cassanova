'use client'
import { Provider } from 'react-redux'
import GlobalStore from '@/redux/store'

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={GlobalStore.prototype.configureGlobalStore({})}>
      {children}
    </Provider>
  )
}

export default StoreProvider
