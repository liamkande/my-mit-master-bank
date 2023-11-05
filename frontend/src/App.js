import React, { useState, useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import SignUp from './SignUp';
import Login from './Login';
import Home from './Home';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import Balance from './Balance';
import AllData from './AllData';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <HashRouter>
            <Navbar />
            <div className="container" style={{ padding: '20px' }}>
                <Routes>
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    {user ? (
                        <Route path="/deposit" element={<Deposit />} />
                    ) : <Route path="/deposit" element={<div>Please login to deposit.</div>} />
                    }
                    {user ? (
                        <Route path="/withdraw" element={<Withdraw />} />
                    ) :  <Route path="/withdraw" element={<div>Please login to withdraw.</div>} />
                    }
                    {user ? (
                        <Route path="/balance" element={<Balance />} />
                    ) :  <Route path="/balance" element={<div>Please login to see your balance.</div>} />
                    }
                    {user ? (
                        <Route path="/alldata" element={<AllData />} />
                    ) :  <Route path="/alldata" element={<div>Please login to see all data.</div>} />
                    }
                    {user ? (
                        <Route path="/" element={<Home />} />
                    ) : (
                        <Route path="/" element={<Home />} />
                    )}
                </Routes>
            </div>
        </HashRouter>
    );
}

export default App;
