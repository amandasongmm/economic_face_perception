#!/bin/bash
pkill -f psiturk
psiturk -e "server on"
psiturk -e "debug -p"
