echo "killing $(cat ./output/testRpcPid.txt)" >> ./output/killResults.txt
echo  $(ps $(cat ./output/testRpcPid.txt)) >> ./output/killResults.txt
kill $(cat ./output/testRpcPid.txt) 
rm ./output/testRpcPid.txt