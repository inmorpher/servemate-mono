import { Card } from '@/features/card';
import { UserListItem } from '@servemate/dto';
import { memo } from 'react';
import { formatDate, getRoleColor } from '../utils/userHelpers';

/**
 * Displays a user card with user details such as name, role, status, email, and timestamps.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {UserListItem} props.user - The user data to display in the card.
 * @returns {JSX.Element} The rendered user card component.
 *
 * @remarks
 * - Shows the user's name, role (with color indicator), and active/inactive status.
 * - Displays the user's email in lowercase.
 * - Shows creation, update, and last login dates (if available), formatted for display.
 * - Uses memoization to prevent unnecessary re-renders.
 */
const UserCard = memo(function UserCard({ user }: { user: UserListItem }) {
	const roleColor = getRoleColor(user.role, 'text');
	const formattedCreatedAt = formatDate(user.createdAt);
	const formattedUpdatedAt = formatDate(user.updatedAt);
	const formattedLastLogin = user.lastLogin ? formatDate(user.lastLogin) : null;

	return (
		<Card>
			<Card.ColorIndicator color={roleColor} />
			<Card.Wrapper>
				<div className='mb-2 flex items-center gap-3'>
					<Card.Text type='heading'>{user.name}</Card.Text>
					<Card.Text className='text-ctp-subtext1 text-xs font-medium'>
						{user.id}
					</Card.Text>
					<Card.Text
						className={`rounded-full px-2 py-1 text-xs font-medium ${roleColor}`}
					>
						{user.role}
					</Card.Text>
					<Card.Text
						className={`rounded-full px-1 py-1 text-xs font-medium ${
							user.isActive
								? 'bg-ctp-green bg-opacity-20 text-ctp-green'
								: 'bg-ctp-red bg-opacity-20 text-ctp-red'
						}`}
					>
						{user.isActive ? 'Active' : 'Inactive'}
					</Card.Text>
				</div>

				<Card.Text type='text'>{user.email.toLowerCase()}</Card.Text>

				<div className='text-ctp-subtext1 flex flex-wrap gap-4 text-xs'>
					<Card.Text>Created: {formattedCreatedAt}</Card.Text>
					<Card.Text>Updated: {formattedUpdatedAt}</Card.Text>
					{formattedLastLogin && <Card.Text>Last login: {formattedLastLogin}</Card.Text>}
				</div>
			</Card.Wrapper>
		</Card>
	);
});

export default UserCard;
