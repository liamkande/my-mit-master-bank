import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { auth } from './firebase';
import { getFirestore, collection, doc, updateDoc, getDoc } from 'firebase/firestore';

const Withdraw = () => {
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
    }, [auth.currentUser]);

    const handleWithdraw = async (amount) => {
        try {
            setStatus('Withdrawing...');
            const db = getFirestore();
            const usersCollection = collection(db, 'users');
            const userDocRef = doc(usersCollection, auth.currentUser.uid);

            const userDoc = await getDoc(userDocRef);
            const currentBalance = userDoc.data().balance || 0;

            const newBalance = parseFloat(currentBalance - amount) ; // Subtract the amount

            await updateDoc(userDocRef, { balance: newBalance });

            setUserData({ ...userData, balance: newBalance });
            setStatus(`${userData.displayName}, your new balance is ${newBalance} dollars.`);
            setShow(false);
        } catch (error) {
            setStatus('Withdraw failed');
            console.error('Error:', error);
        }
    };

    return (
        <Card bg="success" text="white">
            <Card.Header as="h5" bg="success">
                Withdraw
            </Card.Header>
            <Card.Body>
                {show ? (
                    <WithdrawForm
                        user={auth.currentUser}
                        handleWithdraw={handleWithdraw}
                        setStatus={setStatus}
                        setShow={setShow}
                        userData={userData}
                        setUserData={setUserData} // Pass setUserData as a prop
                    />
                ) : (
                    <WithdrawMsg
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

const WithdrawMsg = ({ setShow, setStatus, status }) => {
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
                Withdraw again
            </button>
        </>
    );
};

const WithdrawForm = ({ user, handleWithdraw, setStatus, setShow, userData, setUserData }) => {
    const [amount, setAmount] = useState(0);

    const handle = async () => {
        if (process.env.NODE_ENV === 'development') {
            const response = await fetch(`/account/update/${user.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: -amount }) // Negate the amount
            });

            if (response.ok) {
                const data = await response.json();
                setStatus(`${userData.displayName}, your new balance is ${data.value.balance} dollars.`);
                setUserData({ ...userData, balance: data.value.balance });
            } else {
                setStatus('Withdraw failed');
            }

            setShow(false);
        } else if (process.env.NODE_ENV === 'production') {
            handleWithdraw(amount);
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
                Withdraw
            </button>
        </>
    );
};

export default Withdraw;
