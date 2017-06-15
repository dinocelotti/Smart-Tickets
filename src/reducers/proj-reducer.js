import * as types from './../actions/action-types';
const initialState = {
	projResolverDeployed: false,
	projsByAddr: {},
	projs: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		//when we load the projs, replace the existing sprojs
		case types.LOAD_PROJS_SUCCESS:
			let nextState = { projsByAddr: {}, projs: [] };

			//make a map with the key being an address, value being the proj data
			nextState.projsByAddr = action.projs.reduce((prev, proj) => {
				//push onto the array for relational lookup later on
				nextState.projs.push(proj.addr);

				return Object.assign({}, prev, { [proj.addr]: proj });
			}, {});
			console.log('proj-reducer', Object.assign({}, state, nextState));
			//return this new state
			return Object.assign({}, state, nextState);

		case types.PROJ_RESOLVER_DEPLOYED_SUCCESS:
			return Object.assign({}, state, { projResolverDeployed: action.projResolverDeployed });

		case types.EVENT_PROJ_CREATED:
			break;

		case types.EVENT_PROJ_FINISH_STAGING:
		case types.EVENT_PROJ_START_PUBLIC_FUNDING:
			return stateHandler(action.type, state, action.event);

		case types.EVENT_PROJ_SET_TIX_PRICE:
		case types.EVENT_PROJ_SET_TIX_QUANTITY:
			return tixHandler(action.type, state, action.event);
		case types.EVENT_PROJ_SET_DISTRIB:
		case types.EVENT_PROJ_SET_DISTRIB_ALLOT_QUAN:
		case types.EVENT_PROJ_SET_DISTRIB_FEE:
		case types.EVENT_PROJ_SET_MARKUP:
			return distribHandler(action.type, state, action.event);

		case types.EVENT_PROJ_BUY_TIX_FROM_PROMO:
		case types.EVENT_PROJ_BUY_TIX_FROM_DISTRIB:
			return buyHandler(action.type, state, action.event);
		case types.EVENT_PROJ_WITHDRAW:
			break;
		case types.EVENT_PROJ_RESOLVER_ADD_ADDR:
		case types.EVENT_PROJ_RESOLVER_ADD_PROJ:

		default:
	}
	return state;
};
function stateHandler(type, prevState, { address, args }) {
	if (types === types.EVENT_PROJ_FINISH_STAGING) {
	} else if (types === types.EVENT_PROJ_START_PUBLIC_FUNDING) {
	}
}
function tixHandler(type, prevState, { address, args }) {}
function distribHandler(type, prevState, { address, args }) {}
function buyHandler(type, prevState, { address, args }) {}
