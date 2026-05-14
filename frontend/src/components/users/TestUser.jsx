import { useState } from "react";

const TestUser = () => {
  const [response, setResponse] = useState(null);
  const handleTestButton = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL_USERS}/prueba`, {
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    if (data?.error) {
      setResponse(data.error?.message);
    } else {
      setResponse(data.welcomeMessage);
    }

    /* const response = await fetch(`${import.meta.env.VITE_API_URL_USERS}/prueba`, {
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.text();
    setResponse(data); */
  };

  return (
    <div className="w-full flex bg-gray-700 p-4 rounded-md flex-col items-center gap-4">
      <button
        type="button"
        className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded"
        onClick={handleTestButton}
      >
        Test User
      </button>
      {response && <p>{response}</p>}
    </div>
  );
};

export default TestUser;
