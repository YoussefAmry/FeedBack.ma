import { Link } from "react-router-dom";

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Merci pour votre avis !</h2>
        <Link to="/" className="text-blue-600 hover:underline">Retour</Link>
      </div>
    </div>
  );
} 