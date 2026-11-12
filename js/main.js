"use strict";

const nftData = [
  {
    id: 1,
    title: "Обь - важная шишка",
    author: {
      name: "Анна Орловская",
      avatar: "images/avatar-anya.jpg"
    },
    network: "Ethereum",
    price: 0.25,
    bids: 12,
    category: "Живопись и графика",
    image: "images/image 1 (anya).jpg",
    isAuction: true,
    tags: ["котики", "рисунок"]
  },
  {
    id: 2,
    title: "Котик Канючка",
    author: {
      name: "Дарья Штром",
      avatar: "images/avatar-dasha.jpg"
    },
    network: "Polygon",
    price: 0.12,
    bids: 8,
    category: "Живопись и графика",
    image: "images/image 2 (dasha).jpg",
    isAuction: true,
    tags: ["котики", "рисунок"]
  },
  {
    id: 3,
    title: "Братик Канючка и сестренка Погоныш",
    author: {
      name: "Анна Орловская",
      avatar: "images/avatar-anya.jpg"
    },
    network: "Solana",
    price: 0.08,
    bids: 5,
    category: "Живопись и графика",
    image: "images/image 3 (anya).jpg",
    isAuction: true,
    tags: ["котики", "рисунок"]
  },
  {
    id: 4,
    title: "Мама Обь с сыном Канючкой",
    author: {
      name: "Анна Орловская",
      avatar: "images/avatar-anya.jpg"
    },
    network: "Ethereum",
    price: 0.30,
    bids: 17,
    category: "Живопись и графика",
    image: "images/image 4 (anya).jpg",
    isAuction: true,
    tags: ["котики", "рисунок"]
  },
  {
    id: 5,
    title: "Погоныш",
    author: {
      name: "Анна Орловская",
      avatar: "images/avatar-anya.jpg"
    },
    network: "Ethereum",
    price: 0.18,
    bids: 6,
    category: "Живопись и графика",
    image: "images/image 5 (anya).jpg",
    isAuction: true,
    tags: ["котики", "рисунок"]
  },
  {
    id: 6,
    title: "Мама с любимой дочкой",
    author: {
      name: "Анна Орловская",
      avatar: "images/avatar-anya.jpg"
    },
    network: "Polygon",
    price: 0.15,
    bids: 9,
    category: "Живопись и графика",
    image: "images/image 6 (anya).jpg",
    isAuction: true,
    tags: ["котики", "рисунок"]
  },
  {
    id: 7,
    title: "Мама Обь и папа Ягодник",
    author: {
      name: "Дарья Штром",
      avatar: "images/avatar-dasha.jpg"
    },
    network: "Solana",
    price: 0.11,
    bids: 7,
    category: "Живопись и графика",
    image: "images/image 7 (dasha).jpg",
    isAuction: true,
    tags: ["котики", "рисунок"]
  },
  {
    id: 8,
    title: "Тёплый вечер",
    author: {
      name: "Мария Лебедева",
      avatar: "images/avatar-maria.svg"
    },
    network: "Ethereum",
    price: 0.22,
    bids: 14,
    category: "Генеративное искусство",
    image: "images/image 8.png",
    isAuction: true,
    tags: ["цифровое искусство", "пейзаж"]
  },
  {
    id: 9,
    title: "Неоновый город",
    author: {
      name: "Игорь Соколов",
      avatar: "images/avatar-igor.svg"
    },
    network: "Ethereum",
    price: 0.40,
    bids: 21,
    category: "Генеративное искусство",
    image: "images/image 9.png",
    isAuction: true,
    tags: ["цифровое искусство", "город"]
  },
  {
    id: 10,
    title: "Ночные огни",
    author: {
      name: "Игорь Соколов",
      avatar: "images/avatar-igor.svg"
    },
    network: "Polygon",
    price: 0.09,
    bids: 4,
    category: "Генеративное искусство",
    image: "images/image 10.png",
    isAuction: true,
    tags: ["цифровое искусство", "город"]
  },
  {
    id: 11,
    title: "Цифровая роща",
    author: {
      name: "Мария Лебедева",
      avatar: "images/avatar-maria.svg"
    },
    network: "Ethereum",
    price: 0.35,
    bids: 25,
    category: "Генеративное искусство",
    image: "images/image 11.png",
    isAuction: true,
    tags: ["цифровое искусство", "лес"]
  },
  {
    id: 12,
    title: "Розовое небо",
    author: {
      name: "Мария Лебедева",
      avatar: "images/avatar-maria.svg"
    },
    network: "Solana",
    price: 0.14,
    bids: 10,
    category: "Генеративное искусство",
    image: "images/image 12.png",
    isAuction: true,
    tags: ["цифровое искусство", "небо"]
  },
  {
    id: 13,
    title: "Синие волны",
    author: {
      name: "Мария Лебедева",
      avatar: "images/avatar-maria.svg"
    },
    network: "Polygon",
    price: 0.16,
    bids: 11,
    category: "Генеративное искусство",
    image: "images/image 13.png",
    isAuction: true,
    tags: ["цифровое искусство", "море"]
  },
  {
    id: 14,
    title: "Город будущего",
    author: {
      name: "Игорь Соколов",
      avatar: "images/avatar-igor.svg"
    },
    network: "Ethereum",
    price: 0.28,
    bids: 19,
    category: "Генеративное искусство",
    image: "images/image 14.png",
    isAuction: true,
    tags: ["цифровое искусство", "город"]
  },
  {
    id: 15,
    title: "Цифровой закат",
    author: {
      name: "Мария Лебедева",
      avatar: "images/avatar-maria.svg"
    },
    network: "Solana",
    price: 0.10,
    bids: 3,
    category: "Генеративное искусство",
    image: "images/image 15.png",
    isAuction: true,
    tags: ["цифровое искусство", "закат"]
  }
];

const networkInfo = {
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
const createElement = (tag, className, text) => {
  const element = document.createElement(tag);

  element.setAttribute("class", className);

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
};

// Класс NFT-токена.
class NFT {
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

    link.setAttribute("href", "detail.html");
    linkWrapper.append(link);

    card.append(
      media,
      title,
      summary,
      network,
      bids,
      linkWrapper
    );

    return card;
  }
}

// Отрисовка каталога.
const renderCatalog = (data, container) => {
  const tokens = data.map((item) => new NFT(item));

  const categories = [
    ...new Set(
      tokens.map((token) => token.category)
    )
  ];

  container.replaceChildren();

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

// Сумма цен токенов Ethereum.
const getEthereumVolume = (data) => {
  const total = data
    .filter((token) => token.network === "Ethereum")
    .reduce((sum, token) => sum + token.price, 0);

  return Number(total.toFixed(4));
};

// Токен с максимальным количеством ставок.
const getMostBidToken = (data) => {
  return data.reduce((leader, token) => {
    if (leader === null || token.bids > leader.bids) {
      return token;
    }

    return leader;
  }, null);
};

// Вывод аналитики.
const printAnalytics = (data) => {
  console.log(
    "Суммарный объём торгов Ethereum (сумма текущих цен):",
    getEthereumVolume(data),
    "ETH"
  );

  console.log(
    "Токен с наибольшим количеством ставок:",
    getMostBidToken(data)
  );
};

// Генерация карточек только на странице каталога.
const catalogContainer = document.querySelector(
  "#catalog-container"
);

if (catalogContainer) {
  renderCatalog(nftData, catalogContainer);
  printAnalytics(nftData);
}

// Замена логотипов также на статичной детальной странице.
document.querySelectorAll(".card__network").forEach((image) => {
  const network = Object.keys(networkInfo).find(
    (name) => image.getAttribute("alt") === `Сеть ${name}`
  );

  if (network) {
    image.setAttribute("src", networkInfo[network].logo);
  }
});