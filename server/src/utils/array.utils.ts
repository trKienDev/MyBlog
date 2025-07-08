import seedrandom from "seedrandom";

function seedShuffle<T>(array: T[], seed: string): T[] {
      const rng = seedrandom(seed);
      const result = [...array];
      let currentIndex = result.length;
      let randomIndex: number;

      // Fisher-Yates
      while(currentIndex !== 0) {
            randomIndex = Math.floor(rng() * currentIndex);
            currentIndex--;

            // hoán đổi với phtu hiện tại
            [result[currentIndex], result[randomIndex]] = [
                  result[randomIndex], result[currentIndex]
            ];
      }

      return result;
}

const array_utils = {
      seedShuffle
}
export default array_utils;