import { configureStore } from '@reduxjs/toolkit'
import usersSlice from './usersSlice'

const store = configureStore({
  reducer: {
    usersSlice: usersSlice,
  },
})

export default store
