"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";

import trpc from "@/app/_trpc/client";
import { Toaster } from "react-hot-toast";

type Props = {
  children: React.ReactNode;
};

const Provider = ({ children }: Props) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${
            process.env.NEXT_PUBLIC_BACKEND_URI ?? "http://localhost:3000"
          }/api/trpc`,
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          }}
          reverseOrder={false}
        />
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default Provider;
