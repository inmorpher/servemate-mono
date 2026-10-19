'use client';

import { Button } from '@/shared/components/button';
import { Pagination } from '@/shared/components/pagination';
import { Tab } from '@/shared/components/tabs/types/tabs.type';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { ListPageLayout } from '@/shared/layouts/ListPageLayout';
import { UserSearchCriteria } from '@servemate/dto';
import { useGetUsers } from '../hooks/useUsers';
import UserSearchBar from './UserSearchBar';
import { UsersList } from './table/UsersList';
/**
 * Renders the user management page for clients, including search, pagination, and user list.
 *
 * This component fetches user data based on search criteria, displays a search bar,
 * paginated user list, and handles loading and error states.
 *
 * @returns {JSX.Element} The user client page layout with search, pagination, and user list.
 */

const UserClientPage = ({ tabId }: { tabId: Tab['id'] }) => {
	const { filters, handleSortChange, handlePageChange, handlePageSizeChange } =
		useListPageState<UserSearchCriteria>({ tabId });

	const { isLoading, data } = useGetUsers(filters || {});

	const { users, totalCount, totalPages, page, pageSize } = data || {};

	return (
		<ListPageLayout
			title='Users'
			description='Manage clients and review account data.'
			actions={
				<>
					<Button variant='outline' size='sm'>
						Invite
					</Button>
					<Button size='sm'>Add user</Button>
				</>
			}
			filters={<UserSearchBar />}
			content={
				<UsersList
					isLoading={isLoading}
					users={users}
					sortBy={filters?.sortBy}
					sortOrder={filters?.sortOrder}
					onSortChange={handleSortChange}
				/>
			}
			footer={
				<Pagination
					totalCount={totalCount ?? 0}
					totalPages={totalPages ?? 1}
					currentPage={page ?? filters?.page ?? 1}
					pageSize={pageSize ?? filters?.pageSize ?? 10}
					onPageChange={handlePageChange}
					onPageSizeChange={handlePageSizeChange}
				/>
			}
		/>
	);
};

export default UserClientPage;
