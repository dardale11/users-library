import { useSelector } from 'react-redux'
import styles from './user.module.css'
import { selectUserById } from '../../redux/usersSlice'

const User = ({
  userId,
  editMode = false,
  newUser = undefined,
  eName,
  setEName,
  eEmail,
  setEEmail,
  eLocation,
  setELocation,
}) => {
  const reduxUser = useSelector((state) => selectUserById(state, userId))
  const user = newUser ? newUser : reduxUser
  const inputBorders = editMode
    ? `${styles.showBorders}`
    : `${styles.hideBorders}`

  return (
    <div className={styles.container}>
      <img src={`${user.image}`} alt={`img-${user.uuid}`} />
      <h1 className={`${styles.names} ${styles.contentRow} ${inputBorders}`}>
        <input
          value={
            editMode
              ? eName
              : `${user.name.title} ${user.name.first} ${user.name.last}`
          }
          onChange={(e) => setEName(e.target.value)}
          readOnly={!editMode}
        />
      </h1>
      <div className={`${styles.contentRow} ${inputBorders}`}>
        <input
          value={editMode ? eEmail : user.email}
          onChange={(e) => setEEmail(e.target.value)}
          readOnly={!editMode}
        />
      </div>
      <div className={`${styles.contentRow} ${inputBorders}`}>
        <input
          value={
            editMode
              ? eLocation
              : `${user.location.street.name} ${user.location.street.number}, ${user.location.city}, ${user.location.country}`
          }
          readOnly={!editMode}
          onChange={(e) => setELocation(e.target.value)}
        />
      </div>
      <div className={styles.contentRow}>
        <label>id: {user.id}</label>
      </div>
    </div>
  )
}

export default User
