import React from 'react';
import { withRouter } from "react-router-dom";
import '../style/Subpage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import StarIcon from "../assets/images/star.png";
import StarRatingComponent from 'react-star-rating-component';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import cart from "../assets/images/cart.png";
import bookmark from "../assets/images/bookmark.png";
import bookmarkFill from "../assets/images/bookmarkFill.png";

class Subpage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: window.localStorage.getItem("username"),
      ISBN: this.props.location.state.ISBN,  //ISBN: from the props.history.push in Dashboard/Rec code, the ISBN of book clicked
      book: {}, //detailed book info: title, author, publisher, year, image_url_l
      prevRating: false, //if user previously rated the book 
      curRating: 0, //star num clicked, 0 star means that user hasn't selected anything
      avgRating: 0, //average rating of this ISBN
      relatedBooks: [], //contains book info of the same author
      onShelf: false //if the book is on user's shelf
    }

    this.getRelatedBooks = this.getRelatedBooks.bind(this);
    this.sumbitRating = this.sumbitRating.bind(this);
    this.changeBookshelf = this.changeBookshelf.bind(this);
    this.addBook = this.addBook.bind(this);
    this.removeBook = this.removeBook.bind(this);
    this.goToSubpage = this.goToSubpage.bind(this);
  }

  componentDidMount() {
    //GET BOOK BY ISBN
    fetch(`http://localhost:8081/book/${this.state.ISBN}`, {
      method: 'GET' 
    })
      .then(res => res.json())
      .then(resArray => {
        if (resArray.length !== 0){
          this.setState({
            book: resArray[0]
          }
          );
        } 
      })
      .catch(err => console.log(err))	// Print the error if there is one. 

    //GET AVERAGE RATING BY ISBN
    fetch(`http://localhost:8081/avgRating/${this.state.ISBN}`, {
      method: 'GET' 
    })
      .then(res => res.json())
      .then(resArray => {
        if (resArray.length > 0) {
          this.setState({
            avgRating: resArray[0].avgRating
          });
        }
      })
      .catch(err => console.log(err))	// Print the error if there is one.

    //GET PREVIOUS RATING OF USER ON THIS ISBN
    fetch(`http://localhost:8081/userRating/${this.state.username}/${this.state.ISBN}`, {
      method: 'GET' 
    })
      .then(res => res.json())
      .then(resArray => {
        if (resArray.length > 0) { //not an empty array
          this.setState({
            prevRating: true,
            curRating: resArray[0].rating
          });
        }

      })
      .catch(err => console.log(err));

    //GET THE BOOK FROM SHELF 
    fetch(`http://localhost:8081/bookOnShelf/${this.state.username}/${this.state.ISBN}`, {
      method: 'GET' 
    })
      .then(res => res.json())
      .then(resArray => {
        if (resArray.length > 0) {
          this.setState({
            onShelf: true
          });
        }
      })
      .catch(err => console.log(err));

    //GET BOOKS OF SAME AUTHOR
    this.getRelatedBooks();
  } 

  getRelatedBooks(ISBN) {
    fetch(`http://localhost:8081/relatedBooks/${this.state.ISBN}`, {
      method: 'GET' 
    })
      .then(res => res.json())
      .then(resArray => {
        if (!resArray) return;
        this.setState({
          relatedBooks: resArray
        });
      })
      .catch(err => console.log(err));
  }

  //---------------------Events Handlers-------------------
  onStarClick(nextValue, prevValue, name) {
    this.setState({curRating: nextValue});
  }

  sumbitRating() {    
    if (!this.state.username) {
      alert("Please log in first!");
      return;
    } else if (this.state.curRating === 0) {
      alert("Please select a number!")
      return;
    } else if (!this.state.ISBN) {
      alert("Error");
      return;
    }

    //if no previous rating exists in db, insertion query
    if (!this.state.prevRating) {
      fetch(`http://localhost:8081/submitRating/${this.state.username}/${this.state.ISBN}/${this.state.curRating}`, {
        method: 'GET'
      })
        .then(res => res.json())
        .then(res => {
          //res is {status: "success"} if server -> db is sucessful
          if (res.status === "success") {
            this.setState({prevRating: true});
            alert("Rating submitted!");
          } else {
            alert("Error!");
          }
        })
        .catch(err => console.log(err));

    //If exists previous rating in db, UPDATE query
    } else { 
      fetch(`http://localhost:8081/updateRating/${this.state.username}/${this.state.ISBN}/${this.state.curRating}`, {
        method: 'GET'
      })
        .then(res => res.json())
        .then(res => {
          //res is {status: "success"} if server -> db is sucessful
          if (res.status === "success") {
            alert("Rating updated!");
          } else {
            alert("Error!");
          }
        })
        .catch(err => console.log(err));
    }

  }

  changeBookshelf() {
    if (!this.state.username) {
      alert("Please log in first!");
    } else if (!this.state.ISBN) {
      alert("Error!");
    }

    if(this.state.onShelf) { //if book is on shelf, remove it
      this.removeBook();
    } else {                 
      this.addBook();
    }

    this.setState((state) => {
      return {onShelf: !this.state.onShelf}
    });
  }

  addBook() {
    fetch(`http://localhost:8081/addBook/${this.state.username}/${this.state.ISBN}`, {
      method: 'GET' 
    })
    .then(res => res.json())
    .then(res => {
      //res is {status: "success"} if server -> db is sucessful
      if (res.status === "success") {
        alert("Book Added!");
      } else {
        alert("Error!");
      }
    })
    .catch(err => console.log(err));
  }

  removeBook() {
    fetch(`http://localhost:8081/removeBook/${this.state.username}/${this.state.ISBN}`, {
      method: 'GET' 
    })
    .then(res => res.json())
    .then(res => {
      //res is {status: "success"} if server -> db is sucessful
      if (res.status === "success") {
        alert("Book Removed!");
      } else {
        alert("Error!");
      }
    })
    .catch(err => console.log(err));
  }

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
    //const {curRating} = this.state;  
    const responsive = {
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5,
        slidesToSlide: 3 // optional, default to 1.
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 4,
        slidesToSlide: 2 // optional, default to 1.
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2,
        slidesToSlide: 1 // optional, default to 1.
      }
    };

    var removeBookRow = (
      <div className="list-col1 rating-col3">
                  <img id = "bookmark" src={bookmarkFill} />
                  <button
                  className="btn"
                  type="button"
                  id="button-markBook"
                  onClick={this.changeBookshelf}>
                  Remove this book from bookshelf
                  </button>
      </div>
    );
    var addBookRow = 
    (
      <div className="list-col1 rating-col3">
                  <img id = "bookmark" src={bookmark} />
                  <button
                  className="btn"
                  type="button"
                  id="button-markBook"
                  onClick={this.changeBookshelf}>
                  Add this book to bookshelf
                  </button>
      </div>
    );

    return (
        <div className="Subpage">
          <PageNavbar active="" />
          <br></br>
          <div className="container movies-container mt-5">
            <div className="list-wrap1">
              <div className="list1 pr-1">
                <div className="list-box1 px-3 pt-3" id= "sub">

                
          {/* <!-- Page Content --> */}
          <h5 className="list-title1 mb-3">≡ Book Information</h5>

          {/* <!-- Book Info Row --> */}
          <div className="list-row1 pt-2" >
            <div className="list-col1 cover-col1">
              <img className="cover1" src={this.state.book.image_url_l} alt=""/>
            </div>

            <div className="list-col1 content-col1">
                <h5>{this.state.book.title}</h5>
                <div className="list-col1 author-col1">
                
                </div>
                <div className="list-col1 rating-col1">
                  <p className="text-black-50">{this.state.book.author}</p>
                  <img id = "star" src={StarIcon} />
                  <h6 id="r">{this.state.avgRating.toFixed(2)}</h6>
                </div>
                
                <li>ISBN: {this.state.ISBN}</li>
                <li>Publisher: {this.state.book.publisher}</li>
                <li>Year of Publication: {this.state.book.year}</li>
                

                <div className="list-col1 rating-col2">
                  <img id = "cart" src={cart} />
                  <span><a href={`https://www.amazon.com/s?k=${this.state.ISBN}`} id="outlink" target="_blank" rel="noopener noreferrer"> Buy this book!</a></span>
                </div>
                {this.state.onShelf ? removeBookRow: addBookRow}
                
                

              <div className="row-ratingRow2" id = "rateBook">
                <StarRatingComponent 
                          name="rate2"
                          editing={true}
                          starCount={10}
                          value= {this.state.curRating}
                          onStarClick={this.onStarClick.bind(this)}
                />
                <p>  {this.state.curRating}</p>
              </div>
              <button
                  className="btn bg-light text-black"
                  type="button"
                  id="button-rating"
                  onClick={this.sumbitRating}>
                  Submit Your Rating
              </button>
             
                
            
            </div>

             
          </div>
          {/* <!-- /.row --> */}  


    <h5 className="list-title mb-3">≡ Other Books by "{this.state.book.author}"</h5>        
          <Carousel
            swipeable={false}
            draggable={false}
            showDots={false}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlay={this.props.deviceType !== "mobile" ? true : false}
            autoPlaySpeed={2000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            deviceType={this.props.deviceType}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
          >
            {this.state.relatedBooks.map((element, index) => {
              return (
                <div className="col mb-4" id = "card" key={index}>
                <div className="card h-100">

                    <img className="card-img-top" src={element.image_url_l} onClick={()=>this.goToSubpage(element.ISBN)}/>

              <div className="card-body">
                    <h6 className="card-title">{element.title}</h6>
                  </div></div></div>
              );
            })}
          </Carousel>

        </div>
        </div>
        </div>
        </div>
        </div>
    );
  }
}
export default withRouter(Subpage);
