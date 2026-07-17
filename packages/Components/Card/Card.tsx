import CardDefault from "@/packages/Components/Card/Card.default";
import CardFoldable from "@/packages/Components/Card/Card.foldable";
import type { CardProps } from "@/packages/Components/Card/Card.types";

export default function Card(props: CardProps) {
  if (props.accordion) return <CardFoldable {...props} />;
  return <CardDefault {...props} />;
}
