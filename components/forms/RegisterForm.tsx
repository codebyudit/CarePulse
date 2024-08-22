"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "./CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import {  PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { User } from "@/types"
import { FormFieldType } from "./PatientForm"
// import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
// import { Label } from "@radix-ui/react-label"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import Image from "next/image"
import { SelectItem } from "../ui/select"
import FileUploader from "../FileUploader"

 

 
const RegisterForm = ({user} : {user : User}) => {
  console.log(user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {

      console.log("i am reg form component");
    // const testUserId = "66c230280023b4abd82e"; // Replace with an actual ID

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    let formData;
    if(values.identificationDocument && values.identificationDocument?.length > 0){
      const blobFile = new Blob([values.identificationDocument[0]], { type: values.identificationDocument[0].type, });

      formData = new FormData();
      formData.append('blobfile' , blobFile);
      formData.append('fileName' , values.identificationDocument[0].name);
    }
    try{
      console.log("wii");
      console.log({values});
      console.log({user});
      console.log(user.$id);
      const patientData = {
        ...values,
        userId : user.$id,
        birthDate : new Date(values.birthDate),
        identificationDocument : formData,
        //  userId: testUserId,
        

        // userId: user.$id,
        // name: values.name,
        // email: values.email,
        // phone: values.phone,
        // birthDate: new Date(values.birthDate),
        // gender: values.gender,
        // address: values.address,
        // occupation: values.occupation,
        // emergencyContactName: values.emergencyContactName,
        // emergencyContactNumber: values.emergencyContactNumber,
        // primaryPhysician: values.primaryPhysician,
        // insuranceProvider: values.insuranceProvider,
        // insurancePolicyNumber: values.insurancePolicyNumber,
        // allergies: values.allergies,
        // currentMedication: values.currentMedication,
        // familyMedicalHistory: values.familyMedicalHistory,
        // pastMedicalHistory: values.pastMedicalHistory,
        // identificationType: values.identificationType,
        // identificationNumber: values.identificationNumber,
        // identificationDocument: values.identificationDocument
        //   ? formData
        //   : undefined,
        // privacyConsent: values.privacyConsent,
         
      }
      
      const patient =  await registerPatient(patientData);
      console.log("Generated patientId:", patient.$id);
       router.push(`/patients/${user.$id}/new-appointment`);
      
    }
    catch(error){
      console.error(error);
    }
    
      setIsLoading(false);
    
  }

  

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className=" space-y-4">
          <h1 className="header">Welcome 👋 </h1>
          <p className="text-dark-700"> Let us know more about yourself. </p>
        </section>

        <section className=" space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header"> Personal Information</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Jon Snow"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="jonsnow@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone Number"
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date Of Birth"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="14 , NYC"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Guardian's Name"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            placeholder="(555) 123-4567"
          />
        </div>

        <section className=" space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select a Physician"
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

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="BlueCross BlueShield"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="ABC1234567"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanuts, Pollen, etc."
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current Medication (if any)"
            placeholder="Aspirin, Tylenol, etc."
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family Medical History"
            placeholder="ex : Mother had brain cancer"
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past Medical History"
            placeholder="ex: Asthma in childhood"
          />
        </div>

        <section className=" space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification & Verification</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification Type"
          placeholder="Select an identification type"
        >
          {IdentificationTypes.map((type, i) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Identification Number"
          placeholder="123456789"
        />

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Scanned Copy of Identification Document"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <section className=" space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent & Privacy</h2>
          </div>
        </section>
        
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name= "treatmentConsent"
          label="I consent to receive treatment for my health condition."
          />


        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name= "disclosureConsent"
          label="I consent to the use and disclosure of my health
            information for treatment purposes."
          />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name= "privacyConsent"
          label="I acknowledge that I have reviewed and agree to the
            privacy policy"
          />
        {/* <Button type="submit">Submit</Button> */}
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
}

export default RegisterForm