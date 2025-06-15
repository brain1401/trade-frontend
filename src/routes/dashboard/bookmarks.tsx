import { createFileRoute } from "@tanstack/react-router";
import { BookmarkManagement } from "@/components/monitoring/BookmarkManagement";

export const Route = createFileRoute("/dashboard/bookmarks")({
  component: BookmarkManagementPage,
});

function BookmarkManagementPage() {
  return (
    <div className="container mx-auto py-6">
      <BookmarkManagement />
    </div>
  );
}
