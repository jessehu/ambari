#!/usr/bin/env python

'''
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
'''

import json
from Hardware import Hardware
from ActionQueue import ActionQueue
from ServerStatus import ServerStatus
import socket
import time

class Heartbeat:

  def __init__(self, actionQueue):
    self.actionQueue = actionQueue
    self.hardware = Hardware()

  def build(self, id='unknown'):
    global clusterId, bluePrintName, bluePrintRevision
    serverStatus = ServerStatus()
    timestamp = int(time.time()*1000)
    heartbeat = { 'responseId'        : id,
                  'timestamp'         : timestamp,
                  'clusterId'         : self.actionQueue.getClusterId(),
                  'bluePrintName'     : self.actionQueue.getBluePrintName(),
                  'bluePrintRevision' : self.actionQueue.getBluePrintRevision(),
                  'hostname'          : socket.gethostname(),
                  'hardwareProfile'   : self.hardware.get(),
                  'actionResults'     : self.actionQueue.result(),
                  'serversStatus'     : serverStatus.build(),
                  'idle'              : self.actionQueue.isIdle()
                }
    return heartbeat

def main(argv=None):
  actionQueue = ActionQueue()
  heartbeat = Heartbeat(actionQueue)
  print json.dumps(heartbeat.build())

if __name__ == '__main__':
  main()