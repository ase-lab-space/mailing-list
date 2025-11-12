import { forwardingEmailMap } from "./map.js";

export default {
	async email(message, _env, _ctx) {
		const { to } = message;
		const forwardAddresses = forwardingEmailMap[to];
		if (typeof forwardAddresses === 'undefined') {
			console.warn(`No forwarding addresses configured for ${to}`);
			return;
		}

		for (const forwardAddress of forwardAddresses) {
			try {
				await message.forward(forwardAddress)
			} catch (e) {
				console.error(`Failed to forward email to ${forwardAddress}:`, e);
			}
		}
	},
} satisfies ExportedHandler<Env>;
