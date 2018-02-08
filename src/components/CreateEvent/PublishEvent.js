import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react'

/**
 * Creates a top bar that displays the steps to creating an event
 *  
 */
const PublishEvent = (props) => {
    return(
        <div className="ui padded grid">
            <div className="ui row">
                <div className="ui column two wide">
                    <div className="ui statistic">
                        <div className="ui value">00</div>
                        <div className="label">Month 0000</div>
                    </div>
                </div>
                <div className="ui column seven wide">
                    <div className="ui huge header">{props.projectName}</div>
                    <div className="description">
                        <span>0:00 AM</span>
                        <span>|</span>
                        <span>Location, City BC</span>
                    </div>
                </div>
                <div className="ui column seven wide">
                    <table className="ui right aligned compact stackable striped table">
                        <thead>
                            <tr className="single line">
                                <td className="ui header small">Publishing Fee</td>
                                <td className="collapsing">-.-- ETH</td>
                                <td className="collapsing">$--.-- CAD</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="single line">
                                <td className="ui header small">Ethereum Transfer Fee:</td>
                                <td>-- ETH</td>
                                <td>$-- CAD</td>    
                            </tr>                                       
                        </tbody>
                    </table>
                </div>
            </div>

            {props.tickets.map((ticket)=>{
                return <Ticket {...ticket} key={ticket.ticketClass}/>
            })} 

            <div className="ui one column row centered">
                <div className="ui divider horizontal">
                    <Button size="large" color="green" onClick={props.handleSubmit}> 
                        Create Event
                    </Button>
                </div> 
            </div>
            <div className="ui row centered">
                <div className="ui column eight wide">
                    <div className="ui red segment">
                        We're still working on this page! We can't easily calculate appropriate costs on testRPC, but once we get to a test network we'll have realistic cost estimates.
                    </div>
                </div>
            </div>
        </div>
    )
}
PublishEvent.propTypes = {
    projectName: PropTypes.string,
    tickets: PropTypes.arrayOf(PropTypes.shape({
        ticketClass: PropTypes.string,
        totalNumber: PropTypes.string,
        maxPrice: PropTypes.string,
        faceValue: PropTypes.string,
    })),
    handleSubmit: PropTypes.func.isRequired,
}
const Ticket = (props) => (
    <div className="ui stackable four column row middle aligned segment">
        <div className="ui column three wide">
            <div className="ui header">{props.ticketClass}</div>
        </div>
        <div className="ui column three wide">
            <div className="ui mini horizontal statistic">
                <div className="value">{props.totalNumber}</div>
                <div className="label">Available</div>
            </div>
            <div className="ui horizontal fitted divider">#</div>
            <div className="ui mini horizontal statistic">
                <div className="value">--</div>
                <div className="label">Reserved</div>
            </div>
        </div>
        <div className="ui column three wide">
            <div className="ui mini green horizontal statistic">
                <div className="value">${props.faceValue}</div>
                <div className="label">Suggested</div>
            </div>
            <div className="ui horizontal fitted divider">Price Per Ticket</div>
            <div className="ui mini green  horizontal statistic">
                <div className="value">${props.maxPrice}</div>
                <div className="label">Maximum</div>
            </div>
        </div>
        <div className="ui right aligned column six wide">
            <table className="ui striped right aligned compact stackable small table">
                <tbody>
                    <tr className="single line">
                        <td className="ui header small">Sub Total</td>
                        <td className="collapsing">$-- ETH</td>
                        <td className="collapsing">$-- CAD</td>
                    </tr>
                    <tr className="single line">
                        <td className="ui header small">ETH Transfer Fee:</td>
                        <td>$-- ETH</td>
                        <td>$-- CAD</td>    
                    </tr>
                    <tr>
                        <td className="ui header">Total:</td>
                        <td>$-- ETH</td>
                        <td>$-- CAD</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
)
Ticket.propTypes = {
    ticketClass: PropTypes.string,
    totalNumber: PropTypes.string,
    maxPrice: PropTypes.string,
    faceValue: PropTypes.string,
    key: PropTypes.string,
}
export default PublishEvent