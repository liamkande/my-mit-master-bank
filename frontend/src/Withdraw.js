import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { auth } from './firebase'; // Import your Firebase authentication
import {
    getFirestore,
    collection,
    doc,
    updateDoc,
    getDoc,
} from 'firebase/firestore';

const Withdraw = () => {
    const [show, setShow] = useState(true);
    const [status, setStatus] = useState('');
    const [currentBalance, setCurrentBalance] = useState(null);
    const loggedInUser = auth.currentUser;

    const fetchUserBalance = async () => {
        try {
            setStatus('Fetching balance...');
            const db = getFirestore();
            const usersCollection = collection(db, 'users');
            const userDocRef = doc(usersCollection, loggedInUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userBalance = userDoc.data().balance;
                setCurrentBalance(userBalance);
                setStatus('');
            }
        } catch (error) {
            console.error('Error fetching user balance:', error);
            setStatus('Failed to fetch balance');
        }
    };

    useEffect(() => {
        if (loggedInUser) {
            fetchUserBalance();
        }
    }, [loggedInUser]);

    const handleWithdraw = async (amount) => {
        try {
            setStatus('Withdrawing...');
            const db = getFirestore();
            const usersCollection = collection(db, 'users');
            const userDocRef = doc(usersCollection, loggedInUser.uid);

            const userDoc = await getDoc(userDocRef);
            const currentBalance = userDoc.data().balance || 0;

            const newBalance = currentBalance - parseFloat(amount); // Subtract the amount

            await updateDoc(userDocRef, { balance: newBalance });

            setCurrentBalance(newBalance);
            setStatus(`${loggedInUser.displayName}, your new balance is ${newBalance} dollars.`);
            setShow(false);
        } catch (error) {
            setStatus('Withdrawal failed');
            console.error('Error:', error);
        }
    };

    return (
        <Card bg="success" text="white">
            <Card.Header>Withdraw</Card.Header>
            <Card.Body>
                {show ? (
                    <WithdrawForm
                        user={loggedInUser}
                        currentBalance={currentBalance}
                        handleWithdraw={handleWithdraw}
                        setStatus={setStatus}
                        setShow={setShow}
                        setCurrentBalance={setCurrentBalance}
                    />
                ) : (
                    <WithdrawMsg
                        setShow={setShow}
                        setStatus={setStatus}
                        user={loggedInUser}
                        status={status}
                    />
                )}
            </Card.Body>
        </Card>
    );
};

const WithdrawMsg = ({ setShow, setStatus, user, status }) => {
    return (
        <>
            <Card.Title>Success</Card.Title>
            <Card.Text>
                {status}
            </Card.Text>
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

const WithdrawForm = ({ user, currentBalance, handleWithdraw, setStatus, setShow, setCurrentBalance }) => {
    const [amount, setAmount] = useState(0);

    const handle = async () => {
        if (process.env.NODE_ENV === 'production') {
            // Handle withdrawal in the production environment
            handleWithdraw(amount);
        } else if (process.env.NODE_ENV === 'development') {
            // Handle withdrawal in the development environment
            // Subtract the amount in the development environment
            const response = await fetch(`/account/update/${user.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: -amount }) // Negate the amount
            });
            if (response.ok) {
                const data = await response.json();
                setStatus(`${user.displayName}, your new balance is ${data.value.balance} dollars.`);
                setCurrentBalance(data.value.balance); // Update the balance
            } else {
                setStatus('Withdrawal failed');
            }
        }
        setShow(false);
    };

    return (
        <>
            <Card.Title>Welcome Back: {user?.displayName}</Card.Title>
            <Card.Text>
                Current Balance: ${currentBalance}
            </Card.Text>
            <Card.Text>
                Amount
            </Card.Text>
            <input
                type="number"
                className="form-control"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.currentTarget.value)}
            />
            <br />
            <button type="submit" className="btn btn-light" onClick={handle}>
                Withdraw
            </button>
        </>
    );
};

export default Withdraw;
