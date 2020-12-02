import React from "react";
// import { useRouteMatch } from "react-router-dom";
import "../style/Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PageNavbar from "./PageNavbar";
// import GenreButton from "./GenreButton";
// import DashboardMovieRow from "./DashboardMovieRow";
import StarIcon from "../assets/images/star.png";

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      bookName: "",
      books: [],
      placeholder: "",
    };
  }

  componentDidMount() {
    // console.log(window.location);
    const keyword = window.location.search.split("k=");
    this.setState(
      {
        bookName: decodeURI(keyword[1]) || "",
      },
      () => {
        this.Search();
      }
    );
  }

  handleChange(e) {
    this.setState({
      bookName: e.target.value,
    });
  }

  // Search
  Search = () => {
    if (!this.state.bookName) return;
    var inputBook = this.state.bookName;
    console.log(inputBook);
    fetch(`http://localhost:8081/${inputBook}`, { 
      method: "GET",
    })
      .then((res) => res.json())
      .then((searchList) => {
        if (searchList && searchList.length > 0) {
          this.setState({
            books: searchList,
          });
        } else {
          this.setState({
            placeholder: inputBook,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  submitBook = () => {
    this.Search();
  };

  render() {
    return (
      <div className="Dashboard">
        <PageNavbar active="dashboard" />

        <br></br>
        <div className="container movies-container mt-5">
          {/* Search */}
          <div className="search">
            <h2 className="search-title text-white">Search</h2>
            <div className="input-group mb-5">
              <input
                type="text"
                className="form-control"
                placeholder="Enter title, author, publisher,..."
                aria-describedby="button-addon2"
                value={this.state.bookName}
                onChange={(e) => this.handleChange(e)}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary bg-primary text-white"
                  type="button"
                  id="button-addon2"
                  onClick={this.submitBook}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

            
          <br></br>
          {/* Left column */}
          <div className="list-wrap">
            <div className="list pr-1">
              <div className="list-box bg-white px-3 pt-3">
                <h5 className="list-title mb-3">≡ Resulting Books</h5>

                {this.state.books.length > 0 ? (
                  this.state.books.map((element, index) => {
                    return (
                      <div className="list-row pt-2" key={index}>
                        <div className="list-col cover-col">
                          <img className="cover" src={element.image_url_l} />
                        </div>
                        <div className="list-col content-col">
                          <h5>{element.title}</h5>
                          <p className="text-black-50">{element.author}</p>
                        </div>
                        <div className="list-col rating-col">
                          <img src={StarIcon} />
                          <h5>{element.rating}</h5>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <h4 style={{ textAlign: "center", margin: "100px 0" }}>
                    Sorry, there's no result for "{this.state.placeholder}".
                  </h4>
                )}
              </div>
            </div>

          </div>
          <div className="footer mt-5"></div>
        </div>
      </div>
    );
  }
}
