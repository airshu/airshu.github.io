---
title: FFMpeg常用命令
tags: ffmpeg
---



```

#格式转换
ffmpeg -i input.avi output.mp4
ffmpeg -i input.mp4 output.ts

#提取音频
ffmpeg -i input.mp4 -acodec copy -vn output.aac

#提取视频
ffmpeg -i input.mp4 -vcodec copy -an output.mp4

#视频剪切  -ss表示开始时间  -t表示长度
ffmpeg -ss 00:00:00 -t 00:00:10 -i input.mp4 -vcodec copy -acodec copy output.mp4

#码率控制  bitrate=filesize/duration，比如一个文件20.8M，时长1分钟，那么，码率就是：
biterate = 20.8M bit/60s = 20.8*1024*1024*8 bit/60s= 2831Kbps
一般音频的码率只有固定几种，比如是128Kbps，那么，video的就是：video biterate = 2831Kbps -128Kbps = 2703Kbps。
ffmpeg -i input.mp4 -b:v 2000k output.mp4
ffmpeg -i input.mp4 -b:v 2000k -bufsize 2000k output.mp4  # 官方建议加上-bufsize，用于设置码率控制缓冲器的大小
ffmpeg -i input.mp4 -b:v 2000k -bufsize 2000k -maxrate 2500k output.mp4  # -minrate -maxrate 最小最大范围

#视频编码格式转换
ffmpeg -i input.mp4 -vcodec h264 output.mp4  #使用h264编码
ffmpeg -i input.mp4 -vcodec mpeg4 output.mp4 #使用mpeg4编码

#视频大小修改
ffmpeg -i input.mp4 -vf scale=960:540 output.mp4   //ps: 如果540不写，写成-1，即scale=960:-1, 那也是可以的，ffmpeg会通知缩放滤镜在输出时保持原始的宽高比

#添加水印
ffmpeg -i input.mp4 -i logo.png -filter_complex overlay output.mp4
ffmpeg -i input.mp4 -i logo.png -filter_complex overlay=W-w output.mp4 #右上角
ffmpeg -i input.mp4 -i logo.png -filter_complex overlay=0:H-h output.mp4 #左下角
ffmpeg -i input.mp4 -i logo.png -filter_complex overlay=W-w:H-h output.mp4 #右下角

#去掉logo
有时候，下载了某个网站的视频，但是有logo很烦，咋办？有办法，用ffmpeg的delogo过滤器。
语法：-vf delogo=x:y:w:h[:t[:show]]
x:y 离左上角的坐标
w:h logo的宽和高
t: 矩形边缘的厚度默认值4
show：若设置为1有一个绿色的矩形，默认值0。
ffmpeg -i input.mp4 -vf delogo=0:0:220:90:100:1 output.mp4

#从视频中获取指定尺寸的缩略图， -ss参数要在-i参数之前
ffmpeg.exe -ss 2672 -i input.mkv  -y -f mjpeg -t 0.01 -s 96x54 U:/xiaodao/src/temp/xxx.jpg

#将gif转成mp4
ffmpeg -f gif -i origin.gif -pix_fmt yuv420p output.mp4


#使用基于GDI的抓屏设备
ffmpeg -f gdigrab -i desktop out.mpg

#从屏幕的（10,20）点处开始，抓取640x480的屏幕，设定帧率为5
ffmpeg -f gdigrab -framerate 5 -offset_x 10 -offset_y 20 -video_size 640x480 -i desktop out.mpg

#设置帧率
ffmpeg -i input.avi -r 29.97 output.mpg

#码率 ABR、CBR、VBR
ffmpeg -i film.avi -b 1.5M film.mp4
ffmpeg -i file.avi -b:v 1500k output.mp4

设置输出文件最大大小
ffmpeg -i input.avi -fs 10MB output.mp4

文件大小计算
video_size = video_bitrate * time_in_seconds / 8
如果音频没有压缩：
audio_size = sampling_rate * bit_depth * channels * time_in_seconds / 8
压缩音频的文件：
audio_size = bitrate * time_in_seconds / 8

缩放视频
ffmpeg -i input_file -s 320x240 output_file
高级缩放 scale=width:height[:interl={1|-1}]
ffmpeg -i input.mpg -vf scale=320:240 output.mp4
根据输入来设置缩放大小
ffmpeg -i input.mpg -vf scale=iw/2:ih*0.9  


裁剪视频 crop=ow[:oh[:x[:y[:keep_aspect]]]]
从左上角裁剪，宽度为原始尺寸的一半，高宽跟原始尺寸一样
ffmpeg -i input -vf crop=iw/2:ih:0:0 output

移动视频 pad=width[:height[:x[:y[:color]]]]
ffmpeg -i photo.jpg -vf pad=860:660:30:30:pink framed_photo.jpg
将视频比例从4:3转为16:9
ffmpeg -i input -vf pad=ih*16/9:ih:(ow-iw)/2:0:color output

翻转和旋转视频
水平翻转
ffplay -f lavfi -i testsrc -vf hflip
旋转     transpose={0, 1, 2, 3}
ffplay -f lavfi -i smptebars -vf transpose=2, vflip

画中画
ffmpeg -i input1 -i input2 -filter_complex overlay=x:y output
水印在右下角
ffmpeg -i pair.mp4 -i logo.png -filter_complex overlay=W-w:H-h pair1.mp4
指定水印开始的时间
ffmpeg -i video_width_timer.mp4 -itsoffset 5 -i logo.png -filter_complex overlay timer_width_logo.mp4

修改速度
ffplay -i input.mpg -vf setpts=PTS/3
快放2倍，取值范围0.5-2.0
ffplay -i speech.mp3 -af atempo=2


创建元数据 -metadata 后面跟键值对
ffmpeg -i input -metadata artist=FFmpeg -metadata title="test" output
保存元数据到文件
ffmpeg -i video.wmv -f ffmetadata data.txt
删除元数据
ffmpeg -i input.avi -map_metadata -l  output.mp4

截图
ffmpeg -i videoclip.avi -ss 01:23:45 image.jpg

获取gif动画
ffmpeg -i promotion.swf -pix_fmt rgb24 promotion.gif

根据图片创建视频
ffmpeg -loop l -i photo.jpg -t 10 photo.mp4

根据多张图片生成视频
ffmpeg -f image2 -i img%d.jpg -r 25 video.mp4

播放rtmp
ffplay "rtmp://live.hkstv.hk.lxdns.com/live/hks"

保存直播流
ffmpeg -i http://60.199.188.151/HLS/WG_ETTV-N/index.m3u8 -c:v copy -c:a copy -bsf:a aac_adtstoasc d:\cap.mp4

从视频中抽离部分生成webp
ffmpeg -t 3 -ss 00:00:01 -i ${video_path} -vf scale=320:-1 -q:v 50 -r 10 -compression_level 6 -vcodec libwebp -loop 0 ${output_path}

从视频中提取关键帧图片
ffmpeg -i video_name.mp4 -vf select='eq(pict_type\,I)' -vsync 2 -s 1920*1080 -f image2 keyframe-%02d.jpeg


计算视频的时长
ffmpeg -i source.mp4 2>&1 | grep 'Duration' | cut -d ' ' -f 4 | sed s/,//

合并两个视频
实用文件的方式：
1. 编写filetext.txt文件
file ‘a.mp4’
file ‘b.mp4’
2. 执行命令
ffmpeg -f concat -i filelist.txt -c copy  output.mp4
直接用命令行
ffmpeg -i “concat:a.mp4|b.mp4" -c copy  output.mp4
```

