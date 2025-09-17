// Replace with your own Firebase config:
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtQrmp_LBgs_Rm60KagSXgT2NiME5DwoI",
  authDomain: "login-3002c.firebaseapp.com",
  projectId: "login-3002c",
  storageBucket: "login-3002c.firebasestorage.app",
  messagingSenderId: "1030356167737",
  appId: "1:1030356167737:web:e30cf55a1db575fc14f1e8",
  measurementId: "G-LZM9FEKRG6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = firebase.auth();
const db = firebase.firestore();

const loginDiv = document.getElementById('loginDiv');
const posDiv = document.getElementById('posDiv');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

const itemName = document.getElementById('itemName');
const itemPrice = document.getElementById('itemPrice');
const addItemBtn = document.getElementById('addItemBtn');
const itemsList = document.getElementById('itemsList');

// Login or Sign up
loginBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    // if no user, sign up
    await auth.createUserWithEmailAndPassword(email, password);
  }
});

// Logout
logoutBtn.addEventListener('click', () => auth.signOut());

// Auth state listener
auth.onAuthStateChanged(user => {
  if (user) {
    loginDiv.style.display = 'none';
    posDiv.style.display = 'block';
    loadItems();
  } else {
    loginDiv.style.display = 'block';
    posDiv.style.display = 'none';
  }
});

// Add item
addItemBtn.addEventListener('click', async () => {
  const name = itemName.value.trim();
  const price = parseFloat(itemPrice.value);
  if (!name || isNaN(price)) return alert('Enter name & price');
  await db.collection('items').add({ name, price, user: auth.currentUser.uid });
  itemName.value = '';
  itemPrice.value = '';
});

// Load items
function loadItems() {
  db.collection('items')
    .where('user', '==', auth.currentUser.uid)
    .orderBy('name')
    .onSnapshot(snapshot => {
      itemsList.innerHTML = '';
      snapshot.forEach(doc => {
        const d = doc.data();
        const li = document.createElement('li');
        li.textContent = `${d.name} - ₹${d.price}`;
        itemsList.appendChild(li);
      });
    });
  }
