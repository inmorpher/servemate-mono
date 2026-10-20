import type {
	ReservationDto,
	ReservationListResponse,
	ReservationMetaDto,
	ReservationQueryDto,
} from '@servemate/shared-dto';

// Filters live in tab state and the URL, so dates are kept as the ISO strings sent to the API.
export type ReservationSearchCriteria = Partial<
	Omit<ReservationQueryDto, 'timeStart' | 'timeEnd'>
> & {
	timeStart?: string;
	timeEnd?: string;
};

export type ReservationListResult = ReservationListResponse;
export type ReservationListItem = ReservationDto;
export type ReservationsMeta = ReservationMetaDto;
