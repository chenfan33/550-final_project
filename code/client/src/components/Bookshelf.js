import React from 'react';
import { withRouter } from "react-router-dom";
import PageNavbar from './PageNavbar';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class Bookshelf extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected movie name,
		// and the list of recommended movies.
		this.state = {
			username: "",
			books: []
		}
	}

	handleUserNameChange(e) {
		this.setState({
			username: e.target.value
		});
	}

	componentDidMount() {
		let storage = window.localStorage;
        let username = storage.getItem("username");
        if (username!= null & username!= ""){
          this.state.isLoggedIn =true;
          this.setState({title:username+"'s Bookshelf"});
        }
        else{this.setState({title: "Please Log in to see your bookshelf"})}
		fetch("http://localhost:8081/bookshelf?username="+username, {
			method: 'GET' // The type of HTTP request.
		  })
			.then(res => res.json()) // Convert the response data to a JSON.
			.then(res => {
			  this.setState({
				books: res
			  })
			})
			.catch(err => console.log(err))	// Print the error if there is one.
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
		return (
			<div className="Bookshelf">
           <PageNavbar active="bookshelf" />
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
export default withRouter(Bookshelf);
