"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrderStore } from "@/lib/zustand/useOrderStore";
import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import { isValid } from "@/lib/interface";
import { Button } from "./ui/button";

type TableProps = {
  page: number;
  isValid: isValid;
};

export function TableDemo({ page, isValid }: TableProps) {
  const { filteredOrders, fetchOrders, updateOrder, deleteOrder } =
    useOrderStore();

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  return (
    <Table key={page}>
      <TableHeader>
        <TableRow>
          <TableHead>Customer Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Order ID</TableHead>
          <TableHead>Bill of Materials</TableHead>
          <TableHead>Due Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <TableRow key={index}>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.id}</TableCell>
              <TableCell>
                {order.material?.map((item) => item.materialName).join(", ") ||
                  "No materials"}
              </TableCell>
              <TableCell>
                {new Date(order.dueDate).toLocaleDateString()}
              </TableCell>
              {isValid.isAdmin ? (
                <TableCell>
                  <Button
                    onClick={() => deleteOrder(order.id!)}
                    className={`cursor-pointer ${
                      isValid.id === order.createdById ? "" : "hidden"
                    }`}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              ) : (
                <TableCell>
                  <Button
                    onClick={() =>
                      updateOrder(order.id!, {
                        progress: "In Progress",
                        acceptedById: isValid.id,
                      })
                    }
                    disabled={
                      order.progress === "In Progress" ||
                      order.progress === "Completed"
                    }
                    className="bg-red-600 cursor-pointer"
                  >
                    Accept Order
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-gray-500">
              No orders found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
