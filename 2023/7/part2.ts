import { INPUT } from "./input";
type Collection = Array<{ value: string; amount: number }>;

function main() {
  const lines = INPUT.split("\n");
  const hands = lines.map((line) => {
    const [cards, bidAmount] = line.split(" ");
    const collection = createCollection(cards.split(""));
    return {
      cards,
      bidAmount: Number(bidAmount),
      highestSet: getSetValue(collection),
    };
  });

  const sortedHands = hands.sort((a, b) => {
    const setDiff = b.highestSet - a.highestSet;

    if (setDiff !== 0) {
      return setDiff;
    }

    return getWinningHand(b.cards.split(""), a.cards.split(""), 0);
  });

  const scores = sortedHands.map((hand, index) => {
    const rank = sortedHands.length - index;
    const score = rank * hand.bidAmount;

    return {
      ...hand,
      score,
      rank,
    };
  });

  const totalScores = scores.reduce((total, score) => total + score.score, 0);

  console.log({ totalScores, scores });
}

function getWinningHand(
  handA: string[],
  handB: string[],
  firstCardIndex: number
) {
  const cardA = handA[firstCardIndex];
  const cardB = handB[firstCardIndex];

  const cardDiff = getCardValue(cardA) - getCardValue(cardB);

  if (cardDiff !== 0) {
    return cardDiff;
  }

  if (handA[firstCardIndex + 1] !== undefined) {
    return getWinningHand(handA, handB, firstCardIndex + 1);
  }

  return 0;
}

const getCardValue = (card: string) => {
  const valueOrder = [
    "A",
    "K",
    "Q",
    "T",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
    "J",
  ];

  return valueOrder.length - valueOrder.indexOf(card);
};

function getJokerAmount(collection: Collection) {
  return collection.find((item) => item.value === "J")?.amount || 0;
}

function hasFiveOfAKind(collection: Collection) {
  const jokerAmount = getJokerAmount(collection);

  return collection.some((item) => {
    if (item.value === "J") {
      return jokerAmount === 5;
    }

    return item.amount + jokerAmount === 5;
  });
}

function hasFourOfAKind(collection: Collection) {
  const jokerAmount = getJokerAmount(collection);
  return collection.some((item) => {
    if (item.value === "J") {
      return jokerAmount === 4;
    }

    return item.amount + jokerAmount === 4;
  });
}

function hasThreeOfAKind(collection: Collection) {
  const jokerAmount = getJokerAmount(collection);
  return collection.some((item) => {
    if (item.value === "J") {
      return jokerAmount === 4;
    }

    return item.amount + jokerAmount === 3;
  });
}

function getPairValue(collection: Collection, excludedValues: string[] = []) {
  const jokerAmount = excludedValues.includes("J")
    ? 0
    : getJokerAmount(collection);

  return collection.find((item) => {
    if (item.value === "J") {
      return jokerAmount === 2;
    }

    return (
      item.amount + jokerAmount === 2 &&
      excludedValues.includes(item.value) === false
    );
  })?.value;
}

function hasPair(collection: Collection) {
  return !!getPairValue(collection);
}

function hasFullHouse(collection: Collection) {
  const jokerAmount = getJokerAmount(collection);
  const threeOfAKind = collection.find((item) => {
    if (item.value === "J") {
      return jokerAmount === 3;
    }

    return item.amount + jokerAmount === 3;
  });

  return threeOfAKind && !!getPairValue(collection, [threeOfAKind.value, "J"]);
}

function hasTwoPair(collection: Collection) {
  const firstPair = getPairValue(collection);

  return (
    firstPair &&
    getPairValue(collection, [firstPair, "J"]) &&
    !hasFullHouse(collection)
  );
}

function getSetValue(collection: Collection) {
  if (hasFiveOfAKind(collection)) {
    return 7;
  }

  if (hasFourOfAKind(collection)) {
    return 6;
  }

  if (hasFullHouse(collection)) {
    return 5;
  }

  if (hasThreeOfAKind(collection)) {
    return 4;
  }

  if (hasTwoPair(collection)) {
    return 3;
  }

  if (hasPair(collection)) {
    return 2;
  }

  return 1;
}

function createCollection(input: T[]) {
  return input.reduce<Collection>((collection, item) => {
    const itemIndex = collection.findIndex((i) => i.value === item);

    if (itemIndex !== -1) {
      collection[itemIndex].amount++;
    } else {
      collection.push({ value: item, amount: 1 });
    }

    return collection;
  }, []);
}

main();
