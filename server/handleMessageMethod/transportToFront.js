const sharedTransmitter = require('../helpers/sharedTransmitter');


exports.transportToFront = async (userId, padId,action,data , socketClient)=>{
	const msg = {
		type: 'COLLABROOM',
		data: {
			type: 'CUSTOM',
			payload: {
				padId: padId,
				userId: userId,
				action: action,
				data: data,
			},
		},
	};
	sharedTransmitter.sendToUser(msg,socketClient);
};
