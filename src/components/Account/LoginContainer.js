import { connect } from 'react-redux'
import Login from './Login'
import { setUserAddress } from '../../actions/user-actions';

/**
 * mapStateToProps - maps accounts list to props 
 * @param {state} state 
 */
const mapStateToProps = ({ accountState }) => ({ accountState }); 
 /**
  * mapDispatchToProps - maps SET_USER_ADDRESS dispatch to props
  * @param {dispatch} dispatch 
  */
const mapDispatchToProps = dispatch => {
	return {
		onClick: address => {
			dispatch(setUserAddress(address))
		}
	}
}
  


export default connect(mapStateToProps, mapDispatchToProps)(Login)