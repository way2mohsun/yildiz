wget -qO- "http://localhost:9000/mo?tel=989105382721&scode=9830568&text=30+off";
wget -qO- "http://localhost:9000/mo?tel=989105382721&scode=9830568&text=30";

for i in {1..100}
do
   wget -qO- "http://localhost:9000/mo?tel=989105382721&scode=9830568&text=1";
   #wget -qO- "http://localhost:9000/mo?tel=989105382721&scode=9830568&text=30+off";
   #wget -qO- "http://localhost:9000/mo?tel=989105382721&scode=9830568&text=30";
done
wget -qO- "http://localhost:9000/mo?tel=989105382721&scode=9830568&text=30+off";