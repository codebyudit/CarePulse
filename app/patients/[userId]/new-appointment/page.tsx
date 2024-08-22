'use client'
import { useState, useEffect } from "react";
import AppointmentForm from "@/components/forms/AppointmentForm";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import { getPatient } from "@/lib/actions/patient.actions";

const NewAppointment = ({ params: { userId } }: SearchParamProps) => {
  const [patient , setPatient] = useState<any>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!userId) {
        console.error("userId is undefined");
        return;
      }

      try {
        const patientData = await getPatient(userId);
        if (!patientData) {
          console.error("Patient not found");
        } else {
          setPatient(patientData);
          console.log("Fetched patient data:", patientData);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatient();
  }, [userId]);

  if (!userId) {
    return null;
  }

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient?.$id}
          />

          <p className="copyright mt-7 py-12">
            © 2024 CarePulse
          </p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default NewAppointment;
