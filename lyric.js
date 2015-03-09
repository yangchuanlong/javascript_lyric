var audio = document.getElementById('audio');
var lyric = document.getElementById('lyric').innerHTML;
var interval = '';

//audio play event
function audio_play()
{
	interval = setInterval(rollLyric, 1500);
}

//audio pause event
function audio_pause()
{
	clearInterval(interval);
}

if(window.attachEvent)
{
	audio.attachEvent('onplay', audio_play);
	audio.attachEvent('onpause', audio_pause);
}
else
{
	audio.addEventListener('play', audio_play);
	audio.addEventListener('pause', audio_pause);
}

//获取时间与歌词对应关系的数组  如第一秒为 '我们都有一个家', 第五秒为'名字叫中国', 则返回的数组为
//[1:'我们都有一个家', 5:'名字叫中国']
function getLyricArr(lyric)
{
	var lyric_arr = lyric.match(/\[([\d]{2}:[\d]{2}\.[\d]{2})\](.*)[\r\n]+/g);
	var lyric_assoc = [];
	var length = lyric_arr.length;
	for(var i=0; i<length; i++)
	{
		var content = lyric_arr[i].substring(10, lyric_arr[i].length - 1); //把末尾的换行符去掉
		if(!content.length) // filter the empty lyric line
		{
			continue;
		}
		var timeline = lyric_arr[i].substr(1, 8);
		var stardard_time = lyricTimeToSecond(timeline);
		lyric_assoc[stardard_time] = content;
	}
	return lyric_assoc;
}

//把如03:00.94格式的时间转化为秒
function lyricTimeToSecond(time)
{
	var minute = time.substr(0, 2);
	var second = time.substr(3, 2);	
	return minute * 60 + second * 1;
}


function lyricToHtml()
{
	var lyric_assoc = getLyricArr(lyric);
	var html = '';
	for(var i in lyric_assoc)
	{
		var p = '<p class="lyric_line" time_line="' + i + '">' + lyric_assoc[i] + '</p>';
		html += p;
	}
	var lyric_container = document.getElementById('lyric_container');
	lyric_container.innerHTML = html;
}

lyricToHtml();

//滚动歌词
function rollLyric()
{
	console.log('rollLyric is invoked');	
	var current_Time = audio.currentTime;
	var lyric_assoc = getLyricArr(lyric);
	var smaller_time = 0; //比当前播放时刻小的一个歌词的timeline
	for(var time_line in lyric_assoc)
	{
		if(time_line <= current_Time)
		{
			smaller_time = time_line;
		}
		else
		{	
			//return smaller_time;
			break;
		}
	}
	var lyrci_container = document.getElementById('lyric_container');
	var p = lyrci_container.getElementsByTagName('p');
	for(var p_i=0; p_i<p.length; p_i++)
	{
		var lyric_timeline = p[p_i].getAttribute('time_line');
		var class_name = p[p_i].getAttribute('class');
		if(lyric_timeline == smaller_time)
		{
			if(p[p_i].className.indexOf('color') == -1)
			{
				p[p_i].className = class_name + ' color'; // hightlight the lyric is being played 
				if(p_i >= 1)
				{
					p[p_i - 1].className = p[p_i - 1].className.replace('color', ''); //unhightlight the lyric played
				}
				lyrci_container.scrollTop += 20;
			}
			break;
		}
	}
}

