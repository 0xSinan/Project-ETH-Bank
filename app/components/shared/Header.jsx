import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">ETH Bank</h1>
          </div>

          <div className="flex items-center">
            <ConnectButton
              chainStatus="icon"
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
