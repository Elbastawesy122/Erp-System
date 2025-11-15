import Image from "next/image";
import image from "../app/favicon.ico";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

const Home = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
  
    if (token) {
      redirect("/dashboard");
    }
  return (
    <section className=" relative w-full h-full">
      <div className=" w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <Image
          src={image}
          alt=""
          width={200}
          height={200}
          className="rounded"
        />
        <h2 className="m-5 font-bold text-lg md:text-3xl text-[#c3c1c1]">Welcome to the ERP System</h2>
        <Link href="/user/login">
          <Button className="text-2xl py-6 px-10 cursor-pointer bg-black text-white">Start Now</Button>
        </Link>
      </div>
    </section>
  );
};

export default Home;
