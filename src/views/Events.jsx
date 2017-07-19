import React, { Component } from 'react'
import ReactTable from 'react-table'
import '!style!css!react-table/react-table.css'
import Layout from '../components/Layout'
import propTypes from 'prop-types'

class Events extends Component {
	static propTypes = {
		value: propTypes.any
	}
	data = [
		{
			name: 'Tanner Linsley',
			age: 26,
			friend: {
				name: 'Jason Maurer',
				age: 23
			}
		}
	]

	columns = [
		{
			Header: 'Name',
			accessor: 'name' // String-based value accessors!
		},
		{
			Header: 'Age',
			accessor: 'age',
			Cell: props =>
				<span className="number">
					{props.value}
				</span> // Custom cell components!
		},
		{
			id: 'friendName', // Required because our accessor is not a string
			Header: 'Friend Name',
			accessor: d => d.friend.name // Custom value accessors!
		},
		{
			Header: props => <span>{`Friend Age ${props}`}</span>, // Custom header components!
			accessor: 'friend.age'
		}
	]
	render() {
		return (
			<Layout>
				<ReactTable data={this.data} columns={this.columns} />
			</Layout>
		)
	}
}

export default Events
