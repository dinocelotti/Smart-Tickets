import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Image, Dropdown, Button } from 'semantic-ui-react';

/**
 * 
 * @param {dispatch} setUserAddress - dispatcher for SET_USER_ADDRESS function 
 */
class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {address: ''}
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    createDropdownList(accounts){
        return accounts.ids.map(id => ({
            value: id,
            text: id,
            description: 'wei: ' + accounts.byId[id].balance
        }));
    }
    handleChange = (event, {value}) => { 
        this.setState({ 
            address: value
        })
    }
    handleClick = (e) => {
        e.preventDefault();
        this.props.onClick(this.state.address)
    }
    render() {
        const value=this.state.address
        return (
            <div className="ui middle aligned center aligned grid" style={{paddingTop: 10}}>
                <div className="column" style={{maxWidth: 650}}>
                    
                    <h2 className="ui black image header">
                        <div className="content">
                            Log-in to your account
                        </div>
                    </h2>

                    <div className="ui large form">
                        <div className="ui stacked segment">
                            <Dropdown 
                            onChange={this.handleChange} 
                            value={value}
                            placeholder='Select Address' 
                            type="text" 
                            fluid 
                            search 
                            selection 
                            options={this.createDropdownList(this.props.accountState)} 
                            />
                            <Button fluid large color='black' onClick={this.handleClick} style={{marginTop: 20}}>Login</Button>
                        </div>
                        <div className="ui segment">This page subject to change as we determine how to handle logins. Example only.</div>
                    </div>
                </div>
            </div>
        )
    }
}
Login.propTypes = {
    accounts : PropTypes.arrayOf(PropTypes.string),
    onClick: PropTypes.func.isRequired
}
export default Login