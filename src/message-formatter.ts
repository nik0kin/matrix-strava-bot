import { Settings } from './settings';
import { capitalizeFirstLetter } from './string-util';

// "Rare Costume Top: Hatchling - 4500K"
export function getShopItemString(item: any, settings: Settings, htmlFormatted: boolean) {
  // const rarityEmoji = settings.emoji ? getRarityEmoji(item.rarity) : '';
  // const typeEmoji = settings.emoji ? getTypeEmoji(item.type) : '';
  // const currencyEmoji = settings.emoji ? getCurrencyEmoji(item.currency) : '';

  const rarity = capitalizeFirstLetter(item.rarity);

  const itemLink = '';
  const name = settings.links
    ? !htmlFormatted ? `[${item.name}](${itemLink})` : `<a href="${itemLink}">${item.name}</a>`
    : item.name;

  return `${rarity}: ${name}`;
}


