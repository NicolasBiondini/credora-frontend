"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Wallet,
  FileText,
  Calendar,
  TrendingUp,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

// Hardcoded notes array (simulating NFTs)
const userNotes = [
  {
    id: "1",
    title: "ETH Lending Note #001",
    amount: "2.5 ETH",
    apy: "15.3%",
    maturityDate: "2024-02-15",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=300&h=300&fit=crop",
  },
  {
    id: "2",
    title: "ETH Lending Note #002",
    amount: "1.8 ETH",
    apy: "15.3%",
    maturityDate: "2024-02-20",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=300&h=300&fit=crop",
  },
];

// Note Modal Component
const NoteModal = ({
  note,
  isOpen,
  onClose,
}: {
  note: (typeof userNotes)[0];
  isOpen: boolean;
  onClose: () => void;
}) => {
  // Don't render anything if modal is closed to prevent interference
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white border-2 border-gray-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {note.title}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Detailed information about your lending note
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Left side - Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl shadow-lg">
              <Image
                src={note.image}
                alt={note.title}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Status badge */}
            <div className="flex justify-center">
              <span
                className={`text-sm font-bold px-4 py-2 rounded-full shadow-lg ${
                  note.status === "Active"
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {note.status}
              </span>
            </div>
          </div>

          {/* Right side - Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm text-white font-bold">Ξ</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Principal Amount</p>
                  <p className="text-lg font-bold text-gray-900">
                    {note.amount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">
                    Annual Percentage Yield
                  </p>
                  <p className="text-lg font-bold text-green-600">{note.apy}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Maturity Date</p>
                  <p className="text-lg font-bold text-gray-900">
                    {note.maturityDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-4">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                <DollarSign className="w-4 h-4 mr-2" />
                Redeem Note
              </Button>

              <Button
                variant="outline"
                className="w-full border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-purple-700 font-semibold py-3 rounded-lg transition-all duration-300"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Transfer Note
              </Button>
            </div>

            {/* Additional info */}
            <div className="text-xs text-gray-500 space-y-1 pt-4 border-t border-gray-200">
              <p>• This note represents your active lending position</p>
              <p>• You can redeem or transfer this note at any time</p>
              <p>• Maturity date indicates when the note expires</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Note Card Component
const NoteCard = ({
  note,
  onClick,
}: {
  note: (typeof userNotes)[0];
  onClick: () => void;
}) => (
  <Card className="group w-full max-w-sm bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1">
    {/* Background decoration */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500"></div>
    <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full translate-y-6 -translate-x-6 group-hover:scale-110 transition-transform duration-500"></div>

    <div className="relative z-10">
      {/* Image with overlay */}
      <div className="aspect-square overflow-hidden relative">
        <Image
          src={note.image}
          alt={note.title}
          width={300}
          height={300}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Status badge overlay */}
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full shadow-lg ${
              note.status === "Active"
                ? "bg-green-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {note.status}
          </span>
        </div>
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Content */}
      <CardContent className="p-5">
        <div className="space-y-3">
          {/* Title */}
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {note.title}
          </h3>

          {/* Amount with ETH icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">Ξ</span>
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {note.amount}
              </span>
            </div>
            <span className="text-sm font-bold text-green-600">{note.apy}</span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={onClick}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  </Card>
);

// Placeholder Component for Not Connected
const NotConnectedPlaceholder = () => (
  <div className="w-full max-w-4xl mx-auto mt-8">
    <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-200 shadow-lg">
      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center mx-auto mb-6">
        <Wallet className="w-8 h-8 text-white" />
      </div>
      <p className="text-lg text-gray-700 font-medium mb-6">
        Connect your wallet to view your notes
      </p>
      <ConnectButton.Custom>
        {({ openConnectModal, mounted }) => {
          if (!mounted) return null;

          return (
            <Button
              onClick={openConnectModal}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet
            </Button>
          );
        }}
      </ConnectButton.Custom>
    </div>
  </div>
);

// Placeholder Component for No Notes
const NoNotesPlaceholder = () => (
  <div className="w-full max-w-4xl mx-auto mt-8">
    <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-200 shadow-lg">
      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center mx-auto mb-6">
        <FileText className="w-8 h-8 text-white" />
      </div>
      <p className="text-lg text-gray-700 font-medium">
        You don&apos;t have any notes yet
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Start lending to create your first note
      </p>
    </div>
  </div>
);

export default function MyNotes() {
  const [mounted, setMounted] = useState(false);
  const [selectedNote, setSelectedNote] = useState<
    (typeof userNotes)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNoteClick = (note: (typeof userNotes)[0]) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  if (!mounted) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="w-full h-[400px] bg-muted rounded-[20px] animate-pulse" />
      </div>
    );
  }

  // If not connected, show connect placeholder
  if (!isConnected) {
    return <NotConnectedPlaceholder />;
  }

  // If connected but no notes, show empty state
  if (userNotes.length === 0) {
    return <NoNotesPlaceholder />;
  }

  // If connected and has notes, show notes grid
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
        My Notes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {userNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={() => handleNoteClick(note)}
          />
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Your lending notes represent your active positions in the protocol.
        </p>
        <p className="mt-1">
          Each note is an NFT that can be traded or redeemed.
        </p>
      </div>

      {/* Note Modal */}
      {isModalOpen && selectedNote && (
        <NoteModal
          note={selectedNote}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
