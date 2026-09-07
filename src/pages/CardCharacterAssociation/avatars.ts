import { roleList } from "../genshin/constants";

// 仅用于查找头像，页面仍显示 Sheet1 中的原始角色名。
const avatarNames: Record<string, string> = { "干织": "千织", "少女": "哥伦比娅", "枫原万叶": "万叶" };
const additionalAvatarIds: Record<string, string> = {
  "丽莎": "Lisa", "久岐忍": "Shinobu", "九条裟罗": "Sara", "云堇": "Yunjin", "五郎": "Gorou",
  "伊安珊": "Iansan", "伊法": "Ifa", "凝光": "Ningguang", "凯亚": "Kaeya", "北斗": "Beidou",
  "卡维": "Kaveh", "卡齐娜": "Kachina", "嘉明": "Gaming", "坎蒂丝": "Candace", "夏沃蕾": "Chevreuse",
  "夏洛蒂": "Charlotte", "多莉": "Dori", "安柏": "Amber", "托马": "Tohma", "早柚": "Sayu",
  "柯莱": "Collei", "欧洛伦": "Ororon", "烟绯": "Feiyan", "爱诺": "Aino", "珐露珊": "Faruzan",
  "班尼特": "Bennett", "琳妮特": "Lynette", "瑶瑶": "Yaoyao", "砂糖": "Sucrose", "米卡": "Mika",
  "绮良良": "Momoka", "罗莎莉亚": "Rosaria", "莱依拉": "Layla", "菲米尼": "Freminet", "菲谢尔": "Fischl",
  "蓝砚": "Lanyan", "行秋": "Xingqiu", "诺艾尔": "Noel", "赛索斯": "Sethos", "辛焱": "Xinyan",
  "迪奥娜": "Diona", "重云": "Chongyun", "雷泽": "Razor", "香菱": "Xiangling", "鹿野院平藏": "Heizo",
};
const protagonistImage = "https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2025/01/05/157749474/75bb898fe1c3b4ed29a2931829ddb845_998097527747088629.png";
const additionalAvatarImages: Record<string, string> = {
  "雅珂达": "https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin/2025/12/01/19708bac6eba4779a70908bf0bee70b1_1653339605275422455.png",
  "布伦妮": "https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin/2026/05/19/51e83d3537b37acc3f422910fe5bef82_3083259311239382441.png",
  "叶洛亚": "https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin/2026/01/29/d585407867aa47b4d925613cea9f00c2_5864597966579326880.png",
  "欧洛伦": "https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin/2024/11/18/e4830690f8b6a1ebb02cfbc8ce955671_8091252479018770784.png",
  "安柏": "https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2024/05/22/327628065/5e5c09879e341005a84671eb0032f826_5260597144803269830.png",
  "琳妮特": "https://upload-static.hoyoverse.com/hoyolab-wiki/2023/08/16/47826599/436e6f2b9b9006bfe511a98093259daf_7341100649284369969.png",
};

export function getCharacterAvatar(name: string): string {
  if (name === "空/荧") return protagonistImage;
  if (additionalAvatarImages[name]) return additionalAvatarImages[name];
  const role = roleList.find((item) => item.name === (avatarNames[name] || name));
  if (role?.imageUrl) return role.imageUrl;
  const id = role?.englishName || additionalAvatarIds[name];
  return id && !id.includes("NO-PIC-") ? `https://ys.appfeng.com/ui/avatar/UI_AvatarIcon_${id}.png` : "";
}
