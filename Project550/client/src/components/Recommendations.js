import React from "react";
import "../style/Recommendations.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PageNavbar from "./PageNavbar";
import StarIcon from "../assets/images/star.png";

export default class Recommendations extends React.Component {
  constructor(props) {
    super(props);
this.state={
  books:[],
  username :"mia"
}

// The state maintained by this React Component. This component maintains the list of genres,
// and a list of movies for a specified genre.
}

  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/recommendations?username="+this.state.username, {
      method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(res => {
        if (!res) return;
        // Map each genreObj in genreList to an HTML element:
        // A button which triggers the showMovies function for each genre.

        // Set the state of the genres list to the value returned by the HTTP response from the server.
        this.setState({
          books: res
        })
      })
      .catch(err => console.log(err)) // Print the error if there is one.
  }



render() {    
return(
        <div className="Recommendation">
        <PageNavbar active="recommendation" />
   <br></br>



                <div className="list-wrap">
            <div className="list pr-1">
              <div className="list-box px-3 pt-3"  id="rec" >
                <h5 className="list-title mb-3">≡ Recommendations</h5>

<div className="row row-cols-1 row-cols-md-3" id="rec2">

              
                  {this.state.books.map((element, index) => {
                    return (
                  <div className="col mb-4" key={index}>
                      <div className="card h-100">

                          <img className="card-img-top" src={element.image_url_l} />

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