import React from 'react';
import Image from 'next/image';
import { redirect } from "next/navigation";
// import Link  from "next/link";
import RegisterForm from '@/components/forms/RegisterForm';
import { SearchParamProps } from '@/types';
import { getPatient, getUser } from '@/lib/actions/patient.actions';



const Register = async ({params : {userId}} : SearchParamProps) => {
  console.log("register func in :" , userId);
    const user = await getUser(userId);
    console.log(userId);
    
    const patient = await getPatient(userId);
    // console.log(patientId);
    if (patient) redirect(`/patients/${userId}/new-appointment`);
  return (
    <div className="flex h-screen max-h-screen">
    <section className="remove-scrollbar container ">
      <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
        <Image
          src="/assets/icons/logo-full.svg"
          height={1000}
          width={1000}
          alt="patient"
          className="mb-12 h-10 w-fit"
        />

        <RegisterForm user = {user} />
          <p className="copyright py-12">
            © 2024 CarePulse
          </p>
        
      </div>
    </section>

    <Image 
      src="/assets/images/register-img.png"
      height={1000}
      width={1000}
      alt="patient"
      className="side-img max-w-[390px]"
    />
   </div>
  );
};

export default Register;
