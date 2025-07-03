#!/bin/bash
cd /home/kavia/workspace/code-generation/cluequest-cartoon-crime-chronicles-104891-ed3ceb4c/game_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

