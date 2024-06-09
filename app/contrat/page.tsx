'use client';
import React from 'react';
import PDFContrat from '@/components/PDFContrat';


const Page = () => {
  return (
    <div className="container mx-auto mt-20 p-4">
      <h1 className="text-2xl font-bold mb-4">View and Download PDF</h1>
      <div style={{ height: '297mm', width: '210mm' }}>
        <PDFContrat />
      </div>
    </div>
  );
};

export default Page;