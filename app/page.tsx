"use client";
import Uploader from "@/components/uploader";
import { Toaster } from "@/components/toaster";
import MyProgress from "@/components/myprogress";
import { useState } from "react";

export default function Home() {
  const [pageData, setPageData] = useState(new Map());
  const handlePageDataUpdate = (updatedMap: Map<any, any>) => {
    setPageData(updatedMap);
  };
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <Toaster />
      <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        虚拟商品转换工具
      </h1>
      <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
        <Uploader onUpdateMap={handlePageDataUpdate} />
      </div>
      <MyProgress pageData={pageData} />
    </main>
  );
}
