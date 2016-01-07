function checkStreams()
{
	chrome.storage.sync.get({
		streams: ""
	}, function (options) {
		var s = options.streams;
		var streams = s.split("\n");
		for (var i = 0; i < streams.length; i++)
		{
			if (streams[i].length > 0)
			{
				var url = streams[i];
				for (var k in modules)
				{
					if (modules[k].check(url))
					{
						modules[k].display(url);
						break;
					}
				}
			}
		}
	});
}

function addOfflineElement(profile, server)
{
	var e = document.createElement("div");
	e.setAttribute("class", "streamOff link");
	e.setAttribute("data-profile", profile);
	e.addEventListener("click", function () {
		modules[server].openStream(this.getAttribute('data-profile'));
	}, false);
	e.innerHTML = profile;

	document.getElementById("offlineList").appendChild(e);
	var offlineNumber = document.getElementById('offline');
	offlineNumber.innerHTML = parseInt(offlineNumber.innerHTML) + 1;
}

function addOnlineElement(profile, server, _img, _title, _name, _game)
{
	var e = document.createElement("a");
	e.setAttribute("class", "streamOn");
	e.setAttribute("data-profile", profile);

	var img = document.createElement("img");
	img.setAttribute("class", "preview pointer");
	img.setAttribute("width", "80");
	img.setAttribute("height", "45");
	img.setAttribute("alt", "preview");
	img.setAttribute("src", "assets/play.png");
	img.setAttribute("style", "background-image:url('" + _img + "')");
	img.addEventListener("click", function () {
		modules[server].openStream(this.parentNode.getAttribute('data-profile'));
	}, false);

	var desc = document.createElement("div");
	desc.setAttribute("class", "description");

	var title = document.createElement("span");
	title.setAttribute("class", "link title");
	title.innerHTML = _title;
	title.addEventListener("click", function () {
		modules[server].openStream(this.parentNode.parentNode.getAttribute('data-profile'));
	}, false);

	var name = document.createElement("span");
	name.setAttribute("class", "username");
	name.innerHTML = _name;

	var playing = document.createElement("span");
	playing.setAttribute("class", "playing");
	playing.innerHTML = ' ' + chrome.i18n.getMessage("playingTo") + ' ';

	var game = document.createElement("span");
	game.setAttribute("class", "game");
	game.innerHTML = _game;

	var miniPlayer = document.createElement("div");
	miniPlayer.setAttribute("class", "link");
	miniPlayer.innerHTML = chrome.i18n.getMessage("openMiniPlayer");
	miniPlayer.addEventListener("click", function () {
		openMiniPlayer(profile, server);
	}, false);

	desc.appendChild(title);
	desc.appendChild(name);
	desc.appendChild(playing);
	desc.appendChild(game);
	desc.appendChild(miniPlayer);

	e.appendChild(img);
	e.appendChild(desc);

	document.getElementById("onlineList").appendChild(e);
	var onlineNumber = document.getElementById('online');
	onlineNumber.innerHTML = parseInt(onlineNumber.innerHTML) + 1;
}

function openMiniPlayer(profile, server)
{
	chrome.management.get("ocmhnldnkkmebkncidbfangifbabjfdb", function (r) {
		if (r && r.enabled)
			chrome.runtime.sendMessage("ocmhnldnkkmebkncidbfangifbabjfdb", {server: server, profile: profile});
		else
		{
			chrome.management.get("glccgoppknfoonfajicijebeaedpnkfp", function (r) {
				if (r && r.enabled)
					chrome.runtime.sendMessage("glccgoppknfoonfajicijebeaedpnkfp", {server: server, profile: profile});
				else
					chrome.tabs.create({url: "https://chrome.google.com/webstore/detail/glccgoppknfoonfajicijebeaedpnkfp"});
			});
		}
	});
}

function main()
{
	checkStreams();
}

window.addEventListener("DOMContentLoaded", main, false);