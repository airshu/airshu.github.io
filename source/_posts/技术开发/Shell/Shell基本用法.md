---
title: Shell基本用法
tags: Shell
toc: true
---



basename example.tar.a.b.c.gz .c.gz

# => example.tar.a.b

FILE="example.tar.gz"

echo "${FILE%%.*}"     取头   example

# => example

echo "${FILE%.*}"      去尾   example.tar.a.b.c

# => example.tar

echo "${FILE#*.}"      去头   tar.a.b.c.gz

# => tar.gz

echo "${FILE##*.}"     取尾   gz

# => gz

# 在bash中可以这么写

filename=$(basename "$fullfile")
extension="${filename##*.}"
filename="${filename%.*}"
