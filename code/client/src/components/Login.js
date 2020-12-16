import PageNavbar from './PageNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { withRouter } from 'react-router-dom'
import '../style/Login.css';
import Logo from "../assets/images/book.png";
import {GoogleLogin, GoogleLogout} from 'react-google-login';

const CLIENT_ID = "909866232229-5jrtcuonesmii7v05fpe4fbvtqrjpr1f.apps.googleusercontent.com";
class Login extends React.Component {
  constructor(props) {
    let storage = window.localStorage;
    storage.setItem("username", "");
    super(props);
    this.state = {
      username: "",
      password:"",
      loggedIn:"FALSE",
      isLoggedIn:false,
      accessToken:''
    };

    this.login = this.login.bind(this);
    this.handleLoginFailure = this.handleLoginFailure.bind(this);
    this.logout = this.logout.bind(this);
    this.handleLogoutFailure = this.handleLogoutFailure.bind(this);

    this.owners = [
    { name: "demo", pwd: "123456" },
    { name: "oliver",pwd: "123456"}]
    const eventsArr = [
        "onLogin",
        "onChangeName",
        "onChangePwd",
        "onSignUp",
        "onLogout"
        ];
        eventsArr.map((ev) => {
          this[ev] = this[ev].bind(this);
          return "";
        });

      }

      onChangeName(e) {
          this.setState({ username: e.target.value });
          this.setState({ errorMsg: '' });
        
      }

      onChangePwd(e) {
          this.setState({ password: e.target.value });
      }

      onLogin(event) {
        window.localStorage.clear();
        let storage = window.localStorage;

        event.preventDefault();
        fetch("http://localhost:8081/login?username="+this.state.username+"&password="+this.state.password, {
          method: 'GET'}) // The type of HTTP request.

       .then(res => res.json()) // Convert the response data to a JSON.
       .then(res => {

        if (res.length > 0) {
          storage.setItem("username", this.state.username);
          this.setState({ loggedIn:"TRUE"});
          alert("Valid account");
        }
        
      else {
        alert("Invalid account");
        this.setState({username:""});
        this.setState({password:""});
        }
       })
       .catch(err => console.log(err)); // Print the error if there is one.


       }

       onLogout(event){
        event.preventDefault();
        let storage = window.localStorage;
        let username = storage.getItem("username");
        if(username !== null & username !== ""){
          alert("Logout success");

          this.setState({username:""});
          this.setState({password:""});
          this.setState({loggedIn:"FALSE"});
        }
        else{
          alert("Please Log in");
        }
        window.localStorage.clear();

      }



     onSignUp(event){
      event.preventDefault();
      fetch("http://localhost:8081/signup?username="+this.state.username, {
       method: 'GET'}) // The type of HTTP request.

       .then(res => res.json()) // Convert the response data to a JSON.
       .then(res => {
        if (res.length === 0) {
          alert("Valid account");
          this.addAccount(event);

        }
        
      else {
        alert("Account existed");
        this.setState({username:""});
        this.setState({password:""});
        }
       })
       .catch(err => console.log(err)); // Print the error if there is one.
  } 

  addAccount(event){
      fetch("http://localhost:8081/addAccount?username="+this.state.username+"&password="+this.state.password, {
       method: 'POST',
       data: {
          username: this.state.username,
          password: this.state.password
        }}) // The type of HTTP request.

       .then(res => res.json()) // Convert the response data to a JSON.
       .catch(err => console.log(err)); // Print the error if there is one.
  }
  login(response){

      if(response.accessToken){

        this.setState(state =>({
          isLoggedIn:true,
          accessToken:response.accessToken
        }));
      }
    }
    logout(response){

        this.setState(state =>({
          isLoggedIn:false,
          accessToken:''
        }));  
    }

    handleLoginFailure(response){
      alert('Log in Failure');
    }

    handleLogoutFailure(response){
      alert('Log out Failure');
    }
    


  render() {
  return (
   <div className="Login">

   <PageNavbar active="login" />

   <br></br>
   
   <div className="search">
      <div className="img" id="logo">
          <img src={Logo} className="logo-img" id="img"/>
      </div>
    </div>

   <div className="small-middle-container">
{this.state.loggedIn ==="TRUE" ? (

  
<div className="info-container">
                <h5 className="info">Welcome, {this.state.username}</h5>

<div className="btn-group">                

  <button className="btn btn-light" onClick={this.onLogout}>Logout</button> 

 </div> </div>


  
):(
<form onSubmit={this.submitForm} >
   <div className="form-group">
   <input placeholder="Username" value= {this.state.username} type= "text" onChange={this.onChangeName} className="form-control"/>
   </div>

   <div className="form-group">
   <input placeholder="Password" value={this.state.password} type="password" className="form-control" id="exampleInputPassword1" 
   onChange={this.onChangePwd}/>
   </div>

<div className="btn-group">                
   <button className="btn btn-light" onClick={this.onLogin}>  Login   </button>
   <button className="btn btn-light" onClick={this.onSignUp}>Sign Up</button> 

 </div>

<div id="login">
      {
        this.state.isLoggedIn ?
        <GoogleLogout
        clientId = {CLIENT_ID}
        buttonText = 'Logout'
        onLogoutSuccess={this.logout}
        OnFailure = {this.handleLogoutFailure}
        >
        </GoogleLogout>:<GoogleLogin
        clientId = {CLIENT_ID}
        buttonText = 'Google Login'
        onSuccess={this.login}
        OnFailure = {this.handleLoginFailure}       
        responseType = 'code,token'
        />
      }
      <button className="btn btn-small" id="logout" onClick={this.onLogout}>Logout</button>
      </div>
      {this.state.accessToken ? <h5> You access token: <br/><br/> {this.state.accessToken}</h5>:null}


</form>
)}
   </div>

   </div>  

   );
 }
}
export default withRouter(Login);

