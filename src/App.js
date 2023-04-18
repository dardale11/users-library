import { Provider } from 'react-redux'
import './App.css'
import store from './redux/store'
import UsersView from './components/usersView/usersView'
import EditUserModal from './components/editUserModal/editUserModal'
import { useState } from 'react'

const App = () => {
  const [userIdEdit, setUserIdEdit] = useState(undefined)
  const [createMode, setCreateMode] = useState(false)

  const createUser = () => setCreateMode(true)

  return (
    <Provider store={store}>
      <div className='App'>
        <UsersView
          userIdEdit={userIdEdit}
          setUserIdEdit={setUserIdEdit}
          createUser={createUser}
          createMode={createMode}
        />
        {(userIdEdit || createMode) && (
          <EditUserModal
            userId={userIdEdit}
            createMode={createMode}
            onCancel={() => {
              setUserIdEdit(undefined)
              setCreateMode(false)
            }}
          />
        )}
      </div>
    </Provider>
  )
}

export default App
