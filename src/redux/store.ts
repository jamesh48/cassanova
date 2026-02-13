import { configureStore } from '@reduxjs/toolkit'
import { cassanovaUnprotectedApi } from '@/redux/services/unprotected'
import rootReducer from './rootReducer'
import { cassanovaProtectedApi } from './services'

export default class GlobalStore {
  public store:
    | ReturnType<typeof GlobalStore.prototype.configureGlobalStore>
    | undefined

  static EnhancedStore: ReturnType<typeof this.prototype.configureGlobalStore>

  static RootState: ReturnType<(typeof this.EnhancedStore)['getState']>

  static AppDispatch: (typeof this.EnhancedStore)['dispatch']

  configureGlobalStore(initialState: unknown) {
    const innerStore = configureStore({
      reducer: {
        ...rootReducer,
        [cassanovaProtectedApi.reducerPath]: cassanovaProtectedApi.reducer,
        [cassanovaUnprotectedApi.reducerPath]: cassanovaUnprotectedApi.reducer,
      },
      preloadedState: initialState,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: { warnAfter: 100 } }).concat(
          cassanovaProtectedApi.middleware,
          cassanovaUnprotectedApi.middleware,
        ),
    })
    this.store = innerStore
    return innerStore
  }

  getStore() {
    return this.store
  }
}

export type RootState = typeof GlobalStore.RootState
export type AppDispatch = typeof GlobalStore.AppDispatch
