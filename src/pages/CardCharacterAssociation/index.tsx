import { Button, Image, Text, View } from "@tarojs/components";
import { useState } from "react";
import { getCharacterAvatar } from "./avatars";
import CardTile from "../CardExchangeMarket/components/CardTile";
import { cardCatalog } from "../CardExchangeMarket/mockData";
import { cardCharacterAssociations, ElementId, elements } from "./data";
import marketStyles from "../CardExchangeMarket/index.module.less";
import styles from "./index.module.less";

function ElementIcon({ element }: { element: typeof elements[number] }) {
  return element.image
    ? <Image className={styles.elementIcon} src={element.image} mode="aspectFit" />
    : <Text className={styles.elementFallback} style={{ color: element.color }}>{element.name}</Text>;
}

function CharacterAvatar({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);
  const image = getCharacterAvatar(name);
  return <View className={styles.character} aria-label={name}>
    {image && !failed ? <Image className={styles.avatar} src={image} mode="aspectFit" onError={() => setFailed(true)} /> : <View className={styles.avatarFallback}>{name.slice(0, 1)}</View>}
  </View>;
}

export default function CardCharacterAssociation() {
  const [selected, setSelected] = useState<ElementId[]>(() => elements.map((element) => element.id));
  const visibleElements = elements.filter((element) => selected.includes(element.id));
  const toggle = (id: ElementId) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return <View className={marketStyles.marketRoot}>
    <View className={`${marketStyles.notice} ${marketStyles.friendly}`}><Text className={marketStyles.noticeIcon}>✦</Text><Text className={marketStyles.noticeText}>第3、6幕出战角色可能影响卡牌产出，数据仅供参考</Text></View>
    <View className={styles.filterBar}>
      <View className={styles.filters}>{elements.map((element) => <Button key={element.id} aria-label={`${element.name}元素${selected.includes(element.id) ? "，已选中" : "，未选中"}`} className={`${styles.elementButton} ${selected.includes(element.id) ? styles.selected : ""}`} onClick={() => toggle(element.id)}>
        <ElementIcon element={element} />{selected.includes(element.id) ? <Text className={styles.check}>✓</Text> : null}
      </Button>)}</View>
      <Button className={marketStyles.resetButton} onClick={() => setSelected(elements.map((element) => element.id))}>重置</Button>
    </View>
    <View className={styles.list}>{visibleElements.length ? cardCatalog.map((card) => <View key={card.id} className={styles.cardBox}>
      <View className={styles.cardArtwork}><CardTile card={card} /></View>
      <View className={styles.rows}>{visibleElements.map((element) => {
        const names = cardCharacterAssociations[card.id][element.id];
        return <View key={element.id} className={styles.elementRow} style={{ backgroundColor: element.background }}>
          <ElementIcon element={element} />
          <View className={styles.characters}>{names.map((name) => <CharacterAvatar key={name} name={name} />)}</View>
        </View>;
      })}</View>
    </View>) : <View className={marketStyles.emptyState}>请选择要展示的元素</View>}</View>
  </View>;
}
