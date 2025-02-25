import { NextResponse } from 'next/server';
import { signInUser } from '../../../../app/actions/authActions';
import { loginSchema } from '../../../../lib/schemas/LoginSchemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const result = await signInUser(validated.data);

    if (result.status === 'error') {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: result.data },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
