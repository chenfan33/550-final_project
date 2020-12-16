import React from "react";
import { withRouter } from "react-router-dom";
import "../style/Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PageNavbar from "./PageNavbar";
import Logo from "../assets/images/book.png";

class Search extends React.Component {
  constructor(props) {
    super(props);
    // The state maintained by this React Component.
    this.state = {
      bookName: "",
      books: [],
      placeholder: "",
    };

    this.goToSubpage = this.goToSubpage.bind(this);
  }

  componentDidMount() {
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

  // Go to the book's subpage/info page
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
    return (
      <div className="Dashboard">
        <PageNavbar active="dashboard" />

        <br></br>
        <div className="container movies-container mt-5">
          {/* Search */}
          <div className="search">
          <div className="img" id="logo">
            <img src={Logo} className="logo-img" id="img"/>
          </div>
            <div className="input-group mb-5" id="searchbar">
              <input
                id="searchbar"
                type="text"
                className="form-control"
                placeholder="Enter title, author, publisher,..."
                aria-describedby="button-addon2"
                onChange={(e) => this.handleChange(e)}
              />
              <div className="input-group-append">
                <button
                  className="btn bg-light text-black"
                  type="button"
                  id="button-addon2"
                  onClick={()=>{window.location.href=`/search?k=${this.state.bookName}`}}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

            
          <br></br>
          {/* column */}
          <div className="list-wrap">
            <div className="list pr-1">
              <div className="list-box px-3 pt-3" id= "dash">
                <h5 className="list-title mb-3">≡ Resulting Books</h5>

                {this.state.books.length > 0 ? (
                  this.state.books.map((element, index) => {
                    return (
                      <div className="list-row pt-2" key={index}>
                        <div className="list-col cover-col">
                          <img className="cover" src={element.image_url_l} onClick={()=>this.goToSubpage(element.ISBN)}/>
                        </div>
                        <div className="list-col content-col">
                          <h5>{element.title}</h5>
                          <p className="text-black-50">{element.author}</p>
                        </div>
                        <div className="list-col rating-col">
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

export default withRouter(Search);
