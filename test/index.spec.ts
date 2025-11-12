import { env, createExecutionContext } from 'cloudflare:test';
import { describe, it, expect, vi } from 'vitest';
import worker from '../src/index';
import { forwardingEmailMap } from '../src/map';

const createMessage: (to: string, forward: (address: string) => Promise<void>) => ForwardableEmailMessage = (to, forward) => {
	return {
		raw: new ReadableStream(),
		headers: new Headers(),
		rawSize: 0,
		setReject: vi.fn(),
		reply: vi.fn(),
		to,
		from: 'test@example.com',
		forward,
	};
}

describe('Email Forwarding Worker', () => {
	describe('email handler', () => {
		it('should forward email to all configured addresses', async () => {
			const forwardMock = vi.fn().mockResolvedValue(undefined);
			const testEmail = 'office@ase-lab.space';
			const expectedAddresses = forwardingEmailMap[testEmail];

			const message = createMessage(testEmail, forwardMock);

			const ctx = createExecutionContext();
			await worker.email(message, env, ctx);

			// Verify forward was called for each address
			expect(forwardMock).toHaveBeenCalledTimes(expectedAddresses!.length);
			expectedAddresses!.forEach((address) => {
				expect(forwardMock).toHaveBeenCalledWith(address);
			});
		});

		it('should log warning when no forwarding addresses are configured', async () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const forwardMock = vi.fn();
			const unknownEmail = 'unknown@example.com';

			const message = createMessage(unknownEmail, forwardMock);

			const ctx = createExecutionContext();
			await worker.email(message, env, ctx);

			// Verify warning was logged
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				`No forwarding addresses configured for ${unknownEmail}`
			);
			// Verify forward was never called
			expect(forwardMock).not.toHaveBeenCalled();

			consoleWarnSpy.mockRestore();
		});

		it('should continue forwarding to other addresses if one fails', async () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			const testEmail = 'office@ase-lab.space';
			const expectedAddresses = forwardingEmailMap[testEmail];
			const testError = new Error('Forward failed');

			// Mock forward to fail on the first call, succeed on others
			const forwardMock = vi
				.fn()
				.mockRejectedValueOnce(testError)
				.mockResolvedValue(undefined);

			const message = createMessage(testEmail, forwardMock);

			const ctx = createExecutionContext();
			await worker.email(message, env, ctx);

			// Verify forward was still called for all addresses
			expect(forwardMock).toHaveBeenCalledTimes(expectedAddresses!.length);

			// Verify error was logged for the failed address
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				`Failed to forward email to ${expectedAddresses![0]}:`,
				testError
			);

			consoleErrorSpy.mockRestore();
		});
	});
});
