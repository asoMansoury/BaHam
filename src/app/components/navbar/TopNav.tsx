import { Button, Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import Link from "next/link";
import React from "react";
import { GiSelfLove } from "react-icons/gi";
import NavLink from "./NavLink";
import { auth } from "@/auth";
import UserMenu from "./UserMenu";
import FiltersWrapper from "../FilterWrapper";
  
  export default async function TopNav() {
    const session =await auth();
    const memberLinks = [
      { href: "members", label: "Mathes" },
      { href: "lists", label: "Lists" },
      { href: "messages", label: "Messages" }
    ]

    const adminLinks = [
      { href: "/admin/moderation", label: "Photo Moderation" }
    ]
    const links = session?.user?.role === "ADMIN"?adminLinks:memberLinks;
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
            {
              links.map((item)=>(
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                ></NavLink>
              ))
            }
          </NavbarContent>
          <NavbarContent
            justify="end"
          >
            {
              session?.user ?(
                <UserMenu user={session.user}></UserMenu>
              ):(
                <>
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
                      className="text-white">Register</Button>
                </>
              )
            }

          </NavbarContent>
        </Navbar>
        <FiltersWrapper></FiltersWrapper>
      </>
    );
  }