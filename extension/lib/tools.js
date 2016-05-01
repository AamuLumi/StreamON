/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 * 
 * Author : HackJack https://github.com/Jack3113
 */

/* global chrome */

var tools = {
	getProfileName: function (url) {
		var n = url.lastIndexOf("/");
		if (n === (url.length - 1))
			return tools.getProfileName(url.substring(0, url.length - 1));
		else
			return url.substring(n + 1);
	},
	openTab: function (pattern, url) {
		chrome.tabs.query({url: pattern}, function (a) {
			if (a.length < 1) // Si la page n'est pas déjà ouverte, on ouvre un nouvel onglet
				chrome.tabs.create({url: url});
			else // Sinon on passe le focus sur la premiere page contenant le pattern
				chrome.tabs.highlight({windowId: a[0].windowId, tabs: a[0].index});
		});
	},
	openMiniPlayer: function (url, resolution) {
		var idDevMiniPlayer = "ocmhnldnkkmebkncidbfangifbabjfdb";
		var idMiniPlayer = "glccgoppknfoonfajicijebeaedpnkfp";
		var options = {url: url};
		if (resolution)
			options.resolution = resolution;
		chrome.management.get(idDevMiniPlayer, function (r) {
			if (r && r.enabled)
				chrome.runtime.sendMessage(idDevMiniPlayer, options);
			else {
				chrome.management.get(idMiniPlayer, function (r) {
					if (r && r.enabled)
						chrome.runtime.sendMessage(idMiniPlayer, options);
					else
						chrome.tabs.create({url: "https://chrome.google.com/webstore/detail/" + idMiniPlayer});
				});
			}
		});
	}
};

var modules = {};

