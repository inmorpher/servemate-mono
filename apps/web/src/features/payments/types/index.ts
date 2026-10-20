import type {
	PaymentDTO,
	PaymentListDTO,
	PaymentMetaDto,
	PaymentSearchCriteria as PaymentSearchQuery,
} from '@servemate/shared-dto';

export type PaymentSearchCriteria = Partial<PaymentSearchQuery>;

export type PaymentListResult = PaymentListDTO;
export type PaymentListItem = PaymentDTO;
export type PaymentsMeta = PaymentMetaDto;
