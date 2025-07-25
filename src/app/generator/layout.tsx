import React from 'react';

export default function GeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-12">
      {children}
    </div>
  );
}
