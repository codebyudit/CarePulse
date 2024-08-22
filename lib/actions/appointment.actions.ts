"use server"

import { ID, Query } from "node-appwrite"
import { BUCKET_ID, databases, ENDPOINT, NEXT_PUBLIC_DATABASE_ID, NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID, NEXT_PUBLIC_PROJECT_ID, messaging } from "../appwrite.config"
import { formatDateTime, parseStringify } from "../utils"
import { CreateAppointmentParams, UpdateAppointmentParams } from "@/types"
import { PersonStanding } from "lucide-react"
import { Appointment } from "@/types/appwrite.types"
import { revalidatePath } from "next/cache"

export const createAppointment = async (appointment: CreateAppointmentParams) =>{
    try{
        const newAppointment  =  await databases.createDocument(
            NEXT_PUBLIC_DATABASE_ID!,
            NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        )
        revalidatePath("/admin");
        return parseStringify(newAppointment);
    }
    catch(error){
        console.error(error)
    }
}

export const getAppointment = async (appointmentId: string) =>{

    try{
        const appointment = await databases.getDocument(
            NEXT_PUBLIC_DATABASE_ID!,
            NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!,
            appointmentId,
        )
        return parseStringify(appointment);
    }
    catch(error){
        console.error(error)
    }
}

//to fetch data of appointments automatically
export  const getRecentAppointmentList = async () => {
    try{
        const appointments = await databases.listDocuments(
            NEXT_PUBLIC_DATABASE_ID!,
            NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc("$createdAt")]
        );

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        }
        const counts = (appointments.documents as Appointment[]).reduce((acc , appointment) => {
            if(appointment.status === "scheduled"){
                acc.scheduledCount += 1;
            }
            else if(appointment.status === "pending"){
                acc.pendingCount += 1;
            }
            else if(appointment.status === "cancelled"){
                acc.cancelledCount += 1;
            }
            return acc;
        }, initialCounts);

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }

        return parseStringify(data);
    }
    
    catch(error){
        console.error(error)
    }
}

export const updateAppointment = async ({appointmentId , userId , timeZone , appointment , type} : UpdateAppointmentParams) =>{
 try{
    const updatedAppointment = await databases.updateDocument(
        NEXT_PUBLIC_DATABASE_ID!,
        NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!,
        appointmentId,
        appointment
    )

    if(!updatedAppointment){
         throw new Error("Appointment not found " );
    }

    const smsMessage = `Hi , it's CarePulse.
    
    ${type === 'schedule' ? `Your appointment has been scheduled for ${formatDateTime(appointment.schedule!, timeZone).dateTime} 
        with Dr. ${appointment.primaryPhysician}.` : `We regret to inform you that your appointment
         has been cancelled for the following reason: ${ appointment.cancellationReason }`}`;

    await sendSMSNotification(userId , smsMessage);
    

    revalidatePath('/admin')
    return parseStringify(updatedAppointment);
 }
 
 catch(error){
     console.error(error)
 }

}

export const sendSMSNotification = async (userId: string, content: string) => {
    try{
        console.log("message in");
        const message = await messaging.createSms(
            
            ID.unique(),
            content,
            [],
            [userId]
        )
        return parseStringify(message);
    }
    catch(error){
        console.error(error)
    }
}