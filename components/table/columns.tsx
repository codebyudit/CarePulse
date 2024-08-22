"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import StatusBadge from "../StatusBadge";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import { Doctors } from "@/constants";
import AppointmentModal from "../AppointmentModal";
import { Appointment } from "@/types/appwrite.types";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;
      const patientName = appointment.patient?.name || "Unknown Patient";
      return <p className="text-14-medium">{patientName}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={row.original.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const formattedDate = formatDateTime(row.original.schedule)?.dateTime || "Unknown Date";
      return <p className="text-14-regular min-w-[100px]">{formattedDate}</p>;
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = Doctors.find((doc) => doc.name === row.original.primaryPhysician);
      return (
        <div className="flex items-center gap-3">
          {doctor ? (
            <>
              <Image
                src={doctor.image}
                alt="doctor"
                width={32}
                height={32}
                className="size-8"
              />
              <p className="whitespace-nowrap">Dr. {doctor.name}</p>
            </>
          ) : (
            <p className="whitespace-nowrap">Unknown Doctor</p>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex gap-1">
          <AppointmentModal
            type="schedule"
            patientId={data.patient?.$id}
            userId={data.userId}
            appointment={data}
          />
          <AppointmentModal
            type="cancel"
            patientId={data.patient?.$id}
            userId={data.userId}
            appointment={data}
          />
        </div>
      );
    },
  },
];
