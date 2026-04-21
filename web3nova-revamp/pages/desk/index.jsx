import { useEffect } from "react";
import { useRouter } from "next/router";
import { getToken } from "@/lib/deskApi";

export default function DeskHome() {
  const router = useRouter();
  useEffect(() => {
    router.replace(getToken() ? "/desk/applicants" : "/desk/login");
  }, [router]);
  return null;
}
