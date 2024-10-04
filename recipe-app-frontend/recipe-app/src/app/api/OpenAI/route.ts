// src/app/api/OpenAI/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
        return NextResponse.json({ message: 'Messages are required and should be an array' }, { status: 400 });
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                ...messages,
            ],
            model: 'gpt-4o-mini',
        });

        const reply = completion.choices[0].message?.content?.trim() ?? '';
        return NextResponse.json({ reply }, { status: 200 });
    } catch (error) {
        console.error('OpenAI API error:', error);
        return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
    }
}
