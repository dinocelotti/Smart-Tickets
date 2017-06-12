import * as types from './../actions/action-types';

const initialState = {
	acctsByAddr: {
		addr: '',
		balance: '',
		//reference this from proj-reducer
		assocProjsByAddr: []
	},
	accts: []
};
function acctsByAddr(state, action) {
	const nextState = { acctsByAddr: {}, accts: [] };

	nextState.acctsByAddr = action.accts.reduce((prevAccts, acct) => {
		nextState.accts.push(acct.addr);
		return Object.assign({}, prevAccts, { [acct.addr]: acct });
	}, {});
	console.log('acctsByAddr', nextState.acctsByAddr);
	return Object.assign({}, state, nextState);
}
function assocProjsByAddr(state, action) {
	let nextState = { ...state };
	action.assocProjs.map((assocP, index) => {
		const acctAddr = nextState.accts[index];
		return (nextState.acctsByAddr[acctAddr].assocProjsByAddr = assocP);
	});
	console.log('assocProjsByAddr', nextState);
	return nextState;
}
export default (state = initialState, action) => {
	switch (action.type) {
		case types.GET_ACCTS_SUCCESS:
			return acctsByAddr(state, action);

		case types.GET_ASSOC_PROJS_SUCCESS:
			return assocProjsByAddr(state, action);
		default:
	}
	return state;
};
