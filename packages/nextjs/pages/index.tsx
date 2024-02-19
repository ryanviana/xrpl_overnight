// login.tsx
import React from "react";
import { useRouter } from "next/router";
import { ConnectButton } from "@particle-network/connect-react-ui";
import "@particle-network/connect-react-ui/dist/index.css";

// The Login component for user authentication
const Login: React.FC = () => {
  const router = useRouter();

  // Handler for form submission
  const handleSubmit = async () => {
    router.push("/home-screen");
  };

  return (
    <div className="flex flex-col h-screen bg-base-200">
      <div className="grid place-items-center mx-2 my-20 sm:my-auto">
        <h2 className="text-center my-6 font-semibold text-3xl text-gray-800">Sign in to Avalanche Overnight</h2>

        <div className="flex flex-col items-center">
          <span onClick={handleSubmit}>
            {" "}
            <ConnectButton />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
