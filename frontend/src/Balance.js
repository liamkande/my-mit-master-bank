import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';
import { auth } from './firebase'; // Import your Firebase authentication

const Balance = () => {
    const [balance, setBalance] = useState(null);
    const [currentUserName, setCurrentUserName] = useState('');
    const loggedInUser = auth.currentUser;

    // Function to fetch and set the current user's display name and balance
    const fetchCurrentUserData = async () => {
        if (loggedInUser) {
            const db = getFirestore();
            const usersCollection = collection(db, 'users');
            const userDocRef = doc(usersCollection, loggedInUser.uid);

            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                setCurrentUserName(loggedInUser.displayName);
                setBalance(userData.balance);
            }
        }
    };
    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                console.log('Sign-out successful.')
            })
            .catch((error) => {
                // An error occurred during sign-out.
                console.error('Error signing out:', error);
            });
    };
    useEffect(() => {
        // Fetch the current user's data when the component mounts
        fetchCurrentUserData()
            .then(() => {
                console.log('Fetched User successful.')
            })
            .catch((error) => {
                // An error occurred during sign-out.
                console.error('Error fetching user:', error);
            });
    }, [loggedInUser]);

    const handleLogout = () => {
        handleSignOut();
    };

    return (
        <Card bg="info" text="white">
            <Card.Header>
                Balance
                {loggedInUser && (
                    <div>
                        <h3>Welcome, {currentUserName}</h3>
                        <p>Your Current Balance is : ${balance}</p>
                        <button className="btn btn-danger" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </Card.Header>
        </Card>
    );
};

export default Balance;
