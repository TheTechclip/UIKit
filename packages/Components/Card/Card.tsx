import type { CardProps } from "./Card.types";
import CardDefault from "./Card.default";
import CardFoldable from "./Card.foldable";

export default function Card(props: CardProps) {
  if (props.accordion) return <CardFoldable {...props} />;
  return <CardDefault {...props} />;
}
