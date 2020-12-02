import PageNavbar from './PageNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { withRouter } from 'react-router-dom'
import '../style/Login.css';



class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {username: "",password:""};
    this.owners = [
    { name: "demo", pwd: "123456" },
    { name: "oliver",pwd: "123456"}]
    const eventsArr = [
		    //按钮点击事件
		    "onLogin",
		    //user name输入改变
		    "onChangeName",
		    //password输入改变
		    "onChangePwd",
        "onSignUp"
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
        event.preventDefault();
        fetch("http://localhost:8081/login?username="+this.state.username+"&password="+this.state.password, {
          method: 'GET'}) // The type of HTTP request.

       .then(res => res.json()) // Convert the response data to a JSON.
       .then(res => {
        console.log("success", res);

        if (res.length > 0) {
          alert("Valid account");
          this.props.history.push({
            pathname : '/dashboard',
            state :{
              username:this.state.username
            }
          });
        }
        
      else {
        alert("Invalid account");
        this.setState({username:""});
        this.setState({password:""});
        }
       })
       .catch(err => console.log(err)); // Print the error if there is one.


       }


     onSignUp(event){
      event.preventDefault();

      alert(this.state.username+this.state.password);


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
render() {
  return (
   <div className="Login">

   <PageNavbar active="login" />

   <br></br>

   <div className="small-middle-container">

<form>
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


</form>
   </div>

   </div>  

   );
 }
}
export default withRouter(Login);

