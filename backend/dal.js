const admin = require('firebase-admin');

// Initialize Firebase Admin with your service account credentials
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Other Firebase config options here
});

const db  = admin.firestore();
const usersCollection = db.collection('users');

// Function to create a user
const create = async (name, email, password, displayName, balance) => {
  try {
    const user = await admin.auth().createUser({
      email,
      password,
      displayName,
      name,
      balance,
    });
    // Create a Firestore document for the user
    await usersCollection.doc(user.uid).set({ email, name, displayName, balance: 0 });
    return user;
  } catch (error) {
    throw error;
  }
};

// Find user account
const find = async (email) => {
  try {
    const snapshot = await usersCollection.where('email', '==', email).get();
    const users = [];

    snapshot.forEach((userDoc) => {
      const user = userDoc.data();
      users.push({ ...user, id: userDoc.id });
    });

    return users;
  } catch (error) {
    throw error;
  }
};

// Find one user by email (alternative to 'find')
const findOne = async (email) => {
  try {
    const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      return { ...userDoc.data(), id: userDoc.id };
    }

    return null;
  } catch (error) {
    throw error;
  }
};

// Update - deposit/withdraw amount (protected route)
const update = async (email, amount) => {
  try {
    const users = await find(email);

    if (users.length > 0) {
      const user = users[0];
      const newBalance = (user.balance || 0) + amount;

      await usersCollection.doc(user.id).update({ balance: newBalance });

      return { success: true, value: { ...user, balance: newBalance } };
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw error;
  }
};

// Function to get a list of all accounts
const all = async () => {
  try {
    const querySnapshot = await usersCollection.get();
    const accounts = [];

    querySnapshot.forEach((userDoc) => {
      const account = userDoc.data();
      accounts.push(account);
    });

    return accounts;
  } catch (error) {
    throw error;
  }
};

module.exports = { create, update, all, find };
