import { connect } from 'react-redux'
import Login from './Login'
/**
 * mapStateToProps - maps accounts list to props 
 * @param {state} state 
 */
function mapStateToProps(state){
	return({
		accounts: state.accountState.accounts
	});
}
 /**
  * mapDispatchToProps - maps SET_USER_ADDRESS dispatch to props
  * @param {dispatch} dispatch 
  */
function mapDispatchToProps(dispatch) {
	return({
		//setUserAddress: () => {dispatch(SET_USER_ADDRESS)}
		setUserAddress: (address) => {console.log(address)}
	});
}

/**
 * LoginContainer isn't a true container - it's really just a container for the redux state and action.
 */
export const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login)
