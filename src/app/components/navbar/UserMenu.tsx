'use client'

import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@heroui/react";
import { Session } from "next-auth"
import Link from "next/link";
import {  signOutUser} from "@/app/actions/authActions";
type UserMenuProps = {
    user:Session["user"];
}

export default function UserMenu({
    user,
  }: UserMenuProps) {
    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            color="default"
            name={user?.name || "user avatar"}
            size="sm"
            src={user?.image || "/images/user.png"}
          />
        </DropdownTrigger>
        <DropdownMenu
          variant="flat"
          aria-label="User actions menu"
        >
          <DropdownSection showDivider>
            <DropdownItem
             key="btnSignIn"
              isReadOnly
              as="span"
              className="h-14 flex flex-row"
              aria-label="username"
            >
              Signed in as {user?.name}
            </DropdownItem>
          </DropdownSection>
          <DropdownItem
            key="btnEditProfile"
            as={Link}
            href="/user/edit"
          >
            Edit profile
          </DropdownItem>
          <DropdownItem
            key="btnSignOut"
            color="danger"
            onClick={async () => signOutUser()}
          >
            Log out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }