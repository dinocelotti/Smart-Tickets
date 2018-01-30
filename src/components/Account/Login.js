import React from 'react'
import PropTypes from 'prop-types'

/**
 * 
 * @param {dispatch} setUserAddress - dispatcher for SET_USER_ADDRESS function 
 */
export default class Login extends React.Component{
    constructor(props){
        super(props);
        this.state={email: '7'}
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    handleChange(event){
        this.setState({email: event.target.email})
        console.log(this.state.email)
    }
    handleSubmit(event){
        this.props.setUserAddress('string')
        event.preventDefault();
    }
    render(){
        return (
            <div className="ui middle aligned center aligned grid">
            <div className="column">
                <h2 className="ui black image header">
                    <div className="content">
                        Log-in to your account
                    </div>
                </h2>
                <form onSubmit={this.handleSubmit} className="ui large form">
                    <div className="ui stacked segment">
                        <div className="field">
                            <div className="ui left input">
                                <input onChange={this.handleChange} value={this.state.email} type="text"/>
                            </div>
                        </div>
                        <div className="field">
                            <div className="ui left input">
                                <input type="password" name="password" placeholder="Password"/>
                            </div>
                        </div>
                        <button className="ui fluid large black submit button">Login</button>
                    </div>
                </form>
                <div className="ui segment">This page subject to change as we determine how to handle logins. Example only.</div>
            </div>    
        </div>
        )
    }
}
Login.propTypes = {
    accounts : PropTypes.arrayOf(PropTypes.string),
    setUserAddress: PropTypes.func.isRequired
}
