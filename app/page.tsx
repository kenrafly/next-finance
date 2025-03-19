"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // ✅ Dynamic Import to avoid SSR issues
import Footer from "@/app/components/Footer";
import Image from "next/image";

// ✅ Dynamically import Lottie to run only on the client
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Home = () => {
  const [animationData, setAnimationData] = useState<any>(null);
  const [animationData2, setAnimationData2] = useState<any>(null);
  const [animationData3, setAnimationData3] = useState<any>(null);

  useEffect(() => {
    import("@/public/animation.json").then((data) =>
      setAnimationData(data.default)
    );
    import("@/public/animation2.json").then((data) =>
      setAnimationData2(data.default)
    );
    import("@/public/animation3.json").then((data) =>
      setAnimationData3(data.default)
    );
  }, []);

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Hero Section */}
      <div className="flex items-center px-20 py-10 mx-auto">
        <div className="flex flex-col gap-8 flex-1">
          <h1 className="text-5xl font-bold">
            Take Control of Your Finances Today
          </h1>
          <p>
            Our financial tracker app empowers you to manage your money
            effortlessly. With intuitive features and real-time insights,
            achieving your financial goals has never been easier.
          </p>
          <button className="relative flex h-10 w-40 items-center justify-center overflow-hidden bg-gray-800 text-white shadow-2xl transition-all hover:shadow-cyan-400 rounded-lg cursor-pointer">
            <span className="relative z-10">Join now</span>
          </button>
        </div>
        <div className="flex-1 justify-center hidden md:flex">
          <Image
            src="/business.svg"
            alt="Hero Image"
            width={500}
            height={500}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="flex items-center px-20 py-10 mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 flex-1">
          <h1 className="text-3xl font-bold text-center w-3/4">
            Unlock Your Financial Potential with Our Comprehensive Feature Set
          </h1>
          <div className="flex gap-8 flex-wrap md:flex-nowrap">
            {/* Feature 1 */}
            <div className="flex items-center justify-center flex-col gap-4">
              {animationData ? (
                <Lottie className="w-56 h-56" animationData={animationData} />
              ) : (
                <p>Loading animation...</p>
              )}
              <h2 className="text-2xl font-bold">
                Take Control of Your Finances
              </h2>
              <p>
                Our app offers robust budget planning features to help you
                manage your money effectively.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center justify-center flex-col gap-4">
              {animationData2 ? (
                <Lottie className="w-56 h-56" animationData={animationData2} />
              ) : (
                <p>Loading animation...</p>
              )}
              <h2 className="text-2xl font-bold">Categorize Your Expenses</h2>
              <p>
                Easily set financial goals and track your progress towards
                achieving them.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center justify-center flex-col gap-4">
              {animationData3 ? (
                <Lottie className="w-56 h-56" animationData={animationData3} />
              ) : (
                <p>Loading animation...</p>
              )}
              <h2 className="text-2xl font-bold">
                Achieve Your Financial Goals
              </h2>
              <p>
                Our expense categorization feature provides clarity on your
                spending habits.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
