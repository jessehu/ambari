/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.ambari.common.rest.entities.agent;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * 
 * Data model for Ambari Agent to send heartbeat to Ambari Controller.
 *
 */
@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {"responseId","timestamp", "clusterId", 
    "hostname", "bluePrintName", "bluePrintRevision", "hardwareProfile", 
    "actionResults", "serversStatus", "idle"})
public class HeartBeat {
  @XmlElement
  private String responseId;
  @XmlElement
  private String clusterId;
  @XmlElement
  private long timestamp;
  @XmlElement
  private String hostname;
  @XmlElement
  private String bluePrintName;
  @XmlElement
  private String bluePrintRevision;
  @XmlElement
  private HardwareProfile hardwareProfile;
  @XmlElement
  private List<ActionResult> actionResults;
  @XmlElement
  private List<ServerStatus> serversStatus;
  @XmlElement
  private boolean idle;
  
  public String getResponseId() {
    return responseId;
  }
  
  public void setResponseId(String responseId) {
    this.responseId=responseId;
  }
  
  public String getClusterId() {
    return clusterId;
  }
  
  public long getTimestamp() {
    return timestamp;
  }
  
  public String getHostname() {
    return hostname;
  }
  
  public String getBluePrintName() {
    return bluePrintName;
  }
  
  public String getBluePrintRevision() {
    return bluePrintRevision;
  }
    
  public boolean getIdle() {
    return idle;
  }
  
  public HardwareProfile getHardwareProfile() {
    return hardwareProfile;
  }
  
  public List<ActionResult> getActionResults() {
    return actionResults;
  }
  
  public List<ServerStatus> getServersStatus() {
    return serversStatus;
  }
  
  public void setClusterId(String clusterId) {
    this.clusterId = clusterId;
  }

  public void setTimestamp(long timestamp) {
    this.timestamp = timestamp;
  }
  
  public void setHostname(String hostname) {
    this.hostname = hostname;
  }
  
  public void setBluePrintName(String bluePrintName) {
    this.bluePrintName = bluePrintName;
  }
  
  public void setBluePrintRevision(String bluePrintRevision) {
    this.bluePrintRevision = bluePrintRevision;    
  }
  
  public void setActionResults(List<ActionResult> actionResults) {
    this.actionResults = actionResults;
  }

  public void setHardwareProfile(HardwareProfile hardwareProfile) {
    this.hardwareProfile = hardwareProfile;    
  }
  
  public void setServersStatus(List<ServerStatus> serversStatus) {
    this.serversStatus = serversStatus;
  }
  
  public void setIdle(boolean idle) {
    this.idle = idle;
  }
}