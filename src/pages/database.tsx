import { useEffect } from "react";
import { useRouter } from "next/router";

export default function DatabasePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/play");
  }, [router]);

  return null;
}
