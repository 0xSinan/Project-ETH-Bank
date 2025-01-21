"use client";

import { useAccount } from "wagmi";
import NotConnected from "./components/shared/NotConnected";
import Bank from "./components/shared/Bank";

export default function Home() {
  const { isConnected } = useAccount();

  return isConnected ? <Bank /> : <NotConnected />;
}
