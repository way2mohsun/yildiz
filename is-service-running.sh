#!/bin/bash
echo "localhost 9000
#172.16.36.101 8091
localhost 8089" | \
while read host port; do
  r=$(bash -c 'exec 3<> /dev/tcp/'$host'/'$port';echo $?' 2>/dev/null)
  if [ "$r" = "0" ]; then
     #echo $host $port is open
     : # empty command
  else
    echo $host $port is closed
    forever restartall
  fi
done
# log cat /var/spool/mail/root 

tajmi=$(bash -c 'exec 3<> /dev/tcp/localhost/8091;echo $?' 2>/dev/null)
if [ "$tajmi" <> "0" ]; then
    pkill -f maatel-panel-tajmi.jar
    java -jar /root/maatel-panel-tajmi.jar &
fi

while :
do
    o=$(bash -c 'exec 3<> /dev/tcp/172.16.36.101/8091;echo $?' 2>/dev/null)
	if [ "$o" <> "0" ]; then
            echo down
            java -jar /root/maatel-panel-tajmi.jar
        fi
	sleep 3
done