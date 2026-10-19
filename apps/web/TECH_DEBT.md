# Технический долг ServeMate Client

> Статус: черновик для приоритизации.  
> Цель: собрать все известные проблемы в одном месте, чтобы выбрать, что убирать, а что оставить.

---

## Критично — блокеры стабильности

| # | Проблема | Почему важно | Где | Рекомендация |
|---|----------|--------------|-----|--------------|
| 1 | **Два источника истины для фильтров/поиска** | URL-парсинг в `useGetOrders` и Zustand-табы в `useListPageState`/`useOrderFilters` не синхронизированы. Это ведёт к рассинхрону UI, багам пагинации и невозможности делиться ссылками. | `src/features/orders/hooks/useGetOrders.ts`, `useGetOrdersAndMeta.ts`, `useOrderFilters.ts`, `useListPageState.ts` | Выбрать один подход: либо URL-driven (как в `DEV_NOTES/SEARCH_CRITERIA.md`), либо табы. Смешивать нельзя. |
| 2 | **Дублирующийся логин** | Два почти идентичных server action: `loginAction` (с `callbackUrl`) и `login` (хардкод `/account`). Один из них точно забыт. | `src/features/auth/actions/login.ts`, `src/features/auth/api/login.ts` | Оставить один, удалить второй. Обновить все вызовы. |
| 3 | **Несоответствие имён куки** | В `loginAction` ищется `'servemate-session'`, а в `session.ts` кука называется `'servemate_session'`. Логин может не работать корректно. | `src/features/auth/actions/login.ts#L48`, `src/app/lib/session.ts` | Унифицировать имя куки. |
| 4 | **Захардкоженные секреты и неproduction-настройки сессии** | `SESSION_SECRET` с дефолтным значением в `next.config.ts`, `secure: false`, `domain: 'your-domain.com'`. | `src/app/lib/session.ts`, `next.config.ts` | Вынести секреты в env, настроить `secure`/`domain` под production, убрать дефолты из конфига. |
| 5 | **Задвоенный `if` в `getSession`** | `if (!session.isLoggedIn)` написан дважды — явная опечатка. | `src/app/lib/session.ts#L28-L30` | Удалить дубль. |

---

## Высокий приоритет — качество кода и UX

| # | Проблема | Почему важно | Где | Рекомендация |
|---|----------|--------------|-----|--------------|
| 6 | **Мёртвые/заглушечные страницы** | `app/page.tsx` просто показывает «Загрузка...», `dashboard/page.tsx` ничего не делает, `account/page.tsx` почти полностью закомментирован. | `src/app/page.tsx`, `src/app/(protected)/dashboard/page.tsx`, `src/app/(protected)/account/page.tsx` | Либо доделать, либо удалить/перенаправить. |
| 7 | **Захардкоженные active filters и кнопки** | В `OrdersListPage` и `UserClientPage` `activeFilters`, `onClearFilters`, toolbar-кнопки «Filters»/«Sort» не подключены к реальным фильтрам. | `src/features/orders/ui/OrdersListPage.tsx`, `src/features/users/ui/UserClientPage.tsx` | Подключить к `useOrderFilters` / `useUserFilters` или убрать до реализации. |
| 8 | **Неиспользуемый `OrderSearchBar`** | Компонент принимает props, но нигде не используется. Вместо него `OrderFilters`. | `src/features/orders/ui/OrderSearchBar.tsx` | Удалить или интегрировать в фильтры. |
| 9 | **Опечатки и мелкие баги UI** | `TabsDorpdown.tsx` (имя файла), `focus :bg-ctp-surface` (пробел в классе), `mewAllergies` вместо `newAllergies`. | `src/shared/components/tabs/ui/TabsDorpdown.tsx`, `src/features/orders/hooks/useOrderFilters.ts` | Поправить опечатки, переименовать файл. |
| 10 | **Рендер всех табов одновременно** | `CPanelIndex` рендерит все табы через `<Activity mode='hidden'>`. При росте числа табов это станет проблемой производительности. | `src/features/cpanel/index.tsx` | Рендерить только активный таб или мемоизировать/размонтировать неактивные. |
| 11 | **Неправильная логика диапазона цен** | В `PriceRangeFilter`/`OrderFilters` может быть `minAmount || fallback`, что ломается при `minAmount = 0`. | `src/features/orders/ui/OrderFilters.tsx` | Использовать `??` вместо `\|\|`. |
| 12 | **Доступность таблицы и сортировки** | `Button` внутри `Table.HeaderCell` — две интерактивные области. Возможны проблемы с клавиатурой и screen reader. | `src/features/orders/ui/OrderList.tsx` | Сделать `Table.HeaderCell` кнопкой, убрать вложенный `Button`. |

---

## Средний приоритет — архитектура и консистентность

| # | Проблема | Почему важно | Где | Рекомендация |
|---|----------|--------------|-----|--------------|
| 13 | **Неполный `consts.ts` / `API_ENDPOINTS`** | В `consts.ts` только `Users` и `OrdersActions`, хотя endpoint'ы живут в feature-файлах. | `src/consts.ts` | Либо расширить до полного реестра, либо удалить и полагаться на feature-endpoints. |
| 14 | **Два разных подхода к API-клиентам** | `orderApiClient` использует `requestVoid`, `usersApiClient` — inline `apiRequest`. | `src/features/orders/api/client.ts`, `src/features/users/api/client.ts` | Унифицировать стиль. |
| 15 | **`useGetOrders` vs `useGetOrdersAndMeta`** | `useGetOrders` парсит URL, `useGetOrdersAndMeta` работает с табами. Оба хука существуют, но используют разные модели. | `src/features/orders/hooks/` | Оставить один хук после решения проблемы #1. |
| 16 | **`buildQueryParams` не поддерживает массивы/даты/объекты** | В `DEV_NOTES` описана улучшенная версия, но в коде базовая. | `src/shared/utils/buildQueryParams.ts` | Внедрить улучшенную версию или удалить `DEV_NOTES`, если не актуально. |
| 17 | **`fetchWithAuth` не используется / не доработан** | Функция есть, но в проекте используется прокси + `apiRequest`. | `src/shared/utils/fecthWithAuth.ts` | Удалить или задействовать. |
| 18 | **Расхождение документации и кода** | `GEMINI.md` и `improvements.md` ссылаются на `axios`, `next-auth`, `middleware.ts` — этого в проекте нет. `PROJECT_CONTEXT.md` описывает бэкенд, а не фронтенд. | `GEMINI.md`, `improvements.md`, `PROJECT_CONTEXT.md` | Обновить или удалить устаревшие документы. |
| 19 | **Нет единого подхода к ошибкам мутаций** | `handleDeleteOrder` использует `mutateAsync` + `confirm`, другие действия — просто `mutateAsync`. Нет тостов/обработки ошибок. | `src/features/orders/ui/OrderList.tsx` | Внедрить единый паттерн: тосты, обработка ошибок, optimistic update по возможности. |
| 20 | **`OrderCreatePayload` дублирует DTO** | В `order.types.ts` есть `OrderCreatePayload`, но в коде используется `OrderCreateDTO` из `@servemate/dto`. | `src/features/orders/types/order.types.ts` | Удалить `OrderCreatePayload` или явно отделить UI-тип от DTO. |

---

## Низкий приоритет — улучшения и эксперименты

| # | Проблема | Почему важно | Где | Рекомендация |
|---|----------|--------------|-----|--------------|
| 21 | **View Transitions + Activity API — экспериментальные** | Включены в `next.config.ts` и используются в `CPanelIndex`. Могут давать непредсказуемые баги в продакшене. | `next.config.ts`, `src/features/cpanel/index.tsx` | Оценить стабильность или отключить до релиза. |
| 22 | **React Compiler включён** | `compilationMode: 'all'` — хорошо, но требует мониторинга. | `next.config.ts` | Оставить, но следить за багами. |
| 23 | **Нет E2E/интеграционных тестов** | Есть только `a11y-audit.js` и `fsd-validator.js` в скриптах. | `scripts/`, отсутствие `__tests__` | Добавить хотя бы smoke-тесты для логина и списка заказов. |
| 24 | **Перевод проекта незавершён** | Часть UI на английском, часть на русском (`Профиль пользователя`, `Обновление сессии...`). | `src/app/(auth)/refresh/page.tsx`, `src/app/(protected)/account/page.tsx` | Выбрать язык по умолчанию и привести к единому виду. |
| 25 | **Возможность перехода на NestJS на бэкенде** | Обсуждалось отдельно. Не блокер, но стоит держать в виде долгосрочной задачи. | Бэкенд | Отложить до стабилизации клиента, сделать POC позже. |

---

## Быстрые победы (можно сделать за один день)

1. Удалить дублирующийся `login` server action.
2. Унифицировать имя куки `servemate_session`.
3. Поправить задвоенный `if` в `session.ts`.
4. Исправить опечатки: `mewAllergies`, `TabsDorpdown`, `focus :bg-ctp-surface`.
5. Удалить/закомментировать захардкоженные `activeFilters` в `OrdersListPage` и `UserClientPage`.
6. Удалить неиспользуемый `OrderSearchBar`.
7. Обновить/удалить устаревшие `GEMINI.md` и `improvements.md`.

---

## Архитектурные решения, которые нужно принять

1. **Источник истины для фильтров**: URL или Zustand-табы?
2. **Нужен ли `consts.ts`/`API_ENDPOINTS`** или endpoint'ы остаются в feature-файлах?
3. **Что делать с `CPanelIndex` и табами**: оставить рендер всех табов или перейти к ленивому рендеру?
4. **Какой язык интерфейса по умолчанию**: EN или RU?
5. **Переходить ли на NestJS** сейчас или после стабилизации клиента?

---

*Последнее обновление: 2026-07-03*
