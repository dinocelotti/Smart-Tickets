nohup testrpc > testRpcOutput.txt 2>&1 &
echo $! > testRpcPid.txt
nohup truffle migrate  > truffleMigrateOutput.txt 2>&1 &
