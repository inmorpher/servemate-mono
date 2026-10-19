# Улучшения проекта ServeMate

## 1. Консолидация хуков useGetOrders и useGetOrdersMeta

**Описание**: В `OrderFilters.tsx` используется два хука с пересекающейся логикой парсинга критериев поиска. Это приводит к дублированию и потенциальным несоответствиям. Рекомендуется объединить в один `useOrderSearch` хук для единообразия и избежания ошибок синхронизации.

**Пример реализации**:

```typescript
// src/features/orders/hooks/useOrderSearch.ts
export const useOrderSearch = () => {
	const orderSearchCriteria = useSearchCriteria({
		schema: OrderSearchSchema,
		numberFields: ['id', 'page', 'pageSize', 'minAmount', 'maxAmount'],
		arrayFields: ['status', 'allergies'],
	});

	const ordersData = useQuery({
		/* ... */
	});
	const ordersMeta = useQuery({
		/* ... */
	});

	return { orderSearchCriteria, updateSearchCriteria, ordersData, ordersMeta };
};
```

**Файл и строка**: `src/features/orders/ui/OrderFilters.tsx` (строки 15-20), `src/features/orders/hooks/useGetOrders.ts`, `src/features/orders/hooks/useGetOrdersMeta.ts`.

## 2. Синхронизация локального состояния с URL в OrderFilters

**Описание**: Локальное состояние `searchValue` в `OrderFilters.tsx` не синхронизировано с `orderSearchCriteria.id`, что может привести к расхождениям. Закомментированный `useEffect` не активирован.

**Пример реализации**:

```typescript
useEffect(() => {
	setSearchValue(orderSearchCriteria.id?.toString() ?? '');
}, [orderSearchCriteria.id]);
```

**Файл и строка**: `src/features/orders/ui/OrderFilters.tsx` (строки 25-27).

## 3. Улучшение парсинга числовых значений в OrderFilters

**Описание**: `Number(searchValue)` без проверки может дать NaN. Использовать `parseInt` с проверкой.

**Пример реализации**:

```typescript
const parsed = searchValue.trim() ? parseInt(searchValue, 10) : undefined;
if (parsed && Number.isFinite(parsed)) {
	updateSearchCriteria({ id: parsed });
}
```

**Файл и строка**: `src/features/orders/ui/OrderFilters.tsx` (строки 50-55).

## 4. Исправление логики диапазона цен в OrderFilters

**Описание**: `minAmount || ordersMeta.filtered.prices.min` может ошибочно использовать fallback при minAmount = 0. Использовать nullish coalescing.

**Пример реализации**:

```typescript
minValue={minAmount ?? ordersMeta.filtered.prices.min}
```

**Файл и строка**: `src/features/orders/ui/OrderFilters.tsx` (строка 75).

## 5. Удаление неиспользуемых зависимостей

**Описание**: В `package.json` установлены `next-auth`, `axios`, `use-debounce`, но они не используются в коде. Это увеличивает размер бандла.

**Пример реализации**:

```bash
npm uninstall next-auth axios use-debounce
```

**Файл и строка**: `package.json` (строки 15, 24, 32).

## 6. Удаление console.log из middleware.ts

**Описание**: В `middleware.ts` много console.log, что плохо для продакшена и может засорять логи.

**Пример реализации**:
Удалить все console.log, заменить на условное логирование в dev-режиме.

**Файл и строка**: `src/middleware.ts` (строки 7-10, 18, 25, 30, 35, 38).

## 7. Удаление console.log из config.ts

**Описание**: В `config.ts` есть console.log для отладки, который не нужен в продакшене.

**Пример реализации**:
Удалить строку `console.log('CONFIG.API_BASE_URL:', CONFIG.API_BASE_URL);`

**Файл и строка**: `src/app/api/service/[...params]/config.ts` (строка 11).

## 8. Добавление логирования в consts.ts для отладки

**Описание**: В `consts.ts` нет логирования для переменных окружения, что затрудняет отладку.

**Пример реализации**:

```typescript
if (process.env.NODE_ENV !== 'production') {
	console.log('API_BASE_URL resolved to:', API_BASE_URL);
}
```

**Файл и строка**: `src/consts.ts` (после строки 3).

## 9. Расширение API_ENDPOINTS в consts.ts

**Описание**: В `API_ENDPOINTS` только два эндпоинта, можно добавить больше для полноты.

**Пример реализации**:

```typescript
export const API_ENDPOINTS = {
	Users: `/api/service/users`,
	Orders: `/api/service/orders`,
	Auth: { Login: `/api/service/auth/login` },
};
```

**Файл и строка**: `src/consts.ts` (строка 5).

## 10. Использование axios вместо fetch в orderApiClient

**Описание**: В `orderApiClient` используется fetch, но установлен axios. Для консистентности можно перейти на axios.

**Пример реализации**:

```typescript
import axios from 'axios';
const response = await axios.get(url);
```

**Файл и строка**: `src/features/orders/api/client.ts` (строки 6-10, 15-19).

# Улучшения проекта ServeMate

## 1. Консолидация хуков useGetOrders и useGetOrdersMeta

**Описание**: В `OrderFilters.tsx` используется два хука с пересекающейся логикой парсинга критериев поиска. Это приводит к дублированию и потенциальным несоответствиям. Рекомендуется объединить в один `useOrderSearch` хук для единообразия и избежания ошибок синхронизации.

**Пример реализации**:

```typescript
// src/features/orders/hooks/useOrderSearch.ts
export const useOrderSearch = () => {
	const orderSearchCriteria = useSearchCriteria({
		schema: OrderSearchSchema,
		numberFields: ['id', 'page', 'pageSize', 'minAmount', 'maxAmount'],
		arrayFields: ['status', 'allergies'],
	});

	const ordersData = useQuery({
		/* ... */
	});
	const ordersMeta = useQuery({
		/* ... */
	});

	return { orderSearchCriteria, updateSearchCriteria, ordersData, ordersMeta };
};
```

**Файл и строка**: `src/features/orders/ui/OrderFilters.tsx` (строки 15-20), `src/features/orders/hooks/useGetOrders.ts`, `src/features/orders/hooks/useGetOrdersMeta.ts`.

## 2. Синхронизация локального состояния с URL в OrderFilters

**Описание**: Локальное состояние `searchValue` в `OrderFilters.tsx` не синхронизировано с `orderSearchCriteria.id`, что может привести к расхождениям. Закомментированный `useEffect` не активирован.

**Пример реализации**:

```typescript
useEffect(() => {
	setSearchValue(orderSearchCriteria.id?.toString() ?? '');
}, [orderSearchCriteria.id]);
```

**Файл и строка**: `src/features/orders/ui/OrderFilters.tsx` (строки 25-27).

## 3. Улучшение парсинга числовых значений в OrderFilters

**Описание**: `Number(searchValue)` без проверки может дать NaN. Использовать `parseInt` с проверкой.

**Пример реализации**:

```typescript
const parsed = searchValue.trim() ? parseInt(searchValue, 10) : undefined;
if (parsed && Number.isFinite(parsed)) {
	updateSearchCriteria({ id: parsed });
}
```

**Файл и строка**: `src/features/orders/ui/OrderFilters.tsx` (строки 50-55).

## 4. Исправление логики диапазона цен в OrderFilters

**Описание**: `minAmount || ordersMeta.filtered.prices.min` может ошибочно использовать fallback при minAmount = 0. Использовать nullish coalescing.

**Пример реализации**:

```typescript
minValue={minAmount ?? ordersMeta.filtered.prices.min}
```

**Файл и строка**: `src/features/orders/ui/OrderFilters.tsx` (строка 75).

## 5. Удаление неиспользуемых зависимостей

**Описание**: В `package.json` установлены `next-auth`, `axios`, `use-debounce`, но они не используются в коде. Это увеличивает размер бандла.

**Пример реализации**:

```bash
npm uninstall next-auth axios use-debounce
```

**Файл и строка**: `package.json` (строки 15, 24, 32).

## 6. Удаление console.log из middleware.ts

**Описание**: В `middleware.ts` много console.log, что плохо для продакшена и может засорять логи.

**Пример реализации**:
Удалить все console.log, заменить на условное логирование в dev-режиме.

**Файл и строка**: `src/middleware.ts` (строки 7-10, 18, 25, 30, 35, 38).

## 7. Удаление console.log из config.ts

**Описание**: В `config.ts` есть console.log для отладки, который не нужен в продакшене.

**Пример реализации**:
Удалить строку `console.log('CONFIG.API_BASE_URL:', CONFIG.API_BASE_URL);`

**Файл и строка**: `src/app/api/service/[...params]/config.ts` (строка 11).

## 8. Добавление логирования в consts.ts для отладки

**Описание**: В `consts.ts` нет логирования для переменных окружения, что затрудняет отладку.

**Пример реализации**:

```typescript
if (process.env.NODE_ENV !== 'production') {
	console.log('API_BASE_URL resolved to:', API_BASE_URL);
}
```

**Файл и строка**: `src/consts.ts` (после строки 3).

## 9. Расширение API_ENDPOINTS в consts.ts

**Описание**: В `API_ENDPOINTS` только два эндпоинта, можно добавить больше для полноты.

**Пример реализации**:

```typescript
export const API_ENDPOINTS = {
	Users: `/api/service/users`,
	Orders: `/api/service/orders`,
	Auth: { Login: `/api/service/auth/login` },
};
```

**Файл и строка**: `src/consts.ts` (строка 5).

## 10. Использование axios вместо fetch в orderApiClient

**Описание**: В `orderApiClient` используется fetch, но установлен axios. Для консистентности можно перейти на axios.

**Пример реализации**:

```typescript
import axios from 'axios';
const response = await axios.get(url);
```

**Файл и строка**: `src/features/orders/api/client.ts` (строки 6-10, 15-19).

---

# Дополнительный аудит (полный скан кодовой базы)

## МЁРТВЫЙ КОД И ИЗБЫТОЧНЫЕ ФАЙЛЫ

### 11. Пустые файлы

**Описание**: Файлы существуют, но не содержат кода — создают путаницу при навигации.

- `src/features/card/CardBlock.tsx` — полностью пустой
- `src/features/orders/api/index.ts` — пустой re-export

**Действие**: Удалить оба файла; при необходимости ContentBlock реализовать с нуля.

### 12. Дублирующий Layout-компонент

**Описание**: Существуют два варианта одного и того же layout-компонента. `ListPageLayout.tsx` нигде не импортируется, используется только `ListPageLayout2.tsx`.

**Файлы**:

- `src/shared/layouts/ListPageLayout.tsx` — **нигде не используется** (мёртвый код)
- `src/shared/layouts/ListPageLayout2.tsx` — используется в `OrdersListPage.tsx`

**Действие**: Удалить `ListPageLayout.tsx`; при необходимости переименовать `ListPageLayout2.tsx` → `ListPageLayout.tsx`.

### 13. Тестовый/дублирующий компонент OrderListTest

**Описание**: `OrderListTest.tsx` — это экспериментальный дубль `OrderList.tsx`. В `OrdersListPage.tsx` закомментирован оригинальный `<OrderList />` и вместо него подключён `<OrderListTest />`. Тестовый файл содержит `console.table` и `console.log` в теле компонента.

**Файлы**:

- `src/features/orders/ui/OrderListTest.tsx`
- `src/features/orders/ui/OrdersListPage.tsx` (строки 52–59)

**Действие**: Принять решение — либо вернуть оригинальный `OrderList`, либо оформить `OrderListTest` как финальный компонент и удалить старый.

### 14. Неиспользуемые утилиты

**Описание**: Функции существуют, но ни разу не импортируются в проекте.

- `src/shared/utils/pliralize.ts` (функция `pluralize`) — нигде не импортируется
- `src/shared/hooks/useSwipe.tsx` — нигде не импортируется
- `src/shared/utils/fecthWithAuth.ts` — определён, но не вызывается ни одним компонентом

**Действие**: Удалить или подключить туда, где они нужны.

### 15. Большой блок закомментированного кода

**Описание**: ~100+ строк закомментированного UI-кода в `account/page.tsx` — остаток незавершённой разработки.

**Файл**: `src/app/(protected)/account/page.tsx` (строки 4–162)

**Действие**: Если функциональность не планируется — удалить. Если планируется — создать задачу и убрать комментарии в отдельную ветку.

---

## ОПЕЧАТКИ В ИМЕНАХ ФАЙЛОВ

### 16. Переименовать файлы с опечатками

**Описание**: Имена четырёх файлов содержат опечатки, что затрудняет поиск и вызывает когнитивную нагрузку.

| Текущее имя                                | Правильное имя       |
| ------------------------------------------ | -------------------- |
| `src/shared/utils/devounce.ts`             | `debounce.ts`        |
| `src/shared/utils/fecthWithAuth.ts`        | `fetchWithAuth.ts`   |
| `src/shared/utils/pliralize.ts`            | `pluralize.ts`       |
| `src/features/auth/api/refresh-sestion.ts` | `refresh-session.ts` |

**Действие**: Переименовать файлы и обновить все импорты.

---

## БАГИ В ЛОГИКЕ

### 17. Несоответствие обработки времени истечения токена

**Описание**: В двух местах по-разному обрабатывается `exp` из JWT-токена (секунды vs миллисекунды).

- `src/features/auth/actions/login.ts` (строка 42): `decodedToken.exp * 1000` ✅ (правильно)
- `src/features/auth/api/login.ts` (строка 38): `decodedToken.exp` ❌ (без умножения на 1000)

**Эффект**: В одном из путей аутентификации `expiresAt` будет в 1000 раз меньше ожидаемого, что приведёт к немедленному истечению сессии.

**Действие**: Применить `* 1000` в обоих местах.

### 18. Неработающая интерполяция строки

**Описание**: В компоненте страницы обновления сессии использован синтаксис `${returnUrl}` внутри обычных кавычек, а не шаблонных литералов — `returnUrl` не подставится.

**Файл**: `src/app/(auth)/refresh/page.tsx` (строка 34)

```typescript
// ❌ Текущий код
return <div>Обновление сессии...${returnUrl}</div>;

// ✅ Должно быть
return <div>{`Обновление сессии...${returnUrl}`}</div>;
```

---

## ДУБЛИРУЮЩАЯСЯ ЛОГИКА

### 19. Дублирующая логика логина в двух файлах

**Описание**: `src/features/auth/actions/login.ts` и `src/features/auth/api/login.ts` содержат практически идентичную логику: один и тот же API-эндпоинт, одинаковое декодирование токена, одинаковое обновление сессии. Разница только в `expiresAt` (баг #17) и URL редиректа.

**Проблема**: При изменении логики аутентификации нужно обновлять оба файла — риск рассинхронизации.

**Действие**: Вынести общую логику в одну функцию `createSession(credentials)` и вызывать её из обоих файлов.

---

## НЕСООТВЕТСТВИЯ В АРХИТЕКТУРНЫХ ПАТТЕРНАХ

### 20. Три разных способа построения API URL

**Описание**: В разных хуках URL для запросов строятся по-разному:

- `useGetOrders.ts`: прямой `fetch(${API_ENDPOINTS.OrdersActions.list}?...)`
- `useApiQuery.ts`: использует `buildApiUrl()` из shared/utils
- `useUsers.ts`: использует `buildQueryParams()` напрямую

**Действие**: Стандартизировать на одном паттерне — предпочтительно `buildApiUrl(endpoint, params)` через `useApiQuery`.

### 21. features/card должен быть в shared/components

**Описание**: `src/features/card/` — это набор переиспользуемых UI-примитивов (CardContainer, CardText, CardWrapper и т.д.), не привязанных к конкретному домену. По правилам FSD, такой код должен находиться в `src/shared/components/card/`.

**Действие**: Переместить директорию и обновить импорты.

### 22. Несоответствие staleTime в React Query

**Описание**: В разных хуках и провайдере установлены разные значения `staleTime` без явной стратегии:

- `QueryProvider`: 1 минута (глобально)
- `useGetOrders`: 5 минут
- `useGetUsers`: 5 минут
- `useOrderFilters`: `refetchInterval` 5 минут (другой механизм)

**Действие**: Определить явную стратегию кеширования — создать константы `STALE_TIME.SHORT`, `STALE_TIME.MEDIUM` и применять их последовательно.

### 23. Отсутствие useMutation для POST/PUT/DELETE

**Описание**: В кодовой базе нет ни одного `useMutation` от React Query. Мутирующие операции (создание, обновление, удаление заказов) либо не реализованы, либо делаются вне React Query — без автоматической инвалидации кеша.

**Действие**: Реализовать мутации через `useMutation` с `onSuccess: () => queryClient.invalidateQueries(['orders'])`.

---

## ПРОИЗВОДИТЕЛЬНОСТЬ

### 24. Обработчики событий без useCallback в useOrderFilters

**Описание**: Все handler-функции в `useOrderFilters.ts` (`handlePriceRangeChange`, `handleAllergyToggle` и др.) пересоздаются при каждом ре-рендере и передаются в дочерние компоненты.

**Файл**: `src/features/orders/hooks/useOrderFilters.ts` (строки 41–102)

**Действие**: Обернуть все обработчики в `useCallback`.

### 25. Index как key в пагинации

**Описание**: В компоненте пагинации используется паттерн `key={String(page) + '-' + index}` — примесь индекса массива в ключ нарушает корректность reconciliation при изменении порядка страниц.

**Файл**: `src/features/orders/ui/OrderList.tsx` (строка ~36)

**Действие**: Использовать только `key={String(page)}` без индекса.

---

## DEBUG-КОД В ПРОДАКШЕНЕ

### 26. console.log в Sidebar

**Файл**: `src/shared/components/sidebar/Sidebar.tsx` (строка 13)

```typescript
console.log('Sidebar render, isOpen:', sidebarIsOpen);
```

### 27. console.table/console.log в OrderListTest

**Файл**: `src/features/orders/ui/OrderListTest.tsx` (строка ~55)

```typescript
console.table({ sortBy, columnSortBy: column.sortBy });
console.log('isActiveSort', isActiveSort);
```

### 28. console.log в buildQueryParams

**Файл**: `src/shared/utils/buildQueryParams.ts` (строка 10)

```typescript
console.log('test buildQueryParams', ...)
```

**Действие по пп. 26–28**: Удалить все `console.log`/`console.table` из продакшн-кода. При необходимости дебаг-логирования использовать `process.env.NODE_ENV !== 'production'`-guard или библиотеку логирования.

---

## ТИПОБЕЗОПАСНОСТЬ

### 29. Использование any в FilterReset

**Описание**: Проп `filters` типизирован как `Record<string, any>`, что обнуляет преимущества TypeScript.

**Файл**: `src/shared/components/filter/ui/FilterReset.tsx` (строка 5)

**Действие**: Заменить на конкретный generic-тип или `Record<string, unknown>`.

---

## ОБЩЕЕ ВПЕЧАТЛЕНИЕ

**Сильные стороны проекта:**

- Хорошая основа FSD-архитектуры — домены чётко разделены
- Правильное использование Zustand (persist middleware, иммутабельные обновления)
- Импорты DTO из `@servemate/dto` последовательны — нет дублирования типов
- `OrderCard` уже обёрнут в `React.memo` — хороший пример
- API-прокси через `/api/service/` — правильный подход для безопасности токенов

**Основные проблемы:**

- Проект находится в активной разработке с незачищенными следами — тест-файлы, закомментированный код, debug-логи
- Два критических бага: разное обращение с `exp` токена и сломанная интерполяция строки
- Несогласованность паттернов: 3 способа строить URL, 2 способа работать с useQuery, дублирующая логика логина
- Мёртвый код накапливается (4 файла с опечатками, 2 неиспользуемых утилиты, пустые файлы)
