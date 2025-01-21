import { contractAbi, contractAddress } from "@/constants";
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatEther } from "viem";

const getBalance = () => {
  const { address } = useAccount();
  const [userBalance, setUserBalance] = useState(null);

  const {
    data: balanceGet,
    isPending,
    error,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getBalance",
    accout: [address],
  });

  useEffect(() => {
    if (address) {
      const refetchBalance = async () => {
        await refetch();
        setUserBalance(balanceGet);
      };
      refetchBalance();
    }
  }, [balanceGet, refetch]);

  return (
    <div className="bg-secondary/20 p-4 rounded-lg">
      <p className="text-xl font-semibold text-center">
        Current Balance: {balanceGet ? formatEther(userBalance) : "0"} ETH
      </p>
    </div>
  );
};

export default getBalance;
