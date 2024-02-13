function validation(){
  let username = document.formFiller.Username.value;
  let email = document.formFiller.Email.value;
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let password = document.formFiller.Password.value;
  let cpassword = document.formFiller.cPassword.value;

  if(username === ""){
    document.getElementById("result").innerHTML="Enter username*";
    return false;
  }
  else if(username.length < 5){
    document.getElementById("result").innerHTML="Username should contain at least 5 characters*";
    return false;
  }
  else if(email===""){
    document.getElementById("result").innerHTML="Enter your email*";
    return false;
  }
  else if(!emailRegex.test(email)){
    document.getElementById("result").innerHTML="Incorrect email*";
    return false;
  }
  else if(password===""){
    document.getElementById("result").innerHTML="Enter password*";
    return false;
  }
  else if(password.length < 6){
    document.getElementById("result").innerHTML="Password should contain at least 6 characters*";
    return false;
  }
  else if(cpassword===""){
    document.getElementById("result").innerHTML="Confirm your password*";
    return false;
  }
  else if(cpassword!==password){
    document.getElementById("result").innerHTML="Passwords doesn't match*";
    return false;
  }
  else if(cpassword===password){
    return true;
  }
}

async function register() {
  if (!validation()) {
    console.log("Shit");
    return;
  }
  let username = document.getElementById('Username').value;
  let email = document.getElementById('Email').value;
  let password = document.getElementById('Password').value;
  await createUser(username, email, password);
}

async function createUser(username, email, password) {
  try {
    const response = fetch('/registerUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, email })
    });

    if (!(await response).status) {
      console.log('Error on creating new User');
    }
  } catch (e) {
    console.log('Problem with getting response: ', e)
  }
}
let popup = document.getElementById('popup')
function closeSlide(){
  popup.classList.remove("open-slide")
}

function loginValidation(){
  let username = document.formFiller.Username.value;
  let password = document.formFiller.Password.value;

  if(username===""){
    document.getElementById("result").innerHTML="Enter your Username*";
    return false;
  }
  else if(password===""){
    document.getElementById("result").innerHTML="Enter password*";
    return false;
  }
  else if(password.length < 6){
    document.getElementById("result").innerHTML="Password should contain at least 6 characters*";
    return false;
  }
  return true;
}

function restoreValidation(){
  let email = document.formFiller.Email.value;
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if(email===""){
    document.getElementById("result").innerHTML="Enter your email*";
    return false;
  }
  else if(!emailRegex.test(email)){
    document.getElementById("result").innerHTML="Incorrect email*";
    return false;
  }

  window.location.href = `/restorepass/${email}`;
}

async function loginFetch(username, password) {
  try {
    const response = await fetch('/loginByUsername', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    if (!response.status) {
      console.log('Error on creating new User');
    }
    return response.status;
  } catch (e) {
    console.log('Error: ', e);
    return false;
  }
}

async function login() {
  const username = document.getElementById('Username').value;
  const password = document.getElementById('Password').value;

  if (loginValidation() && await loginFetch(username, password)) {
    console.log('Success');
    window.location.href = '/index';
  }
}
