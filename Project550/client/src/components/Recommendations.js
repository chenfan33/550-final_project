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
	username :"maa"
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
      .catch(err => console.log(err))	// Print the error if there is one.
  }



render() {    
return(
	      <div className="Recommendation">
        <PageNavbar active="recommendation" />
   <br></br>

                  <div className="list-wrap">
            <div className="list pr-1">
              <div className="list-box opacity=0.4 bg-white px-3 pt-3">
                <h5 className="list-title mb-3">≡ Recommendations</h5>

              
                  {this.state.books.map((element, index) => {
                    return (
                      <div className="list-row pt-2" key={index}>
                        <div className="list-col cover-col">
                          < img className="cover" src={element.image_url_l} />
                        </div>
                        <div className="list-col content-col">
                          <h5>{element.title}</h5>
                          <p className="text-black-50">{element.author}</p >
                        </div>
                        <div className="list-col rating-col">
                          < img src={StarIcon} />
                          <h5>{element.rating}</h5>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div></div></div>
);

  }
}