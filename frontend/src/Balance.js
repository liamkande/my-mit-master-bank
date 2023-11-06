import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore'
import { auth } from './firebase'

const Balance = () => {
  const [userData, setUserData] = useState(null) // Add a state for user data
  const [balance, setBalance] = useState(null)

  const fetchCurrentUserData = async () => {
    try {
      if (auth.currentUser) {
        const db = getFirestore()
        const usersCollection = collection(db, 'users')
        const userDocRef = doc(usersCollection, auth.currentUser.uid)

        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const userData = userDoc.data()
          setUserData(userData) // Set user data
          setBalance(userData.balance) // Set balance
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log('Sign-out successful.')
      })
      .catch((error) => {
        console.error('Error signing out:', error)
      })
  }

  useEffect(() => {
    // Fetch the current user's data when the component mounts
    fetchCurrentUserData()
      .then(() => {
        console.log('Fetched User successful.')
      })
      .catch((error) => {
        console.error('Error fetching user:', error)
      })
  }, [])

  const handleLogout = () => {
    handleSignOut()
  }

  return (
    <Card bg="info" text="white">
      <Card.Header>
        Balance
        {auth.currentUser && (
          <div>
            <h3>Welcome, {userData?.displayName}</h3>
            <p>Your Current Balance is : ${balance}</p>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </Card.Header>
    </Card>
  )
}

export default Balance
