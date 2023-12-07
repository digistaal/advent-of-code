import { INPUT } from "./input";
type Collection<T> = Array<{ value: T; amount: number }>;

function main() {
  const lines = INPUT.split("\n");
  const hands = lines.map((line) => {
    const [cards, bidAmount] = line.split(" ");
    const collection = getCollection(cards.split(""));
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

  if (firstCardIndex < handA.length - 1) {
    return getWinningHand(handA, handB, firstCardIndex + 1);
  }

  return 0;
}

const getCardValue = (card: string) => {
  const valueOrder = [
    "A",
    "K",
    "Q",
    "J",
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

function hasFiveOfAKind<T>(collection: Collection<T>) {
  return collection.some((item) => item.amount === 5);
}

function hasFourOfAKind<T>(collection: Collection<T>) {
  return collection.some((item) => item.amount === 4);
}

function hasThreeOfAKind<T>(collection: Collection<T>) {
  return collection.some((item) => item.amount === 3);
}

function getPairValue<T>(collection: Collection<T>, excludedValues: T[] = []) {
  return collection.find(
    (item) => item.amount === 2 && excludedValues.includes(item.value) === false
  )?.value;
}

function hasPair<T>(collection: Collection<T>) {
  return !!getPairValue(collection);
}

function hasFullHouse<T>(collection: Collection<T>) {
  const threeOfAKind = collection.find((item) => item.amount === 3);

  return threeOfAKind && !!getPairValue(collection, [threeOfAKind.value, "J"]);
}

function hasTwoPair<T>(collection: Collection<T>) {
  const firstPair = getPairValue(collection);

  return (
    firstPair &&
    getPairValue(collection, [firstPair]) &&
    !hasFullHouse(collection)
  );
}

function getSetValue<T>(collection: Collection<T>) {
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

function getCollection<T>(input: T[]) {
  return input.reduce<Collection<T>>((collection, item) => {
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
