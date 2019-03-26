# -*- coding:utf-8-*-

from __future__ import (absolute_import, division, print_function, unicode_literals)
import os
import csv
from surprise import KNNBaseline, Reader, KNNBasic, KNNWithMeans, evaluate
from surprise import Dataset


def recommend_model():
    file_path = os.path.expanduser('../analytical_file/singer_recommend.txt')
    # 指定文件格式
    reader = Reader(line_format='user item rating timestamp', sep=',')
    # 从文件读取数据
    music_data = Dataset.load_from_file(file_path, reader=reader)
    # 计算歌曲和歌曲之间的相似度

    train_set = music_data.build_full_trainset()
    print('开始使用协同过滤算法训练推荐模型...')
    algo = KNNBasic()
    algo.fit(train_set)
    return algo


def playlist_data_preprocessing():
    csv_reader = csv.reader(open('../analytical_file/singer_id_to_name.txt', encoding='utf-8'))
    id_name_dic = {}
    name_id_dic = {}
    for row in csv_reader:
        id_name_dic[row[0]] = row[1]
        name_id_dic[row[1]] = row[0]
    # print(id_name_dic.keys())
    return id_name_dic, name_id_dic


def song_data_preprocessing():
    csv_reader = csv.reader(open('../analytical_file/song_id_to_name.txt', encoding='utf8'))
    id_name_dic = {}
    name_id_dic = {}
    for row in csv_reader:
        id_name_dic[row[0]] = row[1]
        name_id_dic[row[1]] = row[0]

    return id_name_dic, name_id_dic
def recommend_data(song_name, source):
    song_id = '100002'
    singer_id = '100003'
    with open('../singer_recommend.txt', 'a') as f:
        size = f.tell()
        f.write(song_id+','+singer_id+','+str(source)+',1300000')
    return size


def playlist_recommend_main(song_name):
    print("加载歌曲id到歌曲名的字典映射...")
    print("加载歌曲名到歌曲id的字典映射...")
    id_name_dic, name_id_dic = song_data_preprocessing()
    # singer_id_name_dic, singer_name_id_dic = playlist_data_preprocessing()
    # if not song_name_id_dic.get(song_name,0):
    print("字典映射成功...")
    print('构建数据集...')
    algo = recommend_model()
    print('模型训练结束...')

    current_playlist_id = name_id_dic.get(song_name, 95886)
    print('当前的歌曲id：' + current_playlist_id)

    current_playlist_name = id_name_dic[current_playlist_id]
    print('当前的歌曲名字：' + current_playlist_name)

    playlist_inner_id = algo.trainset.to_inner_uid(current_playlist_id)
    print('当前的歌曲内部id：' + str(playlist_inner_id))

    playlist_neighbors = algo.get_neighbors(playlist_inner_id, k=10)
    playlist_neighbors_id = (algo.trainset.to_raw_uid(inner_id) for inner_id in playlist_neighbors)
    # 把歌曲id转成歌曲名字
    playlist_neighbors_name = (id_name_dic[playlist_id] for playlist_id in playlist_neighbors_id)
    print("和歌曲<", current_playlist_name, '> 最接近的10个歌曲为：\n')
    # for playlist_name in playlist_neighbors_name:
    #     print(playlist_name, name_id_dic[playlist_name])
    return {'data':[{'song_name':song_name,'song_id':name_id_dic[song_name]} for song_name in playlist_neighbors_name],'message':'success'}


def order_rule(s):
    return int(s.split(',')[2])


def hot_recommend(num = 10):
    with open('../analytical_file/singer_recommend.txt', 'r', encoding='utf8') as f:
        data_list = f.readlines()
    data_list = sorted(data_list, key=order_rule)
    lists = {'data': [],'message':'success'}
    id_name_dic, name_id_dic = song_data_preprocessing()
    try:
        for song_singer_rate_time in data_list[-num:]:
            lists['data'].append(id_name_dic[song_singer_rate_time.split(',')[0]])
    except Exception as e:
        print(e)
    return lists


if __name__ =='__main__':
    data=playlist_recommend_main('微笑着胜利(庆祝建军91周年网宣主题曲)(伴奏)')
    print(data)
    # print(hot_recommend())

# file_path = os.path.expanduser('neteasy_playlist_recommend_data.csv')
# # 指定文件格式
# reader = Reader(line_format='user item rating timestamp', sep=',')
# # 从文件读取数据
# music_data = Dataset.load_from_file(file_path, reader=reader)
# # 分成5折
# music_data.split(n_folds=5)
#
# algo = KNNBasic()
# perf = evaluate(algo, music_data, measures=['RMSE', 'MAE'])
# print(perf)
