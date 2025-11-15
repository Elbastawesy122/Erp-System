import Link from "next/link";
import React from "react";

const notfound = () => {
  return (
    <>
      <div className="flex justify-center items-center">
          <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-9xl font-extrabold text-gray-600 tracking-widest">
              404
            </h1>
            <div className="bg-gray-200 text-gray-600 px-2 text-lg rounded rotate-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md w-full text-center">
              Page Not Found
            </div>
          </div>
        <Link
          href="/"
          className="absolute bottom-5"
        >
          Go Back Home
        </Link>
      </div>
    </>
  );
};

export default notfound;
