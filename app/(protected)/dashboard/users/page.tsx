import { getUsers } from "@/actions/users"
import UserListTable from "@/components/users/user-list"


export default async function UsersPage({
    searchParams,
}: {
    searchParams: {
        page?: string
        search?: string
        role?: string
    }
}) {
    const page = Number(searchParams.page) || 1
    const pageSize = 10
    const search = searchParams.search || ""
    const role = searchParams.role === "all" ? null : searchParams.role || null

    const { data, total } = await getUsers({
        page,
        pageSize,
        search,
        role,
    })

    return (
        <div className="p-6">
            <h1 className="mb-4 text-xl font-semibold">User List</h1>
            <UserListTable
                data={data}
                total={total}
                page={page}
                pageSize={pageSize}
                search={search}
                roleFilter={role}
                currentUrl="/dashboard/users"
            />
        </div>
    )
}
