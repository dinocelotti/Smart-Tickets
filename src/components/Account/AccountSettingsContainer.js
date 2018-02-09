import { connect } from 'react-redux'
import AccountSettings from './AccountSettings'

/**
 * redux bindings
 */
const mapStateToProps = ( state ) => {
	return {
        userAccount: state.userState
	}
}
const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
    }
}
export default connect(mapStateToProps, null, mergeProps)(AccountSettings)