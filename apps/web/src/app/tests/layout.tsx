import { QueryProvider } from '@/providers/QueryProvider';

export default function TestsLayout({ children }: { children: React.ReactNode }) {
	return <QueryProvider>{children}</QueryProvider>;
}
