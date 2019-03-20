# test_sp.py
import requests
import re
from tkinter import *
import os


def rtnkey(event=None):

    # 第一步 获取歌曲ids
    search_api = 'http://music.taihe.com/search'
    # 搜索的关键字, 传递参数, 通过字典构造
    keyword = {'key': e.get()}
    # 创建歌手文件夹
    os.mkdir('./{}'.format(e.get()))
    # 发送请求
    # get请求  params是传递get参数
    response = requests.get(search_api, params=keyword)
    # 取出html源码
    response.encoding = 'utf-8'
    html = response.text
    # 通过正则表达式获取id
    ids = re.findall(r'&quot;id&quot;:&quot;(\d+)&quot;', html)
    print(ids)
    # 第二步 获取歌曲信息
    mp3_info_api = 'http://play.taihe.com/data/music/songlink'
    data = {
        'songIds': ','.join(ids),  # 拼接参数
        'hq': 0, 'type': 'm4a,mp3', 'rate': '',
        'pt': 0, 'flag': -1, 's2p': -1,
        'prerate': -1, 'bwt': -1, 'dur': -1,
        'bat': -1, 'bp': -1, 'pos': -1, 'auto': -1
    }
    # data就是POST的参数
    res = requests.post(mp3_info_api, data=data)
    # 返回的数据是json格式 直接调用json方法, 转成字典
    info = res.json()

    # 第三步 下载歌曲
    # 根据数据的结构, 获取歌曲的信息
    song_info = info['data']['songList']
    # 循环
    for song in song_info:
        # 根据数据结构获取信息
        # 歌名
        song_name = song['songName']
        # mp3地址
        song_link = song['songLink']
        # 格式
        for_mat = song['format']
        # 歌词地址
        lrc_link = song['lrcLink']
        # 写入歌曲信息
        if song_link:
            with open('message.txt', 'at') as f:
                date = song_name + ',' \
                    + '/' + 'music' + '/' + e.get() + '/' + song_name + '.' \
                    + ',' + e.get() + ',' + '\n'
                f.write(date)
        # 下载mp3
        if song_link:  # 有可能没有地址
            song_res = requests.get(song_link)  # 下载
            # 写文件
            with open('./%s/%s.%s' % (e.get(), song_name, for_mat), 'wb') as f:
                f.write(song_res.content)  # 歌曲是二进制
            print(song_link)
        # 下载歌词
        if lrc_link:
            lrc_res = requests.get(lrc_link)

            # 写文件
            with open("./%s/%s.lrc" % (e.get(), song_name), 'w') as f:
                f.write(lrc_res.text)


root = Tk()
e = StringVar()
entry = Entry(root, validate='key', textvariable=e, width=50)
entry.pack()
entry.bind('<Return>', rtnkey)
root.title('输入歌手名')
root.mainloop()
