"use client";

import { Chip } from "@heroui/react";
import clsx from "clsx";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useState } from "react";
import { GoInbox } from "react-icons/go";
import { MdOutlineOutbox } from "react-icons/md";

export default function MessageSidebar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [selected, setSelected] =
    useState<string>(
      searchParams.get("container") || "inbox"
    );

  const items = [
    {
      key: "inbox",
      label: "Inbox",
      icon: GoInbox,
      chip: true,
    },
    {
      key: "outbox",
      label: "Outbox",
      icon: MdOutlineOutbox,
      chip: false,
    },
  ];

  const handleSelect = (key: string) => {
    setSelected(key);
    const params = new URLSearchParams();
    params.set("container", key);
    router.replace(`${pathname}?${params}`);
  };

  return (
    <div className="flex flex-col shadow-md rounded-lg cursor-pointer">
      {items.map(
        ({ key, icon: Icon, label, chip }) => (
          <div
            key={key}
            className={clsx(
              "flex flex-row items-center rounded-t-lg gap-2 p-3",
              {
                "text-default font-semibold":
                  selected === key,
                "text-black hover:text-default/70":
                  selected !== key,
              }
            )}
            onClick={() => handleSelect(key)}
          >
            <Icon size={24} />
            <div className="flex justify-between flex-grow">
              <span>{label}</span>
              {chip && <Chip>2</Chip>}
              {/* Demo Purpose: will change the incoming messages count in upcoming commits */}
            </div>
          </div>
        )
      )}
    </div>
  );
}