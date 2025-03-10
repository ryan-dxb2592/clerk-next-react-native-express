import { GalleryVerticalEnd } from "lucide-react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-6 justify-center items-center p-6 min-h-svh bg-muted md:p-10">
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <a href="#" className="flex gap-2 items-center self-center font-medium">
          <div className="flex justify-center items-center w-6 h-6 rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
