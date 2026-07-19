import CardDefault from "./Card.default";
import CardFoldable from "./Card.foldable";
import type { CardProps } from "./Card.types";

export default function Card(props: CardProps) {
  if (props.accordion) return <CardFoldable {...props} />;
  return <CardDefault {...props} />;
}
