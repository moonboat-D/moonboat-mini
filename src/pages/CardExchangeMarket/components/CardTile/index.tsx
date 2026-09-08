import { Image, Text, View } from "@tarojs/components";
import { CardCatalogItem } from "../../mockData";
import styles from "./index.module.less";

type CardTileProps = {
  card: CardCatalogItem;
  cornerLabel?: string;
  selected?: boolean;
  plain?: boolean;
  onClick?: () => void;
};

export default function CardTile({ card, cornerLabel, selected = false, plain = false, onClick }: CardTileProps) {
  return <View className={`${styles.cardTile} ${selected ? styles.cardTileSelected : ""} ${plain ? styles.cardTilePlain : ""}`} onClick={onClick}>
    <Image className={styles.cardImage} src={card.image} mode="aspectFill" />
    {cornerLabel ? <Text className={styles.cornerLabel}>{cornerLabel}</Text> : null}
    {selected ? <Text className={styles.selectedMark}>✓</Text> : null}
    <Text className={`${styles.cardName} ${card.name === "命运之轮" ? styles.cardNameCompact : ""}`}>{card.name}</Text>
  </View>;
}
