mkdir -p ./output
nohup testrpc > ./output/testRpcOutput.txt 2>&1 &
pid=$!
echo "$(jobs -l)" >> ./output/killResults.txt
echo $pid > ./output/testRpcPid.txt
nohup truffle migrate --reset  > ./output/truffleMigrateOutput.txt 2>&1 &
