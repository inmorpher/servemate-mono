'use client';

'use client';

import { useGetOrdersMeta } from '@/features/orders/hooks/useGetOrdersMeta';
import { FilterDateRange } from '@/shared/components/filter/ui/FilterDateRange';
import { useState } from 'react';

export default function DatePickerPage() {
	const { data: metaData } = useGetOrdersMeta();

	const [range, setRange] = useState<{ from: string | undefined; to: string | undefined }>({
		from: undefined,
		to: undefined,
	});

	const min = metaData?.dates?.min
		? new Date(metaData.dates.min).toISOString().split('T')[0]
		: undefined;

	const max = metaData?.dates?.max
		? new Date(metaData.dates.max).toISOString().split('T')[0]
		: undefined;

	return (
		<FilterDateRange
			from={range.from}
			to={range.to}
			min={min}
			max={max}
			onChange={(nextRange) => setRange({ from: nextRange.from, to: nextRange.to })}
		/>
	);
}
