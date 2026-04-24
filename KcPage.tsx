import React, { useContext } from 'react';
import { kcContext } from './kcContext';

const KcPage = () => {
  const { username, email } = useContext(kcContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold">User Information</h1>
      <div className="mt-4 p-4 border rounded shadow-lg bg-white">
        <p className="text-lg">
          <strong>Username:</strong> {username}
        </p>
        <p className="text-lg">
          <strong>Email:</strong> {email}
        </p>
      </div>
    </div>
  );
};

export default KcPage;