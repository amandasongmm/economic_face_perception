#!/bin/bash
pkill -f psiturk
psiturk -e "mode sdbx"
psiturk -e "server on"
psiturk -e "hit create 10 .04 1"
