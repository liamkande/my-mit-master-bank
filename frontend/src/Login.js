import React, { useState } from 'react';
import { auth } from './firebase'; // Import the Firebase auth instance
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import the signInWithEmailAndPassword function
import Card from 'react-bootstrap/Card';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(true);
    const [status, setStatus] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Use signInWithEmailAndPassword to authenticate with Firebase
            await signInWithEmailAndPassword(auth, email, password);
            console.log('User logged in!')
            setStatus('');
            setShow(false);
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    return (
        <Card bgcolor="secondary">
            <Card.Header>Login</Card.Header>
            <Card.Body>
                {show ? (
                    <>
                        <Card.Text>
                            Email
                        </Card.Text>
                        <input
                            type="input"
                            className="form-control"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                        />
                        <Card.Text>
                            Password
                        </Card.Text>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                        />
                        <br />
                        <button type="submit" className="btn btn-light" onClick={handleLogin}>
                            Login
                        </button>
                    </>
                ) : (
                    <>
                        <h5>Welcome: {auth.currentUser?.displayName ? auth.currentUser.displayName : 'Guest'}</h5>
                        <button
                            type="submit"
                            className="btn btn-light"
                            onClick={() => setShow(true)}
                        >
                            Authenticate again
                        </button>
                    </>
                )}
                {status && <div className="alert alert-danger">{status}</div>}
            </Card.Body>
        </Card>
    );
}

export default Login;
