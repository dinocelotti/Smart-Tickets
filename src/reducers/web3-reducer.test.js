/* eslint-env jest */
import store from '../store'
import reducer from './web3-reducer'
import actions from '../actions/web3-actions'
import types from '../actions/action-types'
import EthApi from '../api/eth-api'
describe('web3-reducer', () => {
	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual({
			web3: { connected: false },
			projectResolver: { deployed: false }
		})
	})
	it(`should handle ${types.WEB3_CONNECTED}`, () => {
		expect(reducer(undefined, actions.web3Connected())).toEqual({
			web3: { connected: true },
			projectResolver: { deployed: false }
		})
	})
	it(`should handle ${types.PROJECT_RESOLVER_DEPLOYED}`, () => {
		expect(reducer(undefined, actions.projectResolverDeployed())).toEqual({
			web3: { connected: false },
			projectResolver: { deployed: true }
		})
	})
	/*
})
