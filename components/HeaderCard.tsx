"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, ClipboardList, Shield } from "lucide-react";

function HeaderCard() {
  const messages = [
    {
      title: "Lend and generate amazing APY",
      subtitle: "Secure Investments",
      titleIcon: <TrendingUp className="w-6 h-6" />,
      description:
        "Lend your money to generate great APY. Our system ensures you never lose money thanks to our advanced security measures and integrated guarantees.",
      buttonText: "Start Lending",
      action: "lending",
    },
    {
      title: "Borrow securely and safely!",
      subtitle: "Decentralized Lending",
      titleIcon: <DollarSign className="w-6 h-6" />,
      description:
        "If you want to borrow, you can get decentralized credit through our scoring system. Get the funds you need with the best market conditions.",
      buttonText: "Apply for Loan",
      action: "borrowing",
    },
    {
      title: "Manage your credit notes",
      subtitle: "Transfers & Payments",
      titleIcon: <ClipboardList className="w-6 h-6" />,
      description:
        "Check your notes and transfer them as payments with interest. Manage your investments and payments efficiently with our digital notes system.",
      buttonText: "View My Notes",
      action: "myNotes",
    },
    {
      title: "Justice and security guaranteed",
      subtitle: "ZK Commitment",
      titleIcon: <Shield className="w-6 h-6" />,
      description:
        "Our commitment is to bring justice and distribute loans securely between parties, verifying with ZK and ensuring all parties are protected.",
      buttonText: "Learn More",
      action: "/about",
    },
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 8000); // Cambia cada 8 segundos

    return () => clearInterval(interval);
  }, [messages.length]);

  const currentMessage = messages[currentMessageIndex];

  return (
    <Card className="w-full relative overflow-hidden bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-3xl">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-400/8 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-400/8 to-transparent rounded-full translate-y-8 -translate-x-8"></div>

      <div className="relative z-10 p-6">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center text-white">
              {currentMessage.titleIcon}
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                {currentMessage.title}
              </CardTitle>
              <p className="text-sm text-gray-600 font-medium">
                {currentMessage.subtitle}
              </p>
            </div>
          </div>

          <CardDescription className="text-sm leading-relaxed text-gray-700 max-w-3xl">
            {currentMessage.description}
          </CardDescription>
        </CardHeader>

        {/* Indicadores del carrusel - centrados en el medio */}
        <div className="flex justify-center py-4">
          <div className="flex gap-4">
            {messages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMessageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentMessageIndex
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to message ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <CardFooter className="pt-0">
          {/* Espacio vacío para mantener la estructura */}
        </CardFooter>
      </div>
    </Card>
  );
}

export default HeaderCard;
