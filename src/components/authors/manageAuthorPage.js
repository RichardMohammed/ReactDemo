"use strict";

var React = require('react');
var AuthorForm = require('./authorForm');
var Router = require('react-router');
var Link = require('react-router').Link;

var ManageAuthorPage = React.createClass({
    getInitialState: function(){
        return {
          author: {id: '', firstName: '', lastName: ''}
        };
    },

    setAuthorState: function(event){
      var field = event.target.name;
      var value = event.target.value;
      this.state.author[field] = value;

      return this.setState({author: this.state.author});
    },

    render: function(){
        return (
          <div>
            <AuthorForm
                author={this.state.author}
                onChange={this.setAuthorState}
            />
            <br/>
            <Link to="authors" className="btn btn-link">Go Back to Authors</Link>
          </div>
        );
    }
});

module.exports = ManageAuthorPage;
