import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { engine, counterparty_id, transaction_id, ml_strategy } = body;

        if (!engine) {
            return NextResponse.json({ error: 'Missing required engine parameter' }, { status: 400 });
        }

        if (!ml_strategy) {
            return NextResponse.json({ error: 'Missing required ml_strategy parameter' }, { status: 400 });
        }

        console.log('Sending request to Flask API...', { engine, counterparty_id, transaction_id, ml_strategy });

        // Make request to Flask API
        const flaskResponse = await fetch('http://127.0.0.1:5000/analyze_pfe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ engine, counterparty_id, transaction_id, ml_strategy }),
        });

        console.log('Received response from Flask API. Status:', flaskResponse.status);

        if (!flaskResponse.ok) {
            const errorText = await flaskResponse.text();
            console.error('Flask API error response:', errorText);
            throw new Error(`Failed to fetch analysis results from Flask API. Status: ${flaskResponse.status}, Error: ${errorText}`);
        }

        const data = await flaskResponse.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Detailed error in analyze_pfe API:', error);
        return NextResponse.json({ error: 'Internal server error', details: (error as Error).message }, { status: 500 });
    }
}