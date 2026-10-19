import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { value } = body;

		// Исправка: преобразуй в число безопасно
		const numValue = typeof value === 'number' ? value : parseInt(value) || 0;
		const counter = numValue + 1;

		const response = NextResponse.json({
			message: 'Cookie set successfully',
			counter,
		});

		response.cookies.set('counter', counter.toString(), {
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24,
			secure: process.env.NODE_ENV === 'production',
		});

		return response;
	} catch (error) {
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
