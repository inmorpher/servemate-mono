import { API_BASE_URL } from '@/consts';
import { ApiError } from '@/app/api/service/[...params]/errors';
import { getValidatedTokenFromSession } from '@/app/api/service/[...params]/token-utils';
import { NextRequest, NextResponse } from 'next/server';
import WebSocket from 'ws';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const KEEP_ALIVE_INTERVAL_MS = 25_000;
const encoder = new TextEncoder();

export async function GET(request: NextRequest) {
	const resource = request.nextUrl.searchParams.get('resource');
	const entityId = request.nextUrl.searchParams.get('entityId');

	if (!resource) {
		return NextResponse.json({ error: 'Missing resource' }, { status: 400 });
	}

	let accessToken: string;
	try {
		({ accessToken } = await getValidatedTokenFromSession());
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json(
				{ error: error.requiresLogin ? 'Unauthorized' : error.message },
				{ status: error.statusCode },
			);
		}
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}

	const upstreamUrl = new URL('/ws', API_BASE_URL.replace(/^http/, 'ws'));
	upstreamUrl.searchParams.set('resource', resource);

	if (entityId) {
		upstreamUrl.searchParams.set('entityId', entityId);
	}

	let socket: WebSocket | undefined;
	let keepAlive: ReturnType<typeof setInterval> | undefined;

	const stream = new ReadableStream<Uint8Array>({
		start(controller) {
			const send = (chunk: string) => {
				try {
					controller.enqueue(encoder.encode(chunk));
				} catch {
					// Browser already closed the stream.
				}
			};

			socket = new WebSocket(upstreamUrl, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});

			socket.on('message', (raw) => send(`data: ${raw.toString()}\n\n`));

			socket.on('close', (code, reason) => {
				clearInterval(keepAlive);
				if (code !== 1000) {
					send(
						`event: error\ndata: ${JSON.stringify({ code, reason: reason.toString() })}\n\n`,
					);
				}
				try {
					controller.close();
				} catch {
					// Already closed by cancel().
				}
			});

			socket.on('error', () => {
				// 'close' always follows 'error', so the stream is closed there.
			});

			keepAlive = setInterval(() => send(': ping\n\n'), KEEP_ALIVE_INTERVAL_MS);
			request.signal.addEventListener('abort', () => socket?.close(1000));
		},
		cancel() {
			clearInterval(keepAlive);
			socket?.close(1000);
		},
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache, no-transform',
			Connection: 'keep-alive',
			'X-Accel-Buffering': 'no',
		},
	});
}
