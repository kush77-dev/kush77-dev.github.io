// Replace with your Supabase credentials:
const SUPABASE_URL = "https://hpdngstjkpwxpmwicohc.supabase.com";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwZG5nc3Rqa3B3eHBtd2ljb2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTU5MDIsImV4cCI6MjA3MzY5MTkwMn0.fAVmQTLJ2RA0cP1Uly_v7lN4JCL5Ea2fMWvOwd_XuXI";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

// handle login / signup
loginBtn.addEventListener('click', async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value,
  });
  if (error) {
    // if no user, sign up instead
    const { error: signUpError } = await supabase.auth.signUp({
      email: emailInput.value,
      password: passwordInput.value,
    });
    if (signUpError) alert(signUpError.message);
  } else {
    showPOS();
  }
});

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  loginDiv.style.display = 'block';
  posDiv.style.display = 'none';
});

// add item
addItemBtn.addEventListener('click', async () => {
  const { error } = await supabase.from('items').insert({
    name: itemName.value,
    price: parseFloat(itemPrice.value)
  });
  if (error) {
    alert(error.message);
  } else {
    itemName.value = '';
    itemPrice.value = '';
    loadItems();
  }
});

async function loadItems() {
  const { data, error } = await supabase.from('items').select('*').order('id', { ascending: false });
  if (error) {
    alert(error.message);
    return;
  }
  itemsList.innerHTML = '';
  data.forEach(row => {
    const li = document.createElement('li');
    li.textContent = `${row.name} - ₹${row.price}`;
    itemsList.appendChild(li);
  });
}

function showPOS() {
  loginDiv.style.display = 'none';
  posDiv.style.display = 'block';
  loadItems();
}

// check if already logged in:
supabase.auth.getUser().then(({ data }) => {
  if (data.user) showPOS();
});
