#coding=utf8
import os
import csv
import random
# def analytical(filepath=None):
# # filepath = '..\ConchMusic\static\music'
#     ran = [i for i in range(10000,100000)]
#     print(os.listdir(filepath))
#     for music_user in os.listdir(filepath):
#         filepath_music = os.path.join(filepath, music_user)
#         # with open('./singer_id_to_name.txt', 'a',encoding='utf8') as f_singer:
#         #     singer_id = str(random.sample(ran, 1)[0])
#         #     f_singer.write(singer_id + ',' + music_user+'\n')
#
#         if os.path.isdir(filepath_music):
#             for music_name in os.listdir(filepath_music):
#                 # print(os.path.splitext(os.path.join(filepath_music,music_name)))
#                 if os.path.splitext(os.path.join(filepath_music,music_name))[1]=='.mp3':
#                     # with open('./song_id_to_name.txt', 'a', encoding='utf8') as f_song:
#                     #     song_id = str(random.sample(ran,1)[0])
#                     #     f_song.write(song_id+','+''.join(music_name.split('.')[:-1])+'\n')
#                     with open('./analytical_file/singer_recommend.txt', 'a',encoding='utf8') as f_recommend:
#                         f_recommend.write(music_user+','+music_name+','+str(random.randint(70,100))+','+str(1300000)+'\n')
#                         # print(music_user+','+music_name)

def playlist_data_preprocessing():
    csv_reader = csv.reader(open('./analytical_file/singer_id_to_name.txt', encoding='utf-8'))
    id_name_dic = {}
    name_id_dic = {}
    for row in csv_reader:
        id_name_dic[row[0]] = row[1]
        name_id_dic[row[1]] = row[0]
    # print(id_name_dic.keys())
    return id_name_dic, name_id_dic


def song_data_preprocessing():
    csv_reader = csv.reader(open('./analytical_file/song_id_to_name.txt', encoding='utf8'))
    id_name_dic = {}
    name_id_dic = {}
    for row in csv_reader:
        id_name_dic[row[0]] = row[1]
        name_id_dic[row[1]] = row[0]

    return id_name_dic, name_id_dic
def recommend():
    id_name_dic, name_id_dic = song_data_preprocessing()
    singerid_name_dic, singername_id_dic = playlist_data_preprocessing()
    with open('./analytical_file/singer_recommend.txt', 'r', encoding='utf-8') as f:
        lists = f.readlines()
        for i in lists:
            i = i.split(',')
            with open('./analytical_file/singer_song.txt', 'a', newline='', encoding='utf-8') as w:
                csvw = csv.writer(w)
                csvw.writerow([name_id_dic.get(i[1].split('.mp')[0],0),singername_id_dic.get(i[0],0), i[2],eval(i[3])])
if __name__=='__main__':
    # analytical(filepath='..\ConchMusic\static\music')
    # n = [12, 15, 56, 12, 48, 56]
    recommend()
    