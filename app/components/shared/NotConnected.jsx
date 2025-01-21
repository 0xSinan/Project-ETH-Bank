import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const NotConnected = () => {
  return (
    <Alert variant="destructive">
      <AlertTitle>Warning!</AlertTitle>
      <AlertDescription>
        Please connect your wallet to start using the dApp.
      </AlertDescription>
    </Alert>
  );
};

export default NotConnected;
