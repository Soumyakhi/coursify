import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";

export default function CustomAlert({ type = "error", message, onClose }) {
  if (!message) return null;

  const typeStyles = {
    success: "bg-green-100 text-green-700 border-green-400",
    error: "bg-red-100 text-red-700 border-red-400",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-400",
    info: "bg-blue-100 text-blue-700 border-blue-400",
  };

  const icons = {
    success: <FaCheckCircle />,
    error: <FaExclamationCircle />,
    warning: <FaInfoCircle />,
    info: <FaInfoCircle />,
  };

  return (
    <div
      className={`flex items-center justify-between border px-5 py-2 rounded-md mb-4 ${typeStyles[type]}`}
    >
      <div className="flex items-center gap-2 text-sm">
        {icons[type]}
        <span>{message}</span>
      </div>
    </div>
  );
}