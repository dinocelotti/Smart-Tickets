import { connect } from 'react-redux'
import { setUserAddress } from '../../actions/user-actions';
import { LogoutButton } from './LogoutButton';
 /**
  * mapDispatchToProps - logoutButotn sets user address to the empty string
  * @param {dispatch} dispatch 
  */
const mapDispatchToProps = dispatch => {
	return {
		onClick: () => {
			dispatch(setUserAddress(''))
		}
	}
}

export default connect(null, mapDispatchToProps)(LogoutButton)