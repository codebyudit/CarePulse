'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions';
import { DataTable } from '@/components/table/DataTable';
import { columns } from '@/components/table/columns';
import { Appointment } from '@/types/appwrite.types';


const Admin = () => {
  const [appointments, setAppointments] = useState<{
    scheduledCount: number;
    pendingCount: number;
    cancelledCount: number;
    documents: Appointment[];
  } | null>(null);
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentData = await getRecentAppointmentList();
        setAppointments(appointmentData);
      } catch (err) {
        setError('Failed to load appointments. Please try again later.');
      }
    };

    fetchAppointments();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!appointments) {
    return  (  
    <div className="flex justify-center items-center h-screen">
    <div className="flex items-center space-x-5">
    <div className="w-8 h-8 border-4 border-t-blue-500 border-r-green-500 border-b-red-500 border-l-yellow-500 rounded-full animate-spin"></div>
      <span className="text-gray-50 text-xl  font-medium">Loading...</span>
    </div>
  </div>
    )
  }

  return (
    <div className='flex flex-col space-y-14 mx-auto max-w-7xl'>
      <header className='admin-header'>
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>
        <p className='text-16-semibold'>
          Admin Dashboard
        </p>
      </header>

      <main className='admin-main'>
        <section className='w-full space-y-4'>
          <h1 className='header'>Welcome, 👋</h1>
          <p className='text-dark-700'>Start the day with managing new appointments.</p>
        </section>

        <section className='admin-stat'>
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Scheduled appointments"
            icon="/assets/icons/appointments.svg"
          />

          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"
          />

          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

        <DataTable columns={columns} data={appointments.documents} />
      </main>
    </div>
  );
};

export default Admin;
