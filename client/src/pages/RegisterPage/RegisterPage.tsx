import { RegisterUserProvider } from "../../context/RegisterUserContext";
import RegisterUserForm from "./RegisterUserForm";

const RegisterPage = () => {
  return (
    <RegisterUserProvider>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <RegisterUserForm />
    </div>
    </RegisterUserProvider>
  );
};

export default RegisterPage;
