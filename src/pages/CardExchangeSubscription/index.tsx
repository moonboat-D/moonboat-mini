import { Button, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { getCardExchangeSubscriptionStatus, invalidateCardExchangeSubscriptionStatusCache, recordCardExchangeSubscription } from "../../services/cardExchangeCloud";
import styles from "./index.module.less";

const EXCHANGE_NOTICE_TEMPLATE_ID = "oY82V5jBgWojqtCi07YJF_Hp_ED_6Z6wwUelaz8xKKA";
const EXCHANGE_SUBSCRIPTION_AT_KEY = "moonboat-card-exchange-subscription-at-v1";

const formatUpdatedAt = (updatedAt: string) => {
  const date = new Date(updatedAt);
  const timestamp = date.getTime();
  if (Number.isNaN(timestamp)) return "";

  const elapsed = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;

  const hours = Math.floor(elapsed / 3_600_000);
  if (hours < 24) return `${hours} 小时前`;

  const monthDay = `${date.getMonth() + 1}.${date.getDate()}`;
  return date.getFullYear() === new Date().getFullYear()
    ? monthDay
    : `${date.getFullYear()}.${monthDay}`;
};
export default function CardExchangeSubscription() {
  const { themeClassName } = useTheme();
  const [subscribedAt, setSubscribedAt] = useState<string>(() => {
    try {
      return String(Taro.getStorageSync(EXCHANGE_SUBSCRIPTION_AT_KEY) || "");
    } catch {
      return "";
    }
  });
  const [consumedAt, setConsumedAt] = useState("");
  useEffect(() => {
    getCardExchangeSubscriptionStatus().then((status) => {
      if (status.subscribedAt) setSubscribedAt(status.subscribedAt);
      setConsumedAt(status.consumedAt);
    }).catch(() => {});
  }, []);
  const isSubscribed = Boolean(subscribedAt)
    && (!consumedAt || new Date(consumedAt).getTime() < new Date(subscribedAt).getTime());
  const subscribe = async () => {
    if (isSubscribed) {
      const confirmed = await Taro.showModal({
        title: "确认再次订阅",
        content: "当前已是订阅状态，除非认为订阅状态有误，否则不要重复订阅",
        confirmText: "继续订阅",
      });
      if (!confirmed.confirm) return;
    }
    Taro.showLoading({ title: "正在订阅", mask: true });
    try {
      const result = await Taro.requestSubscribeMessage({ tmplIds: [EXCHANGE_NOTICE_TEMPLATE_ID] });
      const status = result[EXCHANGE_NOTICE_TEMPLATE_ID];
      if (status === "accept") {
        const timestamp = new Date().toISOString();
        await recordCardExchangeSubscription();
        invalidateCardExchangeSubscriptionStatusCache();
        setSubscribedAt(timestamp);
        setConsumedAt("");
        try {
          Taro.setStorageSync(EXCHANGE_SUBSCRIPTION_AT_KEY, timestamp);
        } catch {
          // 本地状态写入失败不影响本次已完成的微信授权。
        }
        Taro.showToast({ title: "已开启换牌通知", icon: "success" });
      }
      else Taro.showToast({ title: "未开启通知", icon: "none" });
    } catch {
      Taro.showToast({ title: "订阅请求失败，请稍后重试", icon: "none" });
    } finally {
      Taro.hideLoading();
    }
  };
  return <View className={`${styles.subscriptionRoot} ${themeClassName}`}>
    <View className={styles.subscriptionContent}>
      <View className={styles.subscriptionHead}><Text className={styles.subscriptionTitle}>消息订阅</Text><Text className={styles.subscriptionBeta}>Beta</Text></View>
      <Text className={styles.subscriptionState}>当前状态：<Text className={`${styles.subscriptionStateValue} ${isSubscribed ? styles.subscriptionStateActive : styles.subscriptionStateInactive}`}>{isSubscribed ? "订阅中" : "未订阅"}</Text></Text>
      {subscribedAt ? <Text className={styles.subscriptionStatus}>{isSubscribed ? `本次订阅已授权：${formatUpdatedAt(subscribedAt)}` : "最近一次订阅已用于发送通知，请再次订阅"}</Text> : null}
      <Text className={styles.subscriptionText}><Text className={styles.subscriptionHintIcon}>✦</Text>开启后，当其他旅行者向你发起换牌请求时，会收到一条微信服务通知。</Text>
      <Text className={styles.subscriptionHint}><Text className={styles.subscriptionHintIcon}>✦</Text>订阅消息需由你主动授权；每次授权通常对应一条换牌通知。</Text>
      <Text className={styles.subscriptionHint}><Text className={styles.subscriptionHintIcon}>✦</Text>微信不提供实时查询他人或当前用户剩余订阅额度的接口，当前订阅状态仅推测。</Text>
      <Text className={styles.subscriptionHint}><Text className={styles.subscriptionHintIcon}>✦</Text>当前功能为 Beta 版，可能存在 BUG，作者可能随时回退该功能。</Text>
      <Button className={styles.subscribeButton} onClick={subscribe}>{subscribedAt ? "再次订阅" : "订阅换牌通知"}</Button>
    </View>
  </View>;
}
