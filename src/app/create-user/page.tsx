import type { Metadata } from "next";
import PageContainer from "@/components/page-container";
import CreateUser from "@/features/create-user";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function Page() {
  return (
    <PageContainer>
      <CreateUser />
    </PageContainer>
  );
}
