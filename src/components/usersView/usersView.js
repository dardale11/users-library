import { useEffect } from 'react'
import {
  fetchRandomUsers,
  setFilter,
  selectFilteredIds,
} from '../../redux/usersSlice'
import User from '../user/user'
import styles from './usersView.module.css'
import { useDispatch, useSelector } from 'react-redux'
import CustomButton from '../customButton/customButton'

const UsersView = ({ userIdEdit, setUserIdEdit, createUser, createMode }) => {
  const dispatch = useDispatch()

  // preperatrion for API error handling
  // const { status, error } = useSelector((state) => state.usersSlice)

  const usersIds = useSelector(selectFilteredIds)

  const filterUsers = (e) => {
    const searchTerm = e.target.value.toLowerCase()
    console.log(searchTerm)
    dispatch(setFilter(searchTerm))
  }

  useEffect(() => {
    dispatch(fetchRandomUsers())
  }, [dispatch])

  return (
    <div className={userIdEdit || createMode ? styles.blur : undefined}>
      <div className={styles.header}>
        <input
          className='search-box'
          onInput={filterUsers}
          placeholder='Search...'
        />
        <CustomButton onClick={createUser}>Add</CustomButton>
      </div>
      <div className={styles.userCardContainer}>
        {usersIds.map((userId) => (
          <div key={userId} className={styles.userCard}>
            <User userId={userId} />
            <CustomButton type='button' onClick={() => setUserIdEdit(userId)}>
              edit
            </CustomButton>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UsersView
