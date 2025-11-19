import { createFileRoute, Outlet } from "@tanstack/react-router";
import Sidebar from "@/components/Sidebar";

export const Route = createFileRoute("/_sidebar")({
  component: SidebarLayout,
});

function SidebarLayout() {
  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
}
