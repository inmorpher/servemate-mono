import { CardColorIndicator } from './CardColorIndicator';
import { CardContainer } from './CardContainer';
import { CardText } from './CardText';
import { CardWrapper } from './CardWrapper';

/**
 * The `Card` component is a composite React component that combines the main `CardContainer`
 * with several subcomponents for flexible usage.
 *
 * @remarks
 * This object uses `Object.assign` to attach the following subcomponents:
 * - `Wrapper`: The wrapper component for the card.
 * - `Text`: The text component for displaying content within the card.
 * - `ColorIndicator`: A visual indicator for color representation.
 *
 * @example
 * ```tsx
 * <Card>
 *   <Card.Wrapper>
 *     <Card.ColorIndicator color="red" />
 *     <Card.Text>Example Card</Card.Text>
 *   </Card.Wrapper>
 * </Card>
 * ```
 */
export const Card = Object.assign(CardContainer, {
	Wrapper: CardWrapper,
	Text: CardText,
	ColorIndicator: CardColorIndicator,
});
