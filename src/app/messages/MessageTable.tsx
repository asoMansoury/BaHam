"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { MessageDto } from "../types/Messages/MessageDto";
import { Key, useCallback, useState } from "react";
import { Avatar, Button, Card, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { AiFillDelete } from "react-icons/ai";
import { truncateString } from "@/lib/utils";
import { deleteMessage } from "../actions/messageActions";

type MessageTableProps = {
    messages:MessageDto[];
};

const outboxColumns = [
    {key:"recipientName",label:"Recipient"},
    {key:"text",label:"Message"},
    {key:"created",label:"Date sent"},
    {key:"actions",label:"Actions"}
]
const inboxColumns = [
    {key:"senderName",label:"Sender"},
    {key:"text",label:"Message"},
    {key:"created",label:"Date received"},
    {key:"actions",label:"Actions"}
];


export default function MessageTable({
  messages,
}: MessageTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isOutbox =
    searchParams.get("container") === "outbox";

  // If isOutbox is true, the current user is the sender
  // If isOutbox is false, the current user is the recipient

  const [isDeleting, setDeleting] = useState({
    id: "",
    loading: false,
  });

  const columns = isOutbox
    ? outboxColumns
    : inboxColumns;

  const handleDeleteMessage = useCallback(
    async (message: MessageDto) => {
      setDeleting({
        id: message.id,
        loading: true,
      });
      await deleteMessage(message.id, isOutbox);
      router.refresh();
      setDeleting({ id: "", loading: false });
    },
    [isOutbox, router]
  );

  const handleRowSelect = (key: Key) => {
    const message = messages.find(
      (m) => m.id === key
    );
    const url = isOutbox
      ? `/members/${message?.recipientId}`
      : `/members/${message?.senderId}`;
      console.log({url});
    router.push(url + "/chat");
  };

  const renderCell = useCallback(
    (
      item: MessageDto,
      columnKey: string
    ) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "recipientName":
        case "senderName":
          return (
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar
                alt="Image of member"
                src={
                  (isOutbox
                    ? item.recipientImage
                    : item.senderImage) ||
                  "/images/user.png"
                }
              />
              <span>{cellValue.toString()}</span>
            </div>
          );
        case "text":
          return (
            <div>
              {truncateString(cellValue.toString(), 80)}
            </div>
          );
        case "created":
          return cellValue instanceof Date ? cellValue.toLocaleString() : cellValue;
        default:
          return (
            <Button
              isIconOnly
              variant="light"
              onClick={() =>
                handleDeleteMessage(item)
              }
              isLoading={
                isDeleting.id === item.id &&
                isDeleting.loading
              }
            >
              <AiFillDelete
                size={24}
                className="text-danger"
              />
            </Button>
          );
      }
    },
    [
      isOutbox,
      isDeleting.id,
      isDeleting.loading,
      handleDeleteMessage,
    ]
  );

  return (
    <Card className="flex flex-col gap-3 h-[80vh] overflow-auto">
      <Table
        aria-label="Table with messages"
        selectionMode="single"
        onRowAction={(key) =>
          handleRowSelect(key)
        }
        shadow="none"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              width={
                column.key === "text"
                  ? "50%"
                  : undefined
              }
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={messages}
          emptyContent="No messages for this container"
        >
          {(item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer"
            >
              {(columnKey) => (
                <TableCell
                  className={`${
                    !item.dateRead && !isOutbox
                      ? "font-semibold"
                      : ""
                  }`}
                >
                  {renderCell(
                    item,
                    columnKey as keyof MessageDto
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}