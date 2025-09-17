// Replace with your own Firebase config:
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};
firebase.initializeApp(firebaseConfig);

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
