import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { auth } from './firebase';
import { getFirestore, collection, doc, updateDoc, getDoc } from 'firebase/firestore';

const Deposit = () => {
    const [show, setShow] = useState(true);
    const [status, setStatus] = useState('');
    const [userData, setUserData] = useState(null);

    const fetchUserBalance = async () => {
        try {
            setStatus('Fetching balance...');
            const db = getFirestore();
            const usersCollection = collection(db, 'users');
            const userDocRef = doc(usersCollection, auth.currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUserData(userData);
                setStatus('');
            }
        } catch (error) {
            console.error('Error fetching user balance:', error);
            setStatus('Failed to fetch balance');
        }
    };

    useEffect(() => {
        if (auth.currentUser) {
            fetchUserBalance()
                .then(() => {
                    console.log('Balance fetched successfully.');
                })
                .catch((error) => {
                    console.error('Error fetching balance:', error);
                });
        }
    }, []);

    const handleDeposit = async (amount) => {
        try {
            setStatus('Depositing...');
            const db = getFirestore();
            const usersCollection = collection(db, 'users');
            const userDocRef = doc(usersCollection, auth.currentUser.uid);

            const userDoc = await getDoc(userDocRef);
            const userBalance = userDoc.data().balance || 0;

            const newBalance = userBalance + parseFloat(amount);

            await updateDoc(userDocRef, { balance: newBalance });

            setUserData({ ...userData, balance: newBalance });
            setStatus(`${userData.displayName}, your new balance is ${newBalance} dollars.`);
            setShow(false);
        } catch (error) {
            setStatus('Deposit failed');
            console.error('Error:', error);
        }
    };

    return (
        <Card>
            <Card.Header as="h5" bg="success">
                Deposit
            </Card.Header>
            <Card.Body>
                {show ? (
                    <DepositForm
                        user={auth.currentUser}
                        handleDeposit={handleDeposit}
                        setStatus={setStatus}
                        setShow={setShow}
                        userData={userData}
                        setUserData={setUserData} // Pass setUserData as a prop
                    />
                ) : (
                    <DepositMsg
                        setShow={setShow}
                        setStatus={setStatus}
                        userData={userData}
                        status={status}
                    />
                )}
            </Card.Body>
        </Card>
    );
};

const DepositMsg = ({ setShow, setStatus, status }) => {
    return (
        <>
            <Card.Title>Success</Card.Title>
            <Card.Text>{status}</Card.Text>
            <button
                type="submit"
                className="btn btn-light"
                onClick={() => {
                    setShow(true);
                    setStatus('');
                }}
            >
                Deposit again
            </button>
        </>
    );
};

const DepositForm = ({ user, handleDeposit, setStatus, setShow, userData, setUserData }) => {
    const [amount, setAmount] = useState(0);

    const handle = async () => {
        if (process.env.NODE_ENV === 'development') {
            // Handle deposit in the development environment
            const response = await fetch(`/account/update/${user.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount }),
            });

            if (response.ok) {
                const data = await response.json();
                setStatus(`${userData.displayName}, your new balance is ${data.value.balance} dollars.`);
                setUserData({ ...userData, balance: data.value.balance });
            } else {
                setStatus('Deposit failed');
            }

            setShow(false);
        } else if (process.env.NODE_ENV === 'production') {
            // Handle deposit in the production environment
            handleDeposit(amount);
            setShow(false);
        }
    };

    return (
        <>
            <Card.Title>Welcome Back: {userData?.displayName}</Card.Title>
            <Card.Text>Current Balance: ${userData?.balance}</Card.Text>
            <Card.Text>Amount</Card.Text>
            <input
                type="number"
                className="form-control"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.currentTarget.value))}
            />
            <br />
            <button type="submit" className="btn btn-light" onClick={handle}>
                Deposit
            </button>
        </>
    );
};

export default Deposit;
