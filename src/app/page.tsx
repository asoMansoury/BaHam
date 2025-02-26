import { Button } from "@heroui/react";
import { signOut  } from '../auth';
import {  FaRegSmileBeam } from "react-icons/fa";
import authConfig from "../auth.config";
import { getServerSession } from "next-auth";
export default async function Home() {
  // const session = await auth();
  const session = await getServerSession(authConfig);
  return (
    <div>
      <h1 className="text-3xl">Hello app!</h1>

      <h3 className="text-2xl font-semibold">
        User Session data :
      </h3>
      {
        session?(
          <div>
            <pre>
              {JSON.stringify(session,null,2)}
            </pre>
            <form
              action={async () =>{
                "use server";
                await signOut();
              }}
            >
              <Button
                type="submit"
                color="primary"
                variant="bordered"
                startContent={
                  <FaRegSmileBeam size={20}></FaRegSmileBeam>
                }
              >
                Sign out
              </Button>
              </form>
          </div>

        ):(
          <div>Not signed in</div>
        )
      }
    </div>
  );
}
