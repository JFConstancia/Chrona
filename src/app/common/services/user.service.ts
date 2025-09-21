

const registerUserAsync = async (email: string, password: string): Promise<Response> => 
  await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

export const userService = { registerUserAsync }


