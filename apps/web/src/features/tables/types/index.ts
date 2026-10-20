import type {
	TableDto,
	TableListResponse,
	TableMetaDto,
	TableQueryDto,
} from '@servemate/shared-dto';

export type TableSearchCriteria = Partial<TableQueryDto>;

export type TablesListResult = TableListResponse;
export type RestaurantTable = TableDto;
export type TablesMeta = TableMetaDto;
