import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { auth } from './firebase';
import bankImage from './bank.png';
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';

const smallImageStyle = {
    maxWidth: '100px',
    height: 'auto',
};

const dangerTextStyle = {
    color: 'red',
};

function Home() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const db = getFirestore();
                    const usersCollection = collection(db, 'users');
                    const userDocRef = doc(usersCollection, user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    }
                } catch (error) {
                    console.error('Error fetching user data from Firebase:', error);
                }
            } else {
                setUserData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                // Sign-out successful.
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };

    return (
        <Card text="black">
            <Card.Header>
                {auth.currentUser ? (
                    <Button variant="danger" onClick={handleSignOut}>Sign Out</Button>
                ) : null}
            </Card.Header>
            <Card.Body>
                <Card.Title>Welcome to the bank {userData ? userData.displayName : 'Guest'}</Card.Title>
                <Card.Text>You can use this bank to deposit and withdraw money!</Card.Text>
                <Card.Text style={dangerTextStyle}>Please do not enter your real data, this app is for educational purposes only!</Card.Text>
                <Card.Img src={bankImage} style={smallImageStyle} alt="Bank" />
            </Card.Body>
        </Card>
    );
}

export default Home;
