import { useState } from 'react'
import User from '../user/user'
import styles from './editUserModal.module.css'
import { v4 as uuidv4 } from 'uuid'

import { useDispatch, useSelector } from 'react-redux'
import {
  editUser,
  removeUser,
  selectUserById,
  selectUsersEmails,
  selectFilteredIds,
  createUser,
} from '../../redux/usersSlice'
import CustomButton from '../customButton/customButton'

const EditUserModal = ({ userId, createMode, onCancel }) => {
  const dispatch = useDispatch()
  const usersIds = useSelector(selectFilteredIds)

  const reduxUser = useSelector((state) => selectUserById(state, userId))

  const generateUser = () => {
    let newId = uuidv4()
    while (usersIds.includes(newId)) {
      newId = uuidv4()
    }
    const user = {
      name: { title: 'Mr', first: 'John', last: 'Doe' },
      location: {
        street: { number: 10, name: 'Yaacov Caspi' },
        city: 'Haifa',
        country: 'Israel',
      },
      email: 'john.doh@gmail.com',
      image: 'https://randomuser.me/api/portraits/med/men/88.jpg',
      id: newId,
    }
    return user
  }

  const newUser = !createMode ? undefined : generateUser()

  const user = createMode ? newUser : reduxUser
  const emails = useSelector((state) => selectUsersEmails(state))

  const [eEmail, setEEmail] = useState(user.email)

  const [eLocation, setELocation] = useState(
    `${user.location.street.name} ${user.location.street.number}, ${user.location.city}, ${user.location.country}`
  )
  const [eName, setEName] = useState(
    `${user.name.title} ${user.name.first} ${user.name.last}`
  )

  const parseName = () => {
    const parsedNamesArr = eName.split(' ')
    if (parsedNamesArr.length === 0) {
      return {
        title: '',
        first: '',
        last: '',
      }
    } else if (parsedNamesArr.length === 1) {
      return {
        title: '',
        first: parsedNamesArr[0],
        last: '',
      }
    } else if (parsedNamesArr.length === 2) {
      return {
        title: '',
        first: parsedNamesArr[0],
        last: parsedNamesArr[1],
      }
    } else {
      return {
        title: parsedNamesArr[0],
        first: parsedNamesArr[1],
        last: parsedNamesArr.slice(2).join(' '),
      }
    }
  }

  const parseStreet = (streetParsed) => {
    const streetName = streetParsed.slice(0, streetParsed.length - 1).join(' ')
    const streetNumber = streetParsed[streetParsed.length - 1]

    return {
      name: streetName,
      number: streetNumber,
    }
  }

  const parseLocation = () => {
    const parsedLocationArr = eLocation.split(',')
    if (parsedLocationArr.length === 3) {
      const streetParsed = parsedLocationArr[0].split(' ')
      return {
        street: parseStreet(streetParsed),
        city: parsedLocationArr[1].trim(),
        country: parsedLocationArr[2].trim(),
      }
    } else {
      return {
        street: '',
        city: '',
        country: '',
      }
    }
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user?'
    )
    if (confirmed) {
      dispatch(removeUser({ userId: userId }))
    }
    onCancel()
  }

  const handleSave = () => {
    const location = parseLocation()
    const name = parseName()

    const validationUser = {
      ...user,
      name: name,
      location: location,
      email: eEmail,
    }

    if (validationUser.name.first.length < 3) {
      alert('First name should be at least 3 characters long')
      return
    }

    if (validationUser.name.last.length < 3) {
      alert('Last name should be at least 3 characters long')
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(validationUser.email)) {
      alert('Invalid email format')
      return
    }

    const emailOverlaps = emails.filter(
      (email) => validationUser.email === email
    ).length

    if (emailOverlaps > 0 && validationUser.email !== user.email) {
      alert('Email already exists')
      return
    }
    if (createMode) {
      dispatch(createUser({ user: validationUser }))
      console.log('validationUser', validationUser)
    } else {
      dispatch(editUser({ user: validationUser }))
    }
    onCancel()
  }

  const handleCancel = () => {
    onCancel()
  }

  return (
    <div className={styles.container}>
      <User
        userId={userId}
        newUser={newUser}
        editMode
        eName={eName}
        setEName={setEName}
        eEmail={eEmail}
        setEEmail={setEEmail}
        eLocation={eLocation}
        setELocation={setELocation}
      />
      <div className={styles.buttonContainer}>
        <CustomButton
          backgroundColor='green'
          type='button'
          onClick={handleSave}
        >
          save
        </CustomButton>
        <CustomButton
          backgroundColor='orange'
          type='button'
          onClick={handleCancel}
        >
          cancel
        </CustomButton>
        {!createMode && (
          <CustomButton
            backgroundColor='red'
            type='button'
            onClick={handleDelete}
          >
            delete
          </CustomButton>
        )}
      </div>
    </div>
  )
}
export default EditUserModal
