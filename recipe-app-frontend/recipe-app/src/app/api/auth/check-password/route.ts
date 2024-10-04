import { CheckUserPassword } from "@/app/lib/data";

export async function POST(request: Request) {
    const body = await request.json();
    const password = body.password;
    const passwordCorrect = await CheckUserPassword(password);
    return new Response(JSON.stringify(passwordCorrect), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}