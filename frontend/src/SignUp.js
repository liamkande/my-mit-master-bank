import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, setDoc, doc, getDoc } from 'firebase/firestore';
import { auth } from "./firebase";
import Card from 'react-bootstrap/Card';

function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [show, setShow] = useState(true);
    const [userData, setUserData] = useState(null);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null);

        if (!name) {
            setError('Name is required.');
            return;
        }

        if (process.env.NODE_ENV === 'development') {
            try {
                // Send a POST request to your server for account creation
                const url = '/account/create';
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password, displayName: name }),
                });

                if (!response.ok) {
                    throw new Error(`There was an error. This user already exists. Please try logging in.`);
                }

                const data = await response.json();
                console.log(data);

                // Reset the form fields
                setName('');
                setEmail('');
                setPassword('');
                setShow(false);
            } catch (error) {
                setError(error.message);
            }
        } else if (process.env.NODE_ENV === 'production') {
            try {
                // Create the user account using Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Save user data to Firestore
                const db = getFirestore();
                const usersCollection = collection(db, 'users'); // Replace 'users' with your Firestore collection name

                // Use the user's UID as the document ID
                const userDocRef = doc(usersCollection, user.uid);

                // Set the data for the user document
                await setDoc(userDocRef, { email, name, displayName: name, balance: 0 });

                // Fetch the user data from Firestore
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    setUserData(userData);
                }

                // Reset the form fields
                setName('');
                setEmail('');
                setPassword('');
                setShow(false);
                console.log('User account created and data saved to Firestore.');
            } catch (error) {
                setError(error.message);
            }
        }
    }

    return (
        <Card bgcolor="secondary">
            <Card.Header>Create Account</Card.Header>
            <Card.Body>
                {show ? ( // Display the form if show is true
                    <>
                        {error && <div className="alert alert-danger">{error}</div>}
                        Name
                        <br />
                        <input
                            type="input"
                            className="form-control"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.currentTarget.value)}
                        />
                        <br />
                        Email address
                        <br />
                        <input
                            type="input"
                            className="form-control"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                        />
                        <br />
                        Password
                        <br />
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                        />
                        <br />
                        <button type="submit" className="btn btn-light" onClick={handleSignUp}>
                            Create Account
                        </button>
                    </>
                ) : ( // Display the success message if show is false
                    <div>
                        <h5>Success {userData && userData.name}</h5>
                        <button
                            type="submit"
                            className="btn btn-light"
                            onClick={() => setShow(true)}
                        >
                            Add another account
                        </button>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}

export default SignUp;
