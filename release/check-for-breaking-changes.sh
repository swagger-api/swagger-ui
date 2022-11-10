#!/bin/bash
CURRENT_VERSION=$1
NEXT_VERSION=$2
CURRENT_MAJOR=${CURRENT_VERSION:0:1}
NEXT_MAJOR=${NEXT_VERSION:0:1}

if [ "$CURRENT_MAJOR" -ne "$NEXT_MAJOR" ] ; 
  then if [ "$BREAKING_OKAY" = "true" ];
    then echo "breaking change detected but BREAKING_OKAY is set; continuing." && exit 0;
    else echo "breaking change detected and BREAKING_OKAY is not set; aborting." && exit 1;
  fi;
fi;

echo "next version is not a breaking change; continuing."; 