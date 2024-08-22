"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { date, z } from "zod"
// import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormField from "./CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { Doctors } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { Status } from "@/types"
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import Success from "@/app/patients/[userId]/new-appointment/success/page"
import { Appointment } from "@/types/appwrite.types"



 

 
const AppointmentForm = ({
    userId , patientId , type  , appointment , setOpen
} : {
  userId: string,
  patientId: string,
  type: "create" | "cancel" | "schedule";
  appointment?: Appointment;
  setOpen?: (open:boolean) => void;
}) => {
  console.log("i m in Appointment Form");
  console.log("Received props:", { userId, patientId, type, appointment, setOpen });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const AppointmentFormValidation = getAppointmentSchema(type); 
  // 1. Define your form.
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : '' ,
      schedule: appointment ? new Date(appointment?.schedule) : new Date(Date.now()),
      reason: appointment ? appointment.reason : '',
      note: appointment ? appointment.note : '',
      cancellationReason: appointment?.cancellationReason || '',
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values : z.infer<typeof AppointmentFormValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // const testUserId = "66c230280023b4abd82e"; 

    let status;
    switch(type){
        case "schedule":
            status = "scheduled"
            break;
        case "cancel":
            status = "cancelled"
            break;
        default:
            status = "pending"
            
    }
    setIsLoading(true);
    console.log("hiiii , inside onsubmit");
    console.log({values});
    console.log(type);
    console.log({status});
    console.log({patientId});
    try{
        if(type === "create" && patientId ){
            console.log("pat id generated");
            const appointmentData = {
                // userId: testUserId,
                // userId: user.$id,
                userId,
                patient: patientId,
                primaryPhysician: values.primaryPhysician,
                schedule: new Date(values.schedule),
                reason: values.reason!,
                note: values.note,
                status: status as Status,
            }
            console.log({appointmentData});
            const appointment = await createAppointment(appointmentData);
            console.log({appointment});
            console.log({appointmentId: appointment?.$id});

            if(appointment){
                form.reset();
                router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
            }
        }
        else{
          const appointmentToUpdate = {
            userId,
            appointmentId: appointment?.$id!,
            appointment: {
              primaryPhysician: values.primaryPhysician,
              schedule: new Date(values.schedule),
              status: status as Status,
              cancellationReason: values.cancellationReason,
            },
              type,
          };
          
          const updatedAppointment = await updateAppointment(appointmentToUpdate);
          if(updatedAppointment) {
            setOpen && setOpen(false);
            form.reset();
          }
        }
    }

    catch(error){
      console.error(error);
    }
    setIsLoading(false);
  };

  let buttonLabel;

  switch(type) { 
    case "cancel" :
        buttonLabel = "Cancel Appointment"
        break;
    case "create" :
        buttonLabel = "Create Appointment"
        break;
    case "schedule" :
        buttonLabel = "Schedule Appointment"
        break;
    default:
        break;
  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
    {type === 'create' && (
      <section className="mb-12 space-y-4">
        <h1 className="header">New Appointment </h1>
        <p className="text-dark-700">Request a new appointment in 10 seconds.</p>

      </section>
     )}

      {type !== "cancel" && (
        <>
        <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={form.control}
        name="primaryPhysician"
        label="Doctor"
        placeholder="Select a doctor"
      >
        {Doctors.map((doctor, i) => (
          <SelectItem key={doctor.name + i} value={doctor.name}>
            <div className="flex cursor-pointer items-center gap-2">
              <Image
                src={doctor.image}
                width={32}
                height={32}
                alt="doctor"
                className="rounded-full border border-dark-500"
              />
              <p>{doctor.name}</p>
            </div>
          </SelectItem>
        ))}
      </CustomFormField>

      

      <CustomFormField 
        fieldType={FormFieldType.DATE_PICKER}
        control={form.control}
        name="schedule"
        label="Expected Appointment Date"
        showTimeSelect
        dateFormat="MM/dd/yyyy - hh:mm aa"
      />

      <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField 
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="reason"
        label="Reason for Appointment"
        placeholder="Enter reason for appointment"
      />

      <CustomFormField 
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="note"
        label="Notes"
        placeholder= "Enter notes"
      />
      </div>
      </>
      )
}

      {type === "cancel" && (
        <CustomFormField 
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="cancellationReason"
        label="Reason for Cancellation"
        placeholder= "Enter reason for cancellation"
    />
      )}
      {/* <Button type="submit">Submit</Button> */}
      <SubmitButton isLoading = {isLoading}
      className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}>{buttonLabel}</SubmitButton>
    </form>
  </Form>
  )
}

export default AppointmentForm;