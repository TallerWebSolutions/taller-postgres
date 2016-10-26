#!/bin/bash

while ! nc -q 1 database 5432 </dev/null; do sleep 3; done

echo ""
echo "------------------------------"
echo "----- Database connected -----"
echo "------------------------------"
echo ""

echo ""
echo "------------------------------"
echo "Virtual Marchine ready to work"
echo "------------------------------"
echo ""

exec "$@"
