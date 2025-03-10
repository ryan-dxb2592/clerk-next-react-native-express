import { Spinner } from "@/components/custom/spinner";

export default function Home() {
  return (
    <>
      <Spinner size={"large"} />
      <div className="text-xs text-center text-muted-foreground text-balance">
        Redirecting...
      </div>
    </>
  );
}
