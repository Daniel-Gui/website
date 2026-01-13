import fs from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const projectRoot = process.cwd();
const kitDir = path.join(projectRoot, '.svelte-kit');
const cloudflareDir = path.join(kitDir, 'cloudflare');

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

async function withRetries(fn, { attempts = 8, delayMs = 60 } = {}) {
	let lastError;
	for (let i = 0; i < attempts; i++) {
		try {
			return await fn(i);
		} catch (e) {
			lastError = e;
			await sleep(delayMs * Math.pow(2, i));
		}
	}
	throw lastError;
}

function exists(p) {
	try {
		fs.accessSync(p);
		return true;
	} catch {
		return false;
	}
}

function stopCloudflareProcesses() {
	if (process.platform !== 'win32') return;
	try {
		execSync('taskkill /f /im wrangler.exe /im workerd.exe', { stdio: 'ignore' });
	} catch (e) {
		void e;
	}
}

async function main() {
	if (!exists(kitDir)) {
		return;
	}

	if (!exists(cloudflareDir)) {
		return;
	}

	const staleDir = `${cloudflareDir}-stale-${Date.now()}`;

	await withRetries(async (attempt) => {
		if (attempt === 0) stopCloudflareProcesses();

		try {
			fs.renameSync(cloudflareDir, staleDir);
			return;
		} catch (e) {
			void e;
		}

		try {
			fs.rmSync(cloudflareDir, { recursive: true, force: true });
			return;
		} catch (e) {
			void e;
		}

		try {
			fs.rmSync(staleDir, { recursive: true, force: true });
		} catch (e) {
			void e;
		}

		throw new Error(
			`Não foi possível preparar o build: a pasta ".svelte-kit/cloudflare" está em uso. Feche "wrangler preview/dev" e tente novamente.`
		);
	});

	try {
		fs.rmSync(staleDir, { recursive: true, force: true });
	} catch (e) {
		void e;
	}
}

await main();
