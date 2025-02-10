
  import { Button, Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import Link from "next/link";
  import React from "react";
  import { GiSelfLove } from "react-icons/gi";
import NavLink from "./NavLink";
  
  export default async function TopNav() {

  
    const memberLinks = [
      { href: "/members", label: "Matches" },
      { href: "/lists", label: "Lists" },
      { href: "/messages", label: "Messages" },
    ];
  
    const adminLinks = [
      {
        href: "/admin/moderation",
        label: "Photo Moderation",
      },
    ];
  

    return (
      <>
        <Navbar
          maxWidth="full"
          className="bg-gradient-to-r from-pink-400 via-red-400 to-pink-600"
          classNames={{
            item: [
              "text-xl",
              "text-white",
              "uppercase",
              "data-[active=true]:text-yellow-200",
            ],
          }}
        >
          <NavbarBrand as={Link} href="/" className='p-2'>
            <GiSelfLove
              size={40}
              className="text-gray-200"
            />
            <div className="font-bold text-3xl flex">
              <span className="text-gray-200">
                MatchMe
              </span>
            </div>
          </NavbarBrand>
          <NavbarContent justify="center">
            <NavLink
                href="members"
                label="Mathes"
            ></NavLink>
            <NavLink
                href="lists"
                label="Lists"
            ></NavLink>
                        <NavLink
                href="messages"
                label="Messages"
            ></NavLink>
          </NavbarContent>
          <NavbarContent
            justify="end"
          >
            <Button
                as={Link}
                href="/login"
                variant="bordered"
                className="text-white"
            >Login</Button>
               <Button
                as={Link}
                href="/register"
                variant="bordered"
                className="text-white"
            >Register</Button>
          </NavbarContent>
        </Navbar>

      </>
    );
  }