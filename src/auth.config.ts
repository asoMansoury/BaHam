
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./lib/schemas/LoginSchemas";
import { compare } from "bcryptjs";
import { getUserByEmail } from "./app/actions/authActions";

const authOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { },
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) return null;

        const { email, password } = validated.data;
        const user = await getUserByEmail(email);

        if (!user || !user.passwordHash || !(await compare(password, user.passwordHash))) {
          return null;
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
};

export default authOptions;
