import React from "react";
import "../style/Recommendations.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PageNavbar from "./PageNavbar";
import { withRouter } from "react-router-dom";

class Recommendations extends React.Component {
  constructor(props) {
    super(props);
this.state={
  books:[],
  username :"",
  isLoggedIn:false,
  title :""
}

// The state maintained by this React Component. This component maintains the list of genres,
// and a list of movies for a specified genre.
}
  handleUserNameChange(e) {
    this.setState({
      username: e.target.value
    });
  }
  componentDidMount() {
        let storage = window.localStorage;
        let name = storage.getItem("username");
        if (name!== null & name!== ""){
          this.setState({title: "Recommendations for " + name});
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/recommendations?username="+name, {
      method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(res => {
        if (!res) return;
        this.setState({
          books: res
        })
      })
      .catch(err => console.log(err)) // Print the error if there is one.
    }
    else{this.setState({title: "Please Log in to see your recommendations"})}

  }

  goToSubpage(ISBN) {
    this.props.history.push({
      pathname : '/subpage',
      state :{
        //ISBN: the ISBN of the book that user just clicked
        ISBN:ISBN
      }
    });
  }

render() {    
return(
        <div className="Recommendation">
        <PageNavbar active="recommendation" />
   <br></br>



                <div className="list-wrap">
            <div className="list pr-1">
              <div className="list-box px-3 pt-3"  id="rec" >
                <h5 className="list-title mb-3">≡ {this.state.title}</h5>

<div className="row row-cols-1 row-cols-md-3" id="rec2">

              
                  {this.state.books.map((element, index) => {
                    return (
                  <div className="col mb-4" key={index}>
                      <div className="card h-100">

                          <img className="card-img-top" src={element.image_url_l} onClick={()=>this.goToSubpage(element.ISBN)}/>

                    <div className="card-body">
                          <h7 className="card-title">{element.title}</h7>
                          <p className="card-text">{element.author}</p>
                        </div></div></div>

                    );
                  })}
                </div>
              </div></div></div></div>
);


  }
}
export default withRouter(Recommendations);