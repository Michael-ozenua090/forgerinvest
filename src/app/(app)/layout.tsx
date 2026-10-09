import PortalShell from "./PortalShell";

export const instant = false;

export const metadata = {
  title: "Dashboard | Forge",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalShell>{children}</PortalShell>;
}
