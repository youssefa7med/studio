"use client"; 

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-2xl font-bold text-destructive mb-4 font-headline">
        Something went wrong in the Admin Area!
      </h2>
      <p className="text-muted-foreground mb-6">{error.message}</p>
      <Button
        onClick={() => reset()}
        variant="default"
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Try again
      </Button>
    </div>
  );
}
