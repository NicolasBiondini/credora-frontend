"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Lending from "@/components/pages/Lending";
import Borrowing from "@/components/pages/Borrowing";
import MyNotes from "@/components/pages/MyNotes";
import Profile from "@/components/pages/Profile";
import HeaderCard from "./HeaderCard";
import { useState, useEffect } from "react";

// Easy component mapping for future changes
const TAB_COMPONENTS = {
  lending: Lending,
  borrowing: Borrowing,
  myNotes: MyNotes,
  profile: Profile,
} as const;

export default function TabsContainer() {
  const [activeTab, setActiveTab] = useState("lending");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && Object.keys(TAB_COMPONENTS).includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);
  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-gray-100/80 p-1 text-gray-600 shadow-sm border border-gray-200/50">
            <TabsTrigger
              value="lending"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm hover:data-[state=active]:bg-gray-50"
            >
              Lending
            </TabsTrigger>
            <TabsTrigger
              value="borrowing"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm hover:data-[state=active]:bg-gray-50"
            >
              Borrowing
            </TabsTrigger>
            <TabsTrigger
              value="myNotes"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm hover:data-[state=active]:bg-gray-50"
            >
              My Notes
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm hover:data-[state=active]:bg-gray-50"
            >
              Profile
            </TabsTrigger>
          </TabsList>
        </div>

        <HeaderCard />

        <TabsContent value="lending" className="mt-0">
          <Lending />
        </TabsContent>

        <TabsContent value="borrowing" className="mt-0">
          <Borrowing />
        </TabsContent>

        <TabsContent value="myNotes" className="mt-0">
          <MyNotes />
        </TabsContent>

        <TabsContent value="profile" className="mt-0">
          <Profile />
        </TabsContent>
      </Tabs>
    </div>
  );
}
