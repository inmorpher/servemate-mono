# Servemate Backend Methods

This reference captures the current Servemate backend method catalog and the practical client-side handling rules.

## Auth

| Method          | Route                      | Return                                           | Handling                                                                                    |
| --------------- | -------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `login`         | `POST /auth/login`         | `{ user, accessToken, refreshToken, expiresIn }` | Treat as the session bootstrap. Persist tokens only through the existing auth/session flow. |
| `logout`        | `POST /auth/logout`        | `{ message }`                                    | Read as a success message and clear session state.                                          |
| `refresh_token` | `POST /auth/refresh-token` | `{ accessToken, refreshToken, expiresIn }`       | Use when access token expires or proxy refresh is required.                                 |
| `me`            | `GET /auth/me`             | `{ user }`                                       | Use for current-user identity and role checks.                                              |

## Users

| Method        | Route               | Return   | Handling                                                     |
| ------------- | ------------------- | -------- | ------------------------------------------------------------ |
| `create_user` | `POST /users`       | `string` | Display/use the returned message as plain text.              |
| `update_user` | `PUT /users/:id`    | `string` | Send the user id in the path and treat the response as text. |
| `delete_user` | `DELETE /users/:id` | `string` | Use the response message for confirmation.                   |

## Orders

| Method                    | Route                     | Return          | Handling                                                        |
| ------------------------- | ------------------------- | --------------- | --------------------------------------------------------------- |
| `get_order_meta`          | `GET /orders/meta`        | metadata object | Feed filters, dashboards, and min/max bounds from this payload. |
| `create_order`            | `POST /orders`            | `null`          | No response body. Use status code only.                         |
| `update_order_items`      | `PATCH /orders/:id/items` | `null`          | Replace food/drink item sets; do not parse body.                |
| `update_order_properties` | `PATCH /orders/:id`       | `null`          | Use for status/comments/discount/tip updates.                   |
| `print_order_items`       | `POST /orders/:id/print`  | `null`          | Fire-and-forget with status-based success handling.             |
| `call_order_items`        | `POST /orders/:id/call`   | `null`          | Fire-and-forget with status-based success handling.             |
| `delete_order`            | `DELETE /orders/:id`      | `null`          | Confirm by status code only.                                    |

## Tables

| Method                   | Route                     | Return   | Handling                                                                |
| ------------------------ | ------------------------- | -------- | ----------------------------------------------------------------------- |
| `create_table`           | `POST /tables`            | `string` | Use the message as confirmation.                                        |
| `update_table`           | `PUT /tables/:id`         | `string` | Treat as plain success text.                                            |
| `delete_table`           | `DELETE /tables/:id`      | `string` | Treat as plain success text.                                            |
| `clear_table`            | `PATCH /tables/:id/clear` | `string` | Use for occupancy reset flows.                                          |
| `assign_table_to_server` | `POST /tables/assign`     | `string` | Confirm assigned table ids and server id from the message.              |
| `seat_guests`            | `PATCH /tables/:id/seat`  | `string` | Note the backend expects `SeatingType` with a capital S in the payload. |

## Menu Items

### Food items

| Method             | Route                    | Return  | Handling                                                      |
| ------------------ | ------------------------ | ------- | ------------------------------------------------------------- | ---------------------------------------- |
| `create_food_item` | `POST /food-items`       | object  | Parse JSON and update lists immediately.                      |
| `get_food_item`    | `GET /food-items/:id`    | `object | null`                                                         | Handle the missing-item case explicitly. |
| `update_food_item` | `PATCH /food-items/:id`  | object  | Patch flows should merge the updated object into local state. |
| `delete_food_item` | `DELETE /food-items/:id` | `null`  | Status-only delete flow.                                      |

### Drink items

| Method              | Route                     | Return  | Handling                                                      |
| ------------------- | ------------------------- | ------- | ------------------------------------------------------------- | ---------------------------------------- |
| `create_drink_item` | `POST /drink-items`       | object  | Parse JSON and update lists immediately.                      |
| `get_drink_item`    | `GET /drink-items/:id`    | `object | null`                                                         | Handle the missing-item case explicitly. |
| `update_drink_item` | `PATCH /drink-items/:id`  | object  | Patch flows should merge the updated object into local state. |
| `delete_drink_item` | `DELETE /drink-items/:id` | `null`  | Status-only delete flow.                                      |

## Practical client rules

- Use `buildApiUrl` and the `/api/service` proxy for every backend call.
- Keep endpoint names in feature-level API modules, not inside UI components.
- Read `response.text()` for string payloads, `response.json()` for object payloads, and skip parsing entirely for `null` responses.
- Treat `401` as a token/session problem, not a normal business error.
- Prefer the shared DTOs and hooks already used in the project when a method participates in typed search or filtering.
- If the backend adds or changes fields, update the catalog snapshot and then update the consuming hook or DTO contract.
