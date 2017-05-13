import sys, json;

#data = json.load(sys.stdin)

dataToSendBack = {'element': 1}

json_dataToSendBack = json.dumps(dataToSendBack)

print (json_dataToSendBack)
