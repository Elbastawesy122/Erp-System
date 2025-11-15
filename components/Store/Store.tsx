import { isValid } from "@/lib/interface";
import Products from "./Products";

const Store = ({ isValid }: { isValid: isValid }) => {
  return (
    <>
      <section className="m-4 sm:m-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Product Management</h1>
          <p className="mt-1 text-sm sm:text-base">
            {" "}
            Manage, update, and organize all products available in your store.
          </p>
        </div>
        <Products isValid={isValid}/>
      </section>
    </>
  );
};

export default Store;
