import types from '../actions/action-types'
const initial = {
	byId: {},
	ids: []
}
const getAccounts = {
	action: {
		type: types.GET_ACCOUNTS_SUCCESS,
		payload: {
			accounts: [
				{
					address: '0x0088063e1748489D4a5D2CC63e50e3159c005Fd4',
					balance: '1500'
				},
				{
					address: '0x1234563e1748489D4a5D2CC63e50e315SAD05Fd4',
					balance: '1243'
				}
			]
		}
	},
	state: {
		byId: {
			'0x0088063e1748489D4a5D2CC63e50e3159c005Fd4': {
				address: '0x0088063e1748489D4a5D2CC63e50e3159c005Fd4',
				balance: '1500'
			},
			'0x1234563e1748489D4a5D2CC63e50e315SAD05Fd4': {
				address: '0x1234563e1748489D4a5D2CC63e50e315SAD05Fd4',
				balance: '1243'
			}
		},
		ids: [
			'0x0088063e1748489D4a5D2CC63e50e3159c005Fd4',
			'0x1234563e1748489D4a5D2CC63e50e315SAD05Fd4'
		]
	}
}
const getAssocProjects = {
	action: {
		type: types.GET_ASSOCIATED_PROJECTS_SUCCESS,
		payload: {
			assocProjects: [
				{
					assocProjects: [
						'0x886759a2104C091446d91597F22EBb264F31995F',
						'0xC27F4E671019eD54fCB82BbC702CAE1347385B4F'
					],
					account: '0x86cd5715b19a2a279a5bd5d33590b37b9587954b'
				}
			]
		}
	},
	state: {
		byId: {
			'0x86cd5715b19a2a279a5bd5d33590b37b9587954b': {
				assocProjects: [
					'0x886759a2104C091446d91597F22EBb264F31995F',
					'0xC27F4E671019eD54fCB82BbC702CAE1347385B4F'
				]
			}
		},
		ids: ['0x86cd5715b19a2a279a5bd5d33590b37b9587954b']
	}
}
const accData = {
	initial,
	getAccounts,
	getAssocProjects
}
export { accData }
