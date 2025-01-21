"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { contractAbi, contractAddress } from "@/constants";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";

const Deposit = ({ onDepositSuccess }) => {
  const { toast } = useToast();

  const [depositAmount, setDepositAmount] = useState(null);
  const { data: hash, isPending, error, writeContract } = useWriteContract();

  const deposit = async () => {
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "deposit",
      value: parseEther(depositAmount),
    });
  };

  const { isLoading, isSucess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isLoading) {
      toast({
        title: "Pending Deposit",
        description: `Transaction hash : ${hash} ETH `,
      });

      if (isSucess && onDepositSuccess) {
        toast({
          title: "Deposit Successful",
          description: `You successfully deposited ${depositAmount} ETH `,
        });
        onDepositSuccess();
      }
    }
  }, [isLoading, isSucess]);

  return (
    <div className="space-y-2">
      <Label htmlFor="deposit">Deposit ETH</Label>
      <div className="flex gap-2">
        <Input
          id="deposit"
          placeholder="Amount to deposit"
          onChange={(e) => setDepositAmount(e.target.value)}
          className="flex-1"
        />
        <Button
          disabled={isLoading}
          onClick={deposit}
          className="min-w-[100px]"
        >
          {isLoading ? "Depositing" : "Deposit"}
        </Button>
      </div>
    </div>
  );
};

export default Deposit;
