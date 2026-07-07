#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "$0")/.." && pwd)/public/tiles/hk"
BASE="https://raw.githubusercontent.com/samoheen/mahjong-tiles/master/hongkong/png"

mkdir -p "$DIR"
cd "$DIR"

echo "Downloading Hong Kong mahjong tiles to $DIR ..."

for i in 1 2 3 4 5 6 7 8 9; do
  n=$(printf "%02d" $((7 + i)))
  curl -sfL "$BASE/${n}-characters-${i}.png" -o "wan${i}.png"
  n=$(printf "%02d" $((16 + i)))
  curl -sfL "$BASE/${n}-circles-${i}.png" -o "tong${i}.png"
  n=$(printf "%02d" $((25 + i)))
  curl -sfL "$BASE/${n}-bamboos-${i}.png" -o "suo${i}.png"
done

curl -sfL "$BASE/04-east-wind.png" -o dong.png
curl -sfL "$BASE/05-south-wind.png" -o nan.png
curl -sfL "$BASE/06-west-wind.png" -o xi.png
curl -sfL "$BASE/07-north-wind.png" -o bei.png
curl -sfL "$BASE/03-red-dragon.png" -o zhong.png
curl -sfL "$BASE/02-green-dragon.png" -o fa.png
curl -sfL "$BASE/01-white-dragon.png" -o bai.png

count=$(ls -1 *.png 2>/dev/null | wc -l | tr -d ' ')
echo "Done. $count tile images ready."
