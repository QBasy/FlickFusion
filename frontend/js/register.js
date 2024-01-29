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
    popup.classList.add("open-slide");
    return false;
  }
}

let popup = document.getElementById('popup')
function closeSlide(){
  popup.classList.remove("open-slide")
}

function loginValidation(){
  let email = document.formFiller.Email.value;
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let password = document.formFiller.Password.value;

  if(email===""){
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

  window.location.href = "restorepass.ejs";
}
