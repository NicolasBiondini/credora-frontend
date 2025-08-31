// Note: SAMPLE_PROOF is not used in this mock implementation

export interface MockNote {
  id: number;
  borrower: string;
  creditor: string;
  principalAmount: string; // In USD
  advanceAmount: string; // In ETH (collateral)
  interestRate: string; // Annual percentage
  maturityDate: string; // ISO string
  createdAt: string; // ISO string
  status: "Active" | "Mature" | "Paid" | "Defaulted";
  txHash: string;
  noteTokenId?: string;
  currentValue?: string; // Current value in USD
  image: string; // Random image for display
}

// Mock storage key
const MOCK_NOTES_KEY = "credora_mock_notes";

// Generate random image for notes
const generateRandomImage = () => {
  const images = [
    "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=300&h=300&fit=crop",
  ];
  return images[Math.floor(Math.random() * images.length)];
};

// Note: calculateCurrentValue function removed as it's only needed for MyNotes display

// Mock contract functions for borrowing only
export const mockNoteIssuer = {
  // Simulate createNote function with real values
  createNote: async (
    amount: bigint,
    advanceAmount: bigint,
    creditorAddress: string,
    borrowerAddress: string,
    realPrincipalAmount?: number, // USD amount from slider
    realAdvanceAmount?: number, // ETH collateral amount
    realInterestRate?: number // Interest rate from credit score
  ): Promise<{ noteId: number; txHash: string }> => {
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate proof verification (always succeeds for demo)
    console.log("🔍 Verifying Groth16 proof...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("✅ Proof verified successfully");

    // Generate numeric ID
    const existingNotes = getMockNotes();
    const noteId = existingNotes.length + 1; // Simple incremental ID
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;

    // Use real values if provided, otherwise fallback to conversion
    const principalAmount = realPrincipalAmount || Number(amount) / 1e18;
    const advanceAmountEth = realAdvanceAmount || Number(advanceAmount) / 1e18;
    const interestRate = realInterestRate || 4.8;

    const newNote: MockNote = {
      id: noteId,
      borrower: borrowerAddress,
      creditor: creditorAddress,
      principalAmount: principalAmount.toString(),
      advanceAmount: advanceAmountEth.toString(),
      interestRate: interestRate.toString(),
      maturityDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
      createdAt: new Date().toISOString(),
      status: "Active",
      txHash,
      currentValue: principalAmount.toString(),
      image: generateRandomImage(),
    };

    // Save to localStorage
    existingNotes.push(newNote);
    localStorage.setItem(MOCK_NOTES_KEY, JSON.stringify(existingNotes));

    console.log("📝 Note created successfully:", newNote);

    return { noteId, txHash };
  },
};

// Helper function for borrowing
const getMockNotes = (): MockNote[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(MOCK_NOTES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Mock transaction status
export const mockTransactionStatus = {
  pending: "⏳ Transaction pending...",
  success: "✅ Transaction confirmed!",
  failed: "❌ Transaction failed",
};
