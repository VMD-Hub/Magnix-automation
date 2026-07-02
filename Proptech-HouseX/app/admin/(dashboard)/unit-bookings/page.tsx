import { AdminShell } from "@/components/admin/admin-shell";
import { UnitBookingBoard } from "@/components/admin/unit-booking-board";

export const metadata = {
  title: "Giữ suất F1 — Admin HouseX",
};

export default function AdminUnitBookingsPage() {
  return (
    <AdminShell title="Giữ suất mua (F1)">
      <UnitBookingBoard />
    </AdminShell>
  );
}
