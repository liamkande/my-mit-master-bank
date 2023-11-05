import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { auth } from './firebase';
import bankImage from './bank.png';

const smallImageStyle = {
    maxWidth: '100px', // Adjust the width to your preferred size
    height: 'auto',
};

const dangerTextStyle = {
    color: 'red',
};

function Home() {
    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                // Sign-out successful.
            })
            .catch((error) => {
                // An error occurred during sign-out.
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
                <Card.Title>Welcome to the bank {auth.currentUser?.displayName ? auth.currentUser.displayName : 'Guest'}</Card.Title>
                <Card.Text>You can use this bank to deposit and withdraw money!</Card.Text>
                <Card.Text style={dangerTextStyle}>Please do not enter your real data, this app is for educational purposes only!</Card.Text>
                <Card.Img src={bankImage} style={smallImageStyle} alt="Bank" />
            </Card.Body>
        </Card>
    );
}

export default Home;
