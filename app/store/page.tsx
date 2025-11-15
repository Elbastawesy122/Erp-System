import Store from "@/components/Store/Store";
import { verifyToken } from "@/lib/verificationtoken";
import { cookies } from "next/headers";

const store = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <div
        className="
        flex flex-col items-center justify-center 
        bg-gray-50 border border-gray-200 rounded-2xl 
        shadow-sm p-6 sm:p-8 text-center mt-10
        max-w-md mx-auto
        animate-fade-in absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
      "
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-5 text-sm sm:text-base">
          You are not logged in. Please login to access this page.
        </p>
        <a
          href="/user/login"
          className="
          px-6 py-3 bg-blue-600 text-white font-medium 
          rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg 
          transition-all duration-200 active:scale-95
        "
        >
          Go to Login
        </a>
      </div>
    );
  }

  const isValid = verifyToken(token);
  if (!isValid) {
    console.error("Invalid token");
    return;
  }

  return <Store isValid={isValid} />;
};

export default store;
