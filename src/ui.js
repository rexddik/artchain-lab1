export const networkInfo = {
  Ethereum: {
    currency: "ETH",
    logo: "images/logo/ethereum.png"
  },
  Polygon: {
    currency: "POL",
    logo: "images/logo/polygon.png"
  },
  Solana: {
    currency: "SOL",
    logo: "images/logo/solana.png"
  }
};

// Создание DOM-элемента с классом и текстом.
export const createElement = (tag, className, text) => {
  const element = document.createElement(tag);

  element.setAttribute("class", className);

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
};

// Класс NFT-токена.
export class NFT {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.author = data.author;
    this.network = data.network;
    this.price = data.price;
    this.bids = data.bids;
    this.category = data.category;
    this.image = data.image;
    this.isAuction = data.isAuction;
    this.tags = data.tags;
  }

  getFormattedPrice() {
    const price = new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: 4
    }).format(this.price);

    const currency = networkInfo[this.network].currency;

    return `${price} ${currency}`;
  }

  render() {
    const card = createElement(
      "article",
      "section__card card"
    );

    card.dataset.id = this.id;

    // Изображение работы.
    const media = createElement(
      "div",
      "card__media"
    );

    const image = createElement(
      "img",
      "card__image"
    );

    image.setAttribute("src", this.image);
    image.setAttribute(
      "alt",
      `Работа «${this.title}»`
    );
    image.setAttribute("width", "640");
    image.setAttribute("height", "360");

    // Логотип сети.
    const networkLogo = createElement(
      "img",
      "card__network"
    );

    networkLogo.setAttribute(
      "src",
      networkInfo[this.network].logo
    );
    networkLogo.setAttribute(
      "alt",
      `Сеть ${this.network}`
    );
    networkLogo.setAttribute("width", "36");
    networkLogo.setAttribute("height", "36");

    media.append(image, networkLogo);

    // Название.
    const title = createElement(
      "h3",
      "card__title",
      `«${this.title}»`
    );

    // Автор и ставка.
    const summary = createElement(
      "div",
      "card__summary"
    );

    const author = createElement(
      "div",
      "card__author"
    );

    const avatar = createElement(
      "img",
      "card__avatar"
    );

    avatar.setAttribute("src", this.author.avatar);
    avatar.setAttribute("alt", "");
    avatar.setAttribute("width", "48");
    avatar.setAttribute("height", "48");

    const authorText = createElement(
      "p",
      "card__text",
      "Автор: "
    );

    const authorName = createElement(
      "strong",
      "card__emphasis",
      this.author.name
    );

    authorText.append(authorName);
    author.append(avatar, authorText);

    const bid = createElement(
      "p",
      "card__bid",
      "Текущая ставка: "
    );

    const price = createElement(
      "strong",
      "card__emphasis",
      this.getFormattedPrice()
    );

    bid.append(price);
    summary.append(author, bid);

    // Сведения о токене.
    const network = createElement(
      "p",
      "card__text",
      `Сеть блокчейна: ${this.network}`
    );

    const bids = createElement(
      "p",
      "card__text",
      `Количество ставок: ${this.bids}`
    );

    const linkWrapper = createElement(
      "p",
      "card__text"
    );

    const link = createElement(
      "a",
      "card__link",
      "Подробнее о работе"
    );

    link.setAttribute("href", `detail.html?id=${encodeURIComponent(this.id)}`);
    linkWrapper.append(link);

    const bidButton = createElement("button", "bid-form__button", "Сделать ставку");
    bidButton.type = "button";
    bidButton.dataset.action = "bid";
    bidButton.disabled = !this.isAuction;

    card.append(
      media,
      title,
      summary,
      network,
      bids,
      linkWrapper,
      bidButton
    );

    return card;
  }
}

// Отрисовка каталога.
export const renderCatalog = (data, container) => {
  const tokens = data.map((item) => new NFT(item));

  const categories = [
    ...new Set(
      tokens.map((token) => token.category)
    )
  ];

  container.replaceChildren();
  if (!tokens.length) {
    container.append(createElement("p", "content__text", "В галерее пока нет NFT."));
    return;
  }

  categories.forEach((category) => {
    const section = createElement(
      "section",
      "content__section section"
    );

    const title = createElement(
      "h2",
      "section__title",
      category
    );

    const gallery = createElement(
      "div",
      "section__gallery"
    );

    tokens
      .filter((token) => token.category === category)
      .forEach((token) => {
        gallery.append(token.render());
      });

    section.append(title, gallery);
    container.append(section);
  });
};


export const setMessage = (node, message, error = false) => {
  if (!node) return;
  node.textContent = message;
  node.classList.toggle("request-status--error", error);
};

export const fillTokenSelect = (select, tokens, preferredId) => {
  if (!select) return;
  const selected = preferredId || select.value;
  select.replaceChildren();
  for (const token of tokens.filter((item) => item.isAuction)) {
    const option = document.createElement("option");
    option.value = token.id;
    option.textContent = `${token.title} — ${token.price} ${networkInfo[token.network].currency}`;
    select.append(option);
  }
  if ([...select.options].some((option) => option.value === selected)) select.value = selected;
};
