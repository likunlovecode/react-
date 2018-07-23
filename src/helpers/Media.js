/**
 * Media 提供多媒体操作
 *
 * @author Porco
 * @date   14/03/2018
 *
 * @example
 * const media = new Media(1); // 1: video, 0: audio
 * media.start((stream) => {
 *      // 录制停止时会触发该回调
 * });
 * media.stop();
 * media.upload(uploadToken, (result) => {
 *      // 上传结果
 * });
 */
import {QINIU} from "../constants/oauth-constants";

class Media {
    constructor(type) {
        this.type = type ? 1 : 0; // 1: video, 0: audio
        this.tracks = '';
        this.stream = '';
        this.mediaRecorder = '';
        this.recordedChunks = '';
        this.isStop = false; // 是否停止状态位
        this.time = 0; // 录制耗时
    }

    /**
     * 开始录制
     * @param callback
     */
    start(callback) {
        const constraints = window.constraints = {
            audio: true,
            video: !!this.type
        };
        const scope = this;
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            scope.success(stream, scope, callback);
            callback(true);
            scope.startAt = new Date();
        }).catch(function (error) {
            console.log(error);
            callback(false);
        });
    }

    /**
     * 停止录制，必须调用此函数后，才能进行后续操作
     */
    stop() {
        if (!this.isStop) {
            this.isStop = true;
            // this.stream.removeTrack(this.tracks[0]);
            this.stream.getTracks().forEach(track => track.stop());
            this.time = new Date().getTime() - this.startAt.getTime();
            this.mediaRecorder.stop();
        }
    }

    /**
     * 内部处理函数，禁止调用
     * @param stream
     * @param scope
     * @param callback
     */
    success(stream, scope, callback) {
        if (this.stream) {
            callback && callback(this.stream, new Error('已存在 video 对象'));
        }
        scope.stream = stream;
        scope.tracks = scope.type ? stream.getVideoTracks() : stream.getAudioTracks();
        stream.oninactive = () => {
            //callback && callback(this.stream, null);
        };
        window.stream = stream;

        const options = {mimeType: 'video/webm; codecs=vp9'};
        scope.recordedChunks = [];
        scope.mediaRecorder = new MediaRecorder(stream, options);

        scope.mediaRecorder.ondataavailable = (e) => {
            scope.recordedChunks.push(e.data);
        };
        scope.mediaRecorder.start();
    }


    /**
     * 上传，必须先调用 stop
     * @param token
     * @param key
     * @param callback
     */
    upload(token, key = false, callback) {
        if (!this.isStop) {
            throw new Error('请先调用 stop 函数');
        }
        setTimeout(() => {
            const blob = new Blob(this.recordedChunks);
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = async (e) => {
                const res = await putb64(e.target.result, token, key);
                callback && callback(res);
            };
            this.isStop = false;
        }, 0);
    }

    /**
     * 取本地 url，可用来本地播放（可离线）
     * @returns blob
     */
    url() {
        if (!this.isStop) {
            throw new Error('请先调用 stop 函数');
        }
        const blob = new Blob(this.recordedChunks);
        return window.URL.createObjectURL(blob);
    }
}


/**
 * 上传 base64 编码的资源至七牛 华北
 * @param base64
 * @param token
 * @returns {Promise}
 */
export async function putb64(base64, token, key) {
    const resource = base64.split('base64,')[1];
    // alert(resource);
    return new Promise((resolve, reject) => {
        const url = `${QINIU.HUADONG.ACTION}/putb64/-1${key ? `/key/${key}` : ''}`;
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                try {
                    const res = JSON.parse(xhr.responseText);
                    resolve(res);
                } catch (e) {
                    resolve(xhr.responseText);
                }
            }
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.setRequestHeader("Authorization", `UpToken ${token}`);
        xhr.send(resource);
    });
}

export default Media;