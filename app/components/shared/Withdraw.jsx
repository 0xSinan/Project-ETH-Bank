"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@radix-ui/react-label";
import { contractAbi, contractAddress } from "@/constants";
import { parseEther } from "viem";

import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

const Withdraw = ({ onWithdrawSuccess }) => {
  const { toast } = useToast();

  const [withdrawAmount, setWithdrawAmount] = useState(null);
  const { data: hash, isPending, error, writeContract } = useWriteContract();

  const withdraw = async () => {
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "withdraw",
      args: [parseEther(withdrawAmount)],
    });
  };

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isLoading) {
      toast({
        title: "Pending Withdraw",
        description: `Transaction hash : ${hash} ETH `,
      });
    }
    if (isSuccess && onWithdrawSuccess) {
      toast({
        title: "Withdraw Successful",
        description: `You successfully withdrawed ${withdrawAmount} ETH `,
      });
      onWithdrawSuccess();
    }
  }, [isLoading, isSuccess]);

  return (
    <div className="space-y-2">
      <Label htmlFor="withdraw">Withdraw ETH</Label>
      <div className="flex gap-2">
        <Input
          id="withdraw"
          placeholder="Amount to withdraw"
          onChange={(e) => setWithdrawAmount(e.target.value)}
          className="flex-1"
        />
        <Button
          disabled={isLoading}
          onClick={withdraw}
          className="min-w-[100px]"
        >
          {isLoading ? "Withdrawing" : "Withdraw"}
        </Button>
      </div>
    </div>
  );
};

export default Withdraw;
