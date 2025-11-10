// app/import-users/page.tsx

import UserImportForm from "@/components/user-import-form";

export default function ImportUsersPage() {
    return (
        <main className="container mx-auto py-8">
            <div className="flex flex-col items-center">
                <h1 className="mb-8 text-2xl font-bold">Bulk User Import</h1>
                <UserImportForm />
            </div>
        </main>
    );
}