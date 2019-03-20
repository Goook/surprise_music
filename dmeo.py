#coding=utf8
import os
import random
def analytical(filepath=None):
# filepath = '..\ConchMusic\static\music'
    ran = [i for i in range(10000,100000)]
    print(os.listdir(filepath))
    for music_user in os.listdir(filepath):
        filepath_music = os.path.join(filepath, music_user)
        with open('./singer_id_to_name.txt', 'a',encoding='utf8') as f_singer:
            singer_id = str(random.sample(ran, 1)[0])
            f_singer.write(singer_id + ',' + music_user+'\n')

        if os.path.isdir(filepath_music):
            for music_name in os.listdir(filepath_music):
                # print(os.path.splitext(os.path.join(filepath_music,music_name)))
                if os.path.splitext(os.path.join(filepath_music,music_name))[1]=='.mp3':
                    with open('./song_id_to_name.txt', 'a', encoding='utf8') as f_song:
                        song_id = str(random.sample(ran,1)[0])
                        f_song.write(song_id+','+''.join(music_name.split('.')[:-1])+'\n')
                    with open('./singer_recommend.txt', 'a',encoding='utf8') as f_recommend:
                        f_recommend.write(singer_id+','+song_id+','+str(random.randint(70,100))+','+str(1300000)+'\n')
if __name__=='__main__':
    analytical(filepath='../music')