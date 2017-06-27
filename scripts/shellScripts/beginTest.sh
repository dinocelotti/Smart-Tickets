nohup testrpc > ./output/testRpcOutput.txt 2>&1 &
echo $! > ./output/testRpcPid.txt
nohup truffle migrate  > ./output/truffleMigrateOutput.txt 2>&1 &
