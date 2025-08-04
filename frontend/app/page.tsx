"use client";

import OCRForm from "@/components/OCRForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {

  return (
    <div className="flex w-full flex-col justify-center items-center gap-6 my-[10vh]">
      <Tabs defaultValue="points">
         <TabsList>
           <TabsTrigger value="points">Points </TabsTrigger>
            <TabsTrigger value="curves">Curves</TabsTrigger>
            <TabsTrigger value="spots">Spots</TabsTrigger>
            <TabsTrigger value="volatility">Volatility</TabsTrigger>
            <TabsTrigger value="inflation">Inflation</TabsTrigger>
            <TabsTrigger value="seasonality">Seasonality</TabsTrigger>
         </TabsList>
        <TabsContent value="points"><OCRForm type="points" /></TabsContent>
        <TabsContent value="curves"><OCRForm type="curves" /></TabsContent>
        <TabsContent value="spots"><OCRForm type="spots" /></TabsContent>
        <TabsContent value="volatility"><OCRForm type="volatility" /></TabsContent>
        <TabsContent value="inflation"><OCRForm type="inflation" /></TabsContent>
        <TabsContent value="seasonality"><OCRForm type="seasonality" /></TabsContent>
      </Tabs>
    </div>
  );
}
