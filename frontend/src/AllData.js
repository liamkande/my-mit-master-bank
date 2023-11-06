import React, { useState, useEffect } from 'react'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const AllData = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // Fetch data from Firestore in the production environment
      const fetchDataFromFirestore = async () => {
        try {
          const db = getFirestore()
          const accountsCollection = collection(db, 'users')
          const querySnapshot = await getDocs(accountsCollection)

          const accounts = []

          querySnapshot.forEach((accountDoc) => {
            accounts.push(accountDoc.data())
          })

          setData(accounts)
        } catch (error) {
          console.error('Error fetching data from Firestore:', error)
          setData([{ error: 'Error fetching data' }])
        }
      }

      fetchDataFromFirestore()
    } else {
      // Fetch all accounts from the API
      fetch('/account/all')
        .then((response) => response.json())
        .then((apiData) => {
          console.log(apiData)
          setData(apiData)
        })
    }
  }, [])

  return (
    <>
      <h5>All Data in Store:</h5>
      {data.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((account, index) => (
              <tr key={index}>
                <td>{account.name}</td>
                <td>{account.email}</td>
                <td>{account.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No data available</div>
      )}
    </>
  )
}

export default AllData
