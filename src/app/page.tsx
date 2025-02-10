import { Button, Link } from "@heroui/react";
import Image from "next/image";
import { FaRegSmile } from "react-icons/fa";

export default function Home() {
  return (
    <div className="text-3xl">
      <h1>Hello app</h1>
      <Button 
        as={Link}
        href="/members"
        color="primary"
        variant="bordered"
        startContent={<FaRegSmile size={20}></FaRegSmile>}
      ></Button>
    </div>
  );
}
