import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { auth } from "./firebase";
import Card from 'react-bootstrap/Card';
function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [show, setShow] = useState(true);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null);
        if (!name) {
            setError('Name is required.');
            return;
        }
        try {
            if (process.env.NODE_ENV === 'development') {
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
                    throw new Error(`There was an error this user already exists. Please try logging in.`);
                }

                const data = await response.json();
                console.log(data);

                // Reset the form fields
                setName('');
                setEmail('');
                setPassword('');

                setShow(false);
            } else if (process.env.NODE_ENV === 'production') {
                try {

                    // Create the user account using Firebase Authentication
                    await createUserWithEmailAndPassword(auth, email, password);

                    // Save user data to Firestore
                    const db = getFirestore();
                    const usersCollection = collection(db, 'users'); // Replace 'users' with your Firestore collection name
                    await addDoc(usersCollection, {
                        email,
                        displayName: name,
                        name,
                        balance: 0,
                    });

                    // Reset the form fields
                    setName('');
                    setEmail('');
                    setPassword('');

                    // Set show to false to display the success message
                    setShow(false);
                    console.log('User account created and data saved to Firestore!');
                } catch (error) {
                    setError(error.message); // Handle errors during Firebase Authentication account creation
                }
            }
        } catch (error) {
            setError(error.message); // Handle other errors
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
                    <h5>Success</h5>
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
