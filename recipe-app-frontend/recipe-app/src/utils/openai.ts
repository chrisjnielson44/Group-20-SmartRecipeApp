export const getChatResponse = async (messages: { text: string, isUser: boolean }[]) => {
    const response = await fetch('/api/OpenAI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: messages.map(message => ({
                role: message.isUser ? 'user' : 'assistant',
                content: message.text,
            })),
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    const data = await response.json();
    return data.reply;
};