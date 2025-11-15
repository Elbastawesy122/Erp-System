import { isValid } from "@/lib/interface";
import SalesChart from "../achievements/AchievementsChart";
import CircularProgress from "./RadialBarChart";

const Achievements = ({ isValid }: { isValid: isValid }) => {
  return (
    <>
      {!isValid.isAdmin ? (
        <section className="h-full w-full flex flex-col items-center gap-6">
          <SalesChart />
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6">
            <CircularProgress />
            <h3 className="w-full text-center text-2xl md:text-3xl font-semibold text-gray-400">
              {"Keep striving! You’re getting closer to your target every day!"}
            </h3>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl font-semibold mb-3 text-center">
            Sorry, you do not have permission to access this page.
          </h2>
          <p className=" mb-5 text-sm sm:text-base">
            Please contact your administrator if you believe this is an error.
          </p>
        </div>
      )}
    </>
  );
};

export default Achievements;
