/*eslint-disable no-undef*/

const audioNoticeSuccess = require('./assets/audio_notice_success.wav'),
    audioNoticeAlarm = require('./assets/audio_notice_alarm.wav'),
    audioNoticeFail = require('./assets/audio_notice_fail.wav'),
    audioNoticeMsg = require('./assets/audio_notice_msg.wav'),
    audioNoticeDa = require('./assets/audio_notice_da.wav'),
    audioLoadWood = require('./assets/audio_load_wood.wav');

let audio = {
    _au: null,
    _isPlaying: false,
    _play: function (url) {
        if (!this._isPlaying) {
            this._isPlaying = true;
            setTimeout(() => {
                let au = this._au = document.createElement('audio');
                au.onended = () => {
                    this._isPlaying = false;
                };
                au.src = url;
                au.autoplay = true;
            }, 0);
        }
    },
    stop: function () {
        this._au.muted = true;
    },
    tts: function (text) {
        let url = `http://hivoice.cache.tool.budblack.me/TTSServlet?text=${text}&voiceName=boy&voicePitch=50&voiceSpeed=50&voiceVolume=50`;
        this._play(url);
    },
    noticeSuccess: function () {
        // 迅雷下载成功音效
        // this._play('http://fetch.tool.budblack.me/?url=http://jsdx.sc.chinaz.com/files/download/sound1/201202/623.wav');
        this._play(audioNoticeSuccess);
    },
    noticeAlarm: function () {
        // 心跳监控设备的音效
        // this._play('http://fetch.tool.budblack.me/?url=http://jsdx.sc.chinaz.com/Files/DownLoad/sound1/201507/6177.wav');
        this._play(audioNoticeAlarm);
    },
    noticeFail: function () {
        // this._play('http://fetch.tool.budblack.me/?url=http://jsdx.sc.chinaz.com/files/download/sound/huang/cd7/wav/773.wav');
        this._play(audioNoticeFail);
    },
    noticeMsg: function () {
        // this._play('http://fetch.tool.budblack.me/?url=http://jsdx.sc.chinaz.com/Files/DownLoad/sound1/201711/9478.wav');
        this._play(audioNoticeMsg);
    },
    noticDa: function () {
        // this._play('http://fetch.tool.budblack.me/?url=http://gddx.sc.chinaz.com/files/download/sound/zrtq/wav/zrtq18.wav');
        this._play(audioNoticeDa);
    },
    loadWood: function () {
        this._play(audioLoadWood);
    }
};

window['audio']=audio;
export default audio;
