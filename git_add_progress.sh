#!/bin/bash

files=$(git ls-files --others --exclude-standard) 
tracked=$(git ls-files -m)
all_files=($files $tracked)

total=${#all_files[@]}
count=0

echo "Ajout des fichiers dans Git..."

for f in "${all_files[@]}"; do
  git add "$f"
  count=$((count+1))
  percent=$((count * 100 / total))
  echo -ne "Progression: $percent% ($count/$total)\r"
done

echo -e "\nTous les fichiers ont été ajoutés !"

