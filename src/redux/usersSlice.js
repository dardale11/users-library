import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchRandomUsers = createAsyncThunk(
  'usersSlice/fetchRandomUsers',
  async () => {
    console.log('fetchRandomUsers called')
    const response = await axios.get('https://randomuser.me/api/?results=10')
    return response.data.results.map((user) => ({
      name: user.name,
      location: {
        street: user.location.street,
        city: user.location.city,
        country: user.location.country,
      },
      email: user.email,
      image: user.picture.medium,
      id: user.login.uuid,
    }))
  }
)

export const selectFilteredIds = (state) => {
  const filter = state.usersSlice.filter.toLowerCase()
  return state.usersSlice.users
    .filter(
      (user) =>
        user.name.first.toLowerCase().includes(filter) ||
        user.name.last.toLowerCase().includes(filter) ||
        user.location.street.name.toLowerCase().includes(filter) ||
        user.location.city.toLowerCase().includes(filter) ||
        user.location.country.toLowerCase().includes(filter) ||
        user.email.toLowerCase().includes(filter) ||
        user.id.toLowerCase().includes(filter)
    )
    .map((user) => user.id)
}

const initialState = {
  users: [],
  filter: '',
  // preparation for API error handling
  status: 'idle',
  error: null,
}

const usersSlice = createSlice({
  name: 'usersSlice',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload
    },
    setFilter: (state, action) => {
      state.filter = action.payload
    },
    createUser: (state, action) => {
      const { user } = action.payload
      state.users.unshift(user)
    },
    removeUser: (state, action) => {
      const { userId } = action.payload
      state.users = state.users.filter((user) => user.id !== userId)
    },
    editUser: (state, action) => {
      const { user } = action.payload
      const userIndex = state.users.findIndex(
        (userElm) => userElm.id === user.id
      )
      if (userIndex !== -1) {
        state.users[userIndex] = user
      } else {
        console.log(
          'somthing went wrong during update, could not find user id :-('
        )
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandomUsers.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchRandomUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.users = [...state.users, ...action.payload]
      })
      .addCase(fetchRandomUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { editUser, setUsers, setFilter, createUser, removeUser } =
  usersSlice.actions

export const selectUsers = (state) => state.usersSlice.users

export const selectUsersIds = (state) =>
  state.usersSlice.users.map((user) => user.id)

export const selectUserById = (state, userId) =>
  state.usersSlice.users.find((user) => user.id === userId)

export const selectUsersEmails = (state) =>
  state.usersSlice.users.map((user) => user.email)

export const filterUsersId = (state, userId) =>
  state.usersSlice.users.find((user) => user.id === userId)

export default usersSlice.reducer
