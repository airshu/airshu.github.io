---
title: flutter_sound
toc: true
tags: Flutter
---

Flutter中音频的处理库，可以用来播放、录制。播放支持主流的格式，支持网络地址。




## 播放音频

```dart

import 'package:flutter_sound/flutter_sound.dart';
import 'package:xtechpark/ws_utils/ws_log/ws_logger.dart';

class WSAudioPlayer {
  factory WSAudioPlayer() => _getInstance();

  static WSAudioPlayer get instance => _getInstance();
  static WSAudioPlayer? _instance;

  WSAudioPlayer._internal();

  static WSAudioPlayer _getInstance() {
    _instance ??= WSAudioPlayer._internal();
    return _instance!;
  }

  FlutterSoundPlayer? _player;

  Future init() async {
    _player = FlutterSoundPlayer();

    await _player?.openPlayer().then((value) {
      WSLogger.debug('WSAudioPlayer init ');
    });
    await _player?.setSubscriptionDuration(const Duration(milliseconds: 100));
    _player?.onProgress?.listen((event) {
      WSLogger.debug('WSAudioPlayer onProgress ${event.duration}');
    });
  }

  Future play(String url, [Function()? onFinished]) async {
    if (_player == null) {
      await init();
    }
    if (_player?.playerState == PlayerState.isPlaying) {
      await stop();
    }
    return _player?.startPlayer(fromURI: url, codec: Codec.mp3, whenFinished: onFinished);
  }

  Future stop() async {
    await _player?.stopPlayer();
  }
}


```


## 录制音频

```dart
import 'dart:io';

import 'package:audio_session/audio_session.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:xtechpark/ws_utils/ws_file_util.dart';
import 'package:xtechpark/ws_utils/ws_log/ws_logger.dart';
import 'package:xtechpark/ws_utils/ws_toast_util.dart';
import 'package:path_provider/path_provider.dart';
import 'package:flutter_sound_platform_interface/flutter_sound_recorder_platform_interface.dart';

class WSAudioRecorder {
  factory WSAudioRecorder() => _getInstance();

  static WSAudioRecorder get instance => _getInstance();
  static WSAudioRecorder? _instance;

  WSAudioRecorder._internal();

  static WSAudioRecorder _getInstance() {
    _instance ??= WSAudioRecorder._internal();
    return _instance!;
  }

  FlutterSoundRecorder? _recorder;
  final Codec _codec = Codec.aacADTS;
  String _mPath = 'temp.aac';

  /// 录音时长
  Duration? duration;

  /// 初始化
  Future init() async {
    _recorder = FlutterSoundRecorder();
    await openTheRecorder();
  }

  /// 释放
  dispose() {
    _recorder?.closeRecorder();
    _recorder = null;
  }

  /// 初始化配置
  Future<void> openTheRecorder() async {
    var status = await Permission.microphone.request();
    if (status != PermissionStatus.granted) {
      WSToastUtil.show('Microphone permission not granted');
      return;
    }
    await _recorder?.openRecorder();
    final session = await AudioSession.instance;
    await session.configure(AudioSessionConfiguration(
      avAudioSessionCategory: AVAudioSessionCategory.playAndRecord,
      avAudioSessionCategoryOptions:
          AVAudioSessionCategoryOptions.allowBluetooth | AVAudioSessionCategoryOptions.defaultToSpeaker,
      avAudioSessionMode: AVAudioSessionMode.spokenAudio,
      avAudioSessionRouteSharingPolicy: AVAudioSessionRouteSharingPolicy.defaultPolicy,
      avAudioSessionSetActiveOptions: AVAudioSessionSetActiveOptions.none,
      androidAudioAttributes: const AndroidAudioAttributes(
        contentType: AndroidAudioContentType.speech,
        flags: AndroidAudioFlags.none,
        usage: AndroidAudioUsage.voiceCommunication,
      ),
      androidAudioFocusGainType: AndroidAudioFocusGainType.gain,
      androidWillPauseWhenDucked: true,
    ));

    _recorder?.dispositionStream()?.listen((event) {
      WSLogger.debug('debug dispositionStream：$event');
    });

    _recorder?.setSubscriptionDuration(const Duration(milliseconds: 100));
    _recorder?.onProgress?.listen((e) {
      WSLogger.debug("debug onProgress：${e.decibels} / ${e.duration}");
      duration = e.duration;
    });
    // _mRecorderIsInited = true;
  }

  void startRecord() async {
    if(_recorder == null) {
      await init();
    }
    if(_recorder?.recorderState == RecorderState.isRecording) {
      await _recorder?.stopRecorder();
      return;
    }
    WSLogger.debug("debug startRecord");
    var status = await Permission.microphone.request();
    if (status != PermissionStatus.granted) {
      WSToastUtil.show("Microphone permission not granted");
    } else {
      Directory tempDir = await getTemporaryDirectory();
      _mPath = "${tempDir.path}/${DateTime.now().millisecondsSinceEpoch}.aac";
      _recorder?.startRecorder(
        toFile: _mPath,
        codec: _codec,
        audioSource: AudioSource.microphone,
      );

      WSLogger.debug("debug recording");
    }
  }

  /// 停止录音
  void stopRecord(Function(String path, int duration) finished) async {
    String? path = await _recorder?.stopRecorder();
    if (path == null) {
      WSToastUtil.show('record failed');
      WSLogger.error('record failed  ${_recorder?.recorderState}');
      return;
    }
    if(!await WSFileUtil.isFileExists(path)) {
      WSToastUtil.show('record failed');
      return;
    }
    if(duration != null && duration!.inSeconds < 1) {
      WSToastUtil.show('recording can\'t be less than 1 second');
      return;
    }
    WSLogger.debug("Stop recording: path = $path，duration = ${duration?.inSeconds}");
    if (TargetPlatform.android == defaultTargetPlatform) {
      path = "file://$path";
    }
    finished(path, duration?.inSeconds ?? 0);
  }
}

```


## 参考

- [https://pub.dev/packages/flutter_sound](https://pub.dev/packages/flutter_sound)