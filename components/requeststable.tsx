"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { isValid } from "@/lib/interface";
import { useRequestStore } from "@/lib/zustand/useRequest";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { useRequestApprovalStore } from "@/lib/zustand/useRequestApprovalStore";

type TableProps = {
  page: number;
  isValid: isValid;
};

export function TableRequests({ page, isValid }: TableProps) {
  const { filteredrequests, getRequests, deleteRequest, updateRequest } =
    useRequestStore();

  const { approveRequest } = useRequestApprovalStore();

  useEffect(() => {
    getRequests(1);
  }, [getRequests]);
  return (
    <Table key={page}>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Bill of Materials</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredrequests.length > 0 ? (
          filteredrequests.map((req, index) => (
            <TableRow key={`temp-${index}`}>
              <TableCell>{req.createdBy ? req.createdBy.name : NaN}</TableCell>
              <TableCell>{req.title}</TableCell>
              <TableCell>{req.description}</TableCell>
              <TableCell>{req.status}</TableCell>
              <TableCell>
                {req.materials
                  .map((m) => `${m.materialName} (${m.quantity})`)
                  .join(", ")}
              </TableCell>

              {isValid.isAdmin ? (
                <TableCell>
                  <Button
                    onClick={() => approveRequest(req.id!)}
                    disabled={
                      req.status === "Approved" || req.status === "Approved"
                    }
                    className={`ml-2 text-white bg-green-500 
                    ${
                      req.status === "Rejected"
                        ? "cursor-not-allowed opacity-50 hover:bg-green-500"
                        : "cursor-pointer hover:bg-green-600"
                    }`}
                    variant="outline"
                    size="sm"
                  >
                    Approve
                  </Button>

                  <Button
                    onClick={() =>
                      updateRequest(req.id!, { status: "Rejected" })
                    }
                    disabled={
                      req.status === "Approved" || req.status === "Approved"
                    }
                    className={`ml-2 text-white bg-red-600 
                    ${
                      req.status === "Approved"
                        ? "cursor-not-allowed opacity-50 hover:bg-red-600"
                        : "cursor-pointer hover:bg-red-700"
                    }`}
                    variant="outline"
                    size="sm"
                  >
                    Reject
                  </Button>
                </TableCell>
              ) : isValid.id === req.createdById ? (
                <TableCell>
                  <Button
                    onClick={() => deleteRequest(req.id!)}
                    variant="outline"
                    size="sm"
                    className="cursor-pointer text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              ) : (
                <TableCell></TableCell>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={isValid.isAdmin ? 6 : 5}
              className="text-center text-gray-500"
            >
              No requests found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
