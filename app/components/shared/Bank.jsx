"use client";

import { useAccount } from "wagmi";
import { formatEther, parseAbiItem } from "viem";
import { publicClient } from "@/lib/client";
import { useEffect, useState } from "react";
import { contractAddress } from "@/constants";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import GetBalance from "./GetBalance";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";

const Bank = () => {
  const { address } = useAccount();
  const [depositsEvents, setDepositsEvents] = useState([]);
  const [withdrawsEvents, setWithdrawsLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const refetchEverything = async () => {
    await refetch();
    depositEvents();
  };

  const depositEvents = async () => {
    const depositLogs = await publicClient.getLogs({
      address: contractAddress,
      event: parseAbiItem(
        "event Deposit(address indexed _from, uint256 _value)"
      ),
      fromBlock: 0n,
      toBlock: "latest",
    });

    setDepositsEvents(
      depositLogs.map((log) => ({
        from: log.args._from,
        value: log.args._value,
      }))
    );
  };

  const withdrawEvents = async () => {
    const withdrawLogs = await publicClient.getLogs({
      address: contractAddress,
      event: parseAbiItem(
        "event Withdraw(address indexed _from, uint256 _value)"
      ),
      fromBlock: 0n,
      toBlock: "latest",
    });

    setWithdrawsLogs(
      withdrawLogs.map((withdrawLog) => ({
        from: withdrawLog.args._from,
        value: withdrawLog.args._value,
      }))
    );
  };

  const refetchEvents = async () => {
    if (address) {
      await depositEvents();
      await withdrawEvents();
    }
  };

  useEffect(() => {
    refetchEvents();
  }, [address]);

  // Combine and sort events
  const combineAndSortEvents = () => {
    const allEvents = [
      ...depositsEvents.map((event) => ({
        ...event,
        type: "deposit",
        timestamp: Date.now(), // Ideally, you'd get this from the block timestamp
      })),
      ...withdrawsEvents.map((event) => ({
        ...event,
        type: "withdraw",
        timestamp: Date.now(),
      })),
    ];

    // Sort by timestamp (newest first)
    return allEvents.sort((a, b) => b.timestamp - a.timestamp);
  };

  // Update pagination calculation
  const allEvents = combineAndSortEvents();
  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = allEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(allEvents.length / itemsPerPage);

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="mb-8">
        <CardContent className="space-y-6">
          <GetBalance />
          <Deposit onDepositSuccess={refetchEvents} />
          <Withdraw onWithdrawSuccess={refetchEvents} />
        </CardContent>
      </Card>

      {/* Updated Transaction History Card */}
      {allEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentEvents.map((event, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg flex justify-between items-center ${
                    event.type === "deposit"
                      ? "bg-green-500/10"
                      : "bg-red-500/10"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm truncate max-w-[200px]">
                      From: {event.from}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        event.type === "deposit"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {event.type === "deposit" ? "↓ Deposit" : "↑ Withdraw"}
                    </span>
                  </div>
                  <span
                    className={`font-medium ${
                      event.type === "deposit"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatEther(event.value)} ETH
                  </span>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>

                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index + 1}>
                        <PaginationLink
                          onClick={() => handlePageChange(index + 1)}
                          isActive={currentPage === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Bank;
