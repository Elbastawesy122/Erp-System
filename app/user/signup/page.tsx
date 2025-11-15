import { SignupForm } from "@/components/Signup-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const signup = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    redirect("/");
  }
  return <SignupForm />;
};

export default signup;
